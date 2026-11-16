import { normalizeEmailAddress } from "@openbot/contracts/validation";
import { Effect } from "effect";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { randomToken, sha256 } from "./crypto";
import { D1AuthRepository } from "./d1-auth-repository";
import { PERSISTENT_SESSION_EXPIRES_AT } from "./session-policy";
import type { WorkerBindings } from "./types";

const PREFIX = "/api/browser/google/";
const FLOW_COOKIE = "__Host-eqbots-google";
const SESSION_COOKIE = "__Host-openbot-web";
const ATTRIBUTES = "Path=/; Secure; HttpOnly; SameSite=Lax";
const GOOGLE_KEYS = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));

function redirect(location: string, cookies: string[]): Response {
  const headers = new Headers({ Location: location, "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" });
  for (const cookie of cookies) headers.append("Set-Cookie", cookie);
  return new Response(null, { status: 303, headers });
}

export async function handleGoogleSignIn(
  request: Request,
  bindings: WorkerBindings,
  usesCompanySignIn: (email: string) => Promise<boolean>,
): Promise<Response | null> {
  const url = new URL(request.url);
  if (!url.pathname.startsWith(PREFIX)) return null;
  if (request.method !== "GET") return new Response(null, { status: 405, headers: { Allow: "GET" } });

  const clientId = bindings.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = bindings.GOOGLE_OAUTH_CLIENT_SECRET;
  const origin = bindings.GOOGLE_OAUTH_ORIGIN ?? url.origin;
  const callback = new URL(`${PREFIX}callback`, origin).href;
  const action = url.pathname.slice(PREFIX.length);
  const enabled = Boolean(clientId && clientSecret);
  if (action === "status") {
    return Response.json({ enabled }, { headers: { "Cache-Control": "no-store" } });
  }
  if (!clientId || !clientSecret) return new Response("Google sign-in is unavailable.", { status: 503 });

  if (action === "start") {
    if (request.headers.get("Sec-Fetch-Site") === "cross-site") return new Response(null, { status: 403 });
    const state = randomToken();
    const verifier = randomToken();
    const nonce = randomToken();
    const target = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    target.search = new URLSearchParams({
      client_id: clientId,
      redirect_uri: callback,
      response_type: "code",
      scope: "openid email",
      state,
      nonce,
      code_challenge: await Effect.runPromise(sha256(verifier)),
      code_challenge_method: "S256",
    }).toString();
    return redirect(target.href, [`${FLOW_COOKIE}=${state}.${verifier}.${nonce}; ${ATTRIBUTES}; Max-Age=600`]);
  }
  if (action !== "callback") return new Response(null, { status: 404 });

  const cookies = [`${FLOW_COOKIE}=; ${ATTRIBUTES}; Max-Age=0`];
  const flow = request.headers
    .get("Cookie")
    ?.split(/;\s*/u)
    .find((part) => part.startsWith(`${FLOW_COOKIE}=`));
  const [state, verifier, nonce] = flow?.slice(FLOW_COOKIE.length + 1).split(".") ?? [];
  const code = url.searchParams.get("code");
  const failed = () => redirect("/app?google_sign_in=failed", cookies);
  if (!state || !verifier || !nonce || !code || url.searchParams.get("state") !== state) return failed();
  try {
    const token = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: callback,
        code,
        code_verifier: verifier,
        grant_type: "authorization_code",
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!token.ok) return failed();
    const { id_token: idToken } = await token.json<{ id_token?: unknown }>();
    if (typeof idToken !== "string") return failed();
    const { payload } = await jwtVerify(idToken, GOOGLE_KEYS, {
      issuer: ["https://accounts.google.com", "accounts.google.com"],
      audience: clientId,
      algorithms: ["RS256"],
      requiredClaims: ["sub", "exp", "iat", "email", "nonce"],
    });
    const email = typeof payload.email === "string" ? normalizeEmailAddress(payload.email) : null;
    // Google is authoritative for Gmail and managed Google Workspace addresses. Other verified
    // Google addresses can change owners independently. Email-code sign-in remains available.
    const authoritativeEmail = email && (email.endsWith("@gmail.com") || typeof payload.hd === "string");
    if (
      !email ||
      !authoritativeEmail ||
      payload.email_verified !== true ||
      payload.nonce !== nonce ||
      (payload.azp !== undefined && payload.azp !== clientId) ||
      (await usesCompanySignIn(email))
    )
      return failed();
    const sessionToken = randomToken();
    const repository = new D1AuthRepository(bindings.DB);
    await Effect.runPromise(
      repository.createVerifiedBrowserSession(
        email,
        {
          id: crypto.randomUUID(),
          token: sessionToken,
          expiresAt: PERSISTENT_SESSION_EXPIRES_AT,
        },
        Date.now(),
      ),
    );
    cookies.push(`${SESSION_COOKIE}=${sessionToken}; ${ATTRIBUTES}; Max-Age=34560000`);
    return redirect("/app", cookies);
  } catch {
    return failed();
  }
}
