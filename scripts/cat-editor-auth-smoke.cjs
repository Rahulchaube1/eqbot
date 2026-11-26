const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const Module = require("node:module");
const { test } = require("node:test");

test("Cat editor verifies browser state, exchanges PKCE and revokes its saved session", async (t) => {
  const nativeFetch = global.fetch;
  const callbacks = new Map();
  const secrets = new Map();
  const requests = [];
  const notices = [];
  let challenge, intent, signedIn, cancel;
  const accessCode = crypto.randomBytes(32).toString("base64url");
  const user = { id: "test-user", email: "test@example.invalid" };
  const disposable = { dispose() {} };
  const vscode = {
    commands: {
      registerCommand(id, handler) {
        callbacks.set(id, handler);
        return disposable;
      },
      async executeCommand(command, key, value) {
        assert.equal(command, "setContext");
        assert.equal(key, "cat.signedIn");
        signedIn = value;
      },
    },
    ProgressLocation: { Notification: 15 },
    window: {
      showInformationMessage: (msg) => notices.push(msg),
      showErrorMessage: (msg) => notices.push(msg),
      withProgress: (_, run) =>
        run(
          { report() {} },
          {
            isCancellationRequested: false,
            onCancellationRequested(handler) {
              cancel = handler;
              return disposable;
            },
          },
        ),
    },
    Uri: { parse: (url) => new URL(url) },
    env: {
      async openExternal(url) {
        assert.equal(url.origin + url.pathname, "https://eqbot.everestqai.com/api/browser/editor/connect");
        const fragment = new URLSearchParams(url.hash.slice(1));
        challenge = fragment.get("challenge");
        intent = fragment.get("intent");
        assert.match(challenge, /^[\w-]{43}$/);
        assert.match(fragment.get("state"), /^[\w-]{43}$/);
        assert.equal(fragment.has("codeVerifier"), false);
        if (intent === "signup") {
          cancel();
          return true;
        }
        const redirect = new URL(`http://127.0.0.1:${fragment.get("port")}/cat/callback`);
        redirect.searchParams.set("code", accessCode);
        redirect.searchParams.set("state", "mismatch");
        assert.equal((await nativeFetch(redirect)).status, 400);
        redirect.searchParams.set("state", fragment.get("state"));
        const accepted = await nativeFetch(redirect);
        assert.equal(accepted.status, 200);
        await accepted.text();
        return true;
      },
    },
  };
  const originalLoad = Module._load;
  const loader = t.mock.method(Module, "_load", function (id, ...args) {
    if (id === "vscode") return vscode;
    return originalLoad.call(this, id, ...args);
  });
  const { registerAccountCommands } = require("../extensions/cat/auth.js");
  loader.mock.restore();
  t.mock.method(global, "fetch", async (url, options) => {
    const parsed = new URL(url);
    assert.equal(parsed.origin, "https://eqbots-account.artisticmap.workers.dev");
    assert.equal(options.redirect, "error");
    requests.push(parsed.pathname);
    if (parsed.pathname === "/api/browser/editor/exchange") {
      const { code, codeVerifier } = JSON.parse(options.body);
      assert.equal(code, accessCode);
      assert.equal(crypto.createHash("sha256").update(codeVerifier).digest("base64url"), challenge);
      return Response.json({ sessionToken: "example-session", user });
    }
    assert.equal(options.headers.Authorization, "Bearer example-session");
    if (parsed.pathname === "/v1/me") return Response.json(user);
    assert.equal(parsed.pathname, "/v1/auth/logout");
    return new Response(null, { status: 204 });
  });
  await registerAccountCommands({
    subscriptions: [],
    secrets: {
      get: (key) => secrets.get(key),
      store: (key, value) => secrets.set(key, value),
      delete: (key) => secrets.delete(key),
      onDidChange: () => disposable,
    },
  });
  assert.equal(signedIn, false);
  await callbacks.get("cat.signIn")();
  assert.equal(intent, "signin");
  assert.equal(signedIn, true);
  await callbacks.get("cat.account")();
  assert.ok(notices.some((text) => text.includes(user.email)));
  await callbacks.get("cat.signOut")();
  assert.equal(signedIn, false);
  assert.equal(secrets.size, 0);
  await callbacks.get("cat.signUp")();
  assert.equal(intent, "signup");
  assert.deepEqual(requests, ["/api/browser/editor/exchange", "/v1/me", "/v1/auth/logout"]);
});
