import { Effect } from "effect";
import type { AuthService } from "./auth-service";
import { randomToken } from "./crypto";
import consentScript from "./editor-consent.js?raw";
import { runApiResponse } from "./effect-runtime";
import { readJsonObject } from "./json-body";
import { apiError, authErrorResponse, json } from "./request-auth";
import { requestSourceIp } from "./source-ip";

export function exchangeEditorCode(request: Request, auth: Pick<AuthService, "redeemServerClaim">): Promise<Response> {
  // Native client only. Cookies and browser credentials are never considered for exchange.
  if (
    request.headers.has("Origin") ||
    request.headers.has("Cookie") ||
    request.headers.get("Content-Type")?.split(";")[0]?.trim() !== "application/json"
  ) {
    return Promise.resolve(apiError(403, "editor_exchange_refused", "Use Cat in VS Code to complete sign-in."));
  }
  return runApiResponse(
    Effect.gen(function* () {
      const { code, codeVerifier } = yield* readJsonObject(request);
      if (
        typeof code !== "string" ||
        !/^[A-Za-z0-9_-]{43}$/u.test(code) ||
        typeof codeVerifier !== "string" ||
        !/^[A-Za-z0-9._~-]{43,128}$/u.test(codeVerifier)
      ) {
        return apiError(400, "invalid_editor_exchange", "Restart the connection from Cat in VS Code.");
      }
      const { sessionToken, user } = yield* auth.redeemServerClaim(code, requestSourceIp(request), codeVerifier);
      return json({
        sessionToken,
        user: { id: user.id, email: user.email, ...(user.name ? { name: user.name } : {}) },
      });
    }),
    authErrorResponse,
  );
}

export function editorConsentPage(): Response {
  const nonce = randomToken();
  const headers = new Headers({
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Content-Security-Policy": `default-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'; script-src 'nonce-${nonce}'; style-src 'nonce-${nonce}'; connect-src 'self'; img-src 'self'`,
  });
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Connect Cat to VS Code</title>
<style nonce="${nonce}">
:root{color-scheme:dark;font:16px/1.55 system-ui;color:#eef1eb;background:#11191d}
body{margin:0;display:grid;min-height:100svh;place-items:center}
main{max-width:30rem;margin:1rem;padding:clamp(1.5rem,5vw,3rem);border:1px solid #37474a;border-radius:12px;background:#192326}
h1{line-height:1.12}p{overflow-wrap:anywhere}button,a{font:inherit}button{padding:.65rem 1rem;border:1px solid #50605c;border-radius:6px;cursor:pointer;color:inherit;background:transparent}
button:disabled{opacity:.6;cursor:wait}#allow{background:#abe4ce;color:#142322}a{color:#abe4ce}a:focus-visible,button:focus-visible{outline:3px solid #d8a77d;outline-offset:3px}
</style></head><body><main><img src="/icon-192x192.png" width="44" height="44" alt="Cat"><p>Cat by EverestQai</p><h1>Connect Cat to VS Code</h1>
<p id="status" role="status">Checking your Cat account…</p>
<div id="login" hidden><p><a href="/api/browser/google/start?return=editor">Continue with Google</a></p><p>For another sign-in method, <a href="/app" target="_blank" rel="noopener noreferrer">open Cat</a>, then <button id="refresh" type="button">Check again</button>.</p></div>
<div id="consent" hidden><p>Allow the Cat extension on this computer to access your Cat account with a desktop session? You can revoke the session in your Cat account settings.</p>
<button id="allow" type="button">Allow access</button> <button id="cancel" type="button">Cancel</button></div>
<noscript>Enable JavaScript to connect the editor.</noscript></main><script nonce="${nonce}">${consentScript}</script></body></html>`,
    { headers },
  );
}
