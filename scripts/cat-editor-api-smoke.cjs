// Exercise browser consent, PKCE exchange and account session revocation against isolated D1.
const assert = require("node:assert/strict");
const { randomBytes, createHash } = require("node:crypto");
const { readFileSync, readdirSync } = require("node:fs");
const { resolve } = require("node:path");
const { DatabaseSync } = require("node:sqlite");
const { build } = require("esbuild");
const { Miniflare, convertV4MiniflareOptions } = require("miniflare");

const root = resolve(__dirname, "..");
const origin = "https://cat-editor.test";
const token = () => randomBytes(32).toString("base64url");
const digest = (value) => createHash("sha256").update(value).digest("base64url");

async function smoke() {
  const serverDir = resolve(root, "apps/auth-api/src/server");
  const result = await build({
    stdin: {
      contents: `
      import { AuthService } from "./auth-service";
      import { D1AuthRepository } from "./d1-auth-repository";
      import { handleBrowserApi } from "./browser-api";
      import { editorConsentPage, exchangeEditorCode } from "./editor-connect";
      import { handleGoogleSignIn } from "./google-sign-in";
      import { authErrorResponse } from "./request-auth";
      export default { async fetch(request, env) {
        const auth = new AuthService({ repository: new D1AuthRepository(env.DB), delivery: null });
        const path = new URL(request.url).pathname;
        if (path === "/api/browser/editor/connect") return editorConsentPage();
        if (path === "/api/browser/editor/exchange") return exchangeEditorCode(request, auth);
        if (path === "/provision") {
          const result = await import("./effect-runtime").then(m => m.runApiEffect(auth.redeemServerClaim(request.headers.get("X-Claim"), "127.0.0.1")).catch(authErrorResponse));
          return result instanceof Response ? result : Response.json(result);
        }
        if (path.startsWith("/api/browser/google/")) return handleGoogleSignIn(request, env, async () => false);
        return handleBrowserApi(request, { auth, errorResponse: authErrorResponse });
      }};
    `,
      resolveDir: serverDir,
      loader: "ts",
    },
    bundle: true,
    define: { "import.meta.env": "{}" },
    platform: "browser",
    format: "esm",
    write: false,
    external: ["cloudflare:*", "node:*"],
    conditions: ["workerd", "worker"],
    plugins: [
      {
        name: "consent-script",
        setup(b) {
          b.onResolve({ filter: /editor-consent\.js\?raw$/ }, () => ({
            path: resolve(serverDir, "editor-consent.js"),
            namespace: "raw",
          }));
          b.onLoad({ filter: /.*/, namespace: "raw" }, (args) => ({
            contents: readFileSync(args.path, "utf8"),
            loader: "text",
          }));
        },
      },
    ],
  });
  const mf = new Miniflare(convertV4MiniflareOptions({
    modules: true,
    compatibilityDate: "2025-10-01",
    compatibilityFlags: ["nodejs_compat"],
    script: result.outputFiles[0].text,
    d1Databases: ["DB"],
    bindings: {
      GOOGLE_OAUTH_CLIENT_ID: "test-client",
      GOOGLE_OAUTH_CLIENT_SECRET: "test-secret",
      GOOGLE_OAUTH_ORIGIN: origin,
    },
  }));
  const schema = new DatabaseSync(":memory:");
  try {
    for (const file of readdirSync(resolve(root, "apps/auth-api/migrations")).sort()) {
      schema.exec(readFileSync(resolve(root, "apps/auth-api/migrations", file), "utf8"));
    }
    const db = await mf.getD1Database("DB");
    const definitions = schema
      .prepare(
        "SELECT sql FROM sqlite_schema WHERE sql IS NOT NULL AND name NOT LIKE 'sqlite_%' ORDER BY CASE type WHEN 'table' THEN 0 WHEN 'index' THEN 1 ELSE 2 END",
      )
      .all();
    for (const { sql } of definitions) await db.prepare(sql).run();
    const userId = crypto.randomUUID(),
      browserToken = token(),
      verifier = token(),
      challenge = digest(verifier),
      state = token(),
      port = 53142;
    await db
      .prepare("INSERT INTO users(id,identity_key,email,created_at,updated_at) VALUES(?,?,?,0,0)")
      .bind(userId, "test@example.test", "test@example.test")
      .run();
    await db
      .prepare(
        "INSERT INTO auth_sessions(id,user_id,token_hash,created_at,last_used_at,expires_at) VALUES (?,?,?,0,0,?)",
      )
      .bind(crypto.randomUUID(), userId, digest(browserToken), Date.now() + 3600000)
      .run();
    const browserHeaders = {
      "content-type": "application/json",
      origin,
      "X-OpenBot-Browser": "1",
      cookie: "__Host-openbot-web=" + browserToken,
    };
    const authorize = (overrides = {}, headers = browserHeaders) =>
      mf.dispatchFetch(origin + "/api/browser/editor/approve", {
        method: "POST",
        headers,
        body: JSON.stringify({ challenge, state, port, accountId: userId, ...overrides }),
      });
    const redeem = (code, codeVerifier, extra = {}) =>
      mf.dispatchFetch(origin + "/api/browser/editor/exchange", {
        method: "POST",
        headers: { "content-type": "application/json", ...extra },
        body: JSON.stringify({ code, codeVerifier }),
      });
    const consent = await mf.dispatchFetch(origin + "/api/browser/editor/connect");
    assert.match(consent.headers.get("content-security-policy"), /frame-ancestors 'none'/);
    assert.match(await consent.text(), /Allow access/);
    assert.equal((await authorize({}, { ...browserHeaders, origin: "https://unrelated.test" })).status, 403);
    assert.equal((await authorize({}, { ...browserHeaders, "X-OpenBot-Browser": "" })).status, 403);
    assert.equal((await authorize({}, { ...browserHeaders, cookie: "" })).status, 401);
    assert.equal((await authorize({ port: "https://unrelated.test" })).status, 400);
    assert.equal((await authorize({ accountId: "different" })).status, 400);
    const approved = await authorize();
    assert.equal(approved.status, 200);
    const callback = new URL((await approved.json()).callback),
      code = callback.searchParams.get("code");
    assert.equal(callback.origin, "http://127.0.0.1:" + port);
    assert.equal(callback.pathname, "/cat/callback");
    assert.equal(callback.searchParams.get("state"), state);
    assert.equal((await mf.dispatchFetch(origin + "/provision", { headers: { "X-Claim": code } })).status, 401);
    assert.equal((await redeem(code, token())).status, 401);
    assert.equal((await redeem(code, verifier, { origin })).status, 403);
    const results = await Promise.all([redeem(code, verifier), redeem(code, verifier)]);
    assert.deepEqual(results.map((r) => r.status).sort(), [200, 401]);
    const grant = await results.find((r) => r.status === 200).json();
    assert.equal(grant.user.id, userId);
    const session = await db
      .prepare("SELECT id FROM auth_sessions WHERE token_hash=?")
      .bind(digest(grant.sessionToken))
      .first();
    assert(session.id);
    const revoked = await mf.dispatchFetch(origin + "/api/browser/v1/me/sessions/" + session.id, {
      method: "DELETE",
      headers: browserHeaders,
    });
    assert.equal(revoked.status, 204);
    assert.equal(
      (
        await mf.dispatchFetch(origin + "/api/browser/session", {
          headers: { cookie: "__Host-openbot-web=" + grant.sessionToken },
        })
      ).status,
      401,
    );
    const other = await authorize();
    const expired = new URL((await other.json()).callback).searchParams.get("code");
    await db.prepare("UPDATE server_claims SET expires_at=0 WHERE redeemed_at IS NULL").run();
    assert.equal((await redeem(expired, verifier)).status, 401);
    for (const [suffix, returnPath] of [
      ["", "/app"],
      ["?return=editor", "/api/browser/editor/connect"],
    ]) {
      const begin = await mf.dispatchFetch(origin + "/api/browser/google/start" + suffix, { redirect: "manual" });
      assert.equal(begin.status, 303);
      assert.equal(new URL(begin.headers.get("location")).hostname, "accounts.google.com");
      const back = await mf.dispatchFetch(origin + "/api/browser/google/callback?error=access_denied", {
        redirect: "manual",
        headers: { cookie: begin.headers.get("set-cookie").split(";")[0] },
      });
      assert.equal(back.headers.get("location"), returnPath + "?google_sign_in=failed");
    }
    console.log(
      "PASS: real D1 consent, CSRF, loopback restriction, PKCE isolation, replay, expiry, session revocation and Google return routing",
    );
  } finally {
    schema.close();
    await mf.dispose();
  }
}
smoke().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
