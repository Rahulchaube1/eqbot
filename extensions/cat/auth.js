const crypto = require("node:crypto");
const http = require("node:http");
const vscode = require("vscode");

const ACCOUNT_ORIGIN = "https://eqbots-account.artisticmap.workers.dev";
const CONNECT_URL = "https://eqbot.everestqai.com/api/browser/editor/connect";
const SESSION_KEY = "cat.account.session";
const CALLBACK_PATH = "/cat/callback";
const WAIT_MS = 5 * 60 * 1000;

async function accountRequest(path, { method = "GET", body, token } = {}) {
  const headers = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body) headers["Content-Type"] = "application/json";
  const response = await fetch(ACCOUNT_ORIGIN + path, {
    method,
    headers,
    body: body && JSON.stringify(body),
    redirect: "error",
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) {
    const message =
      response.status === 401
        ? "Your Cat session or sign-in code has expired. Sign in again."
        : response.status === 429
          ? "Cat received too many requests. Try again in a few minutes."
          : "The Cat account service could not complete the request. Try again.";
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  if (response.status === 204) return;
  return response.json();
}

function validUser(user) {
  return user && typeof user.id === "string" && user.id && typeof user.email === "string" && user.email;
}

async function requestBrowserCode(intent, state, challenge, cancellation) {
  const controller = new AbortController();
  const cancel = () => controller.abort();
  const disposable = cancellation.onCancellationRequested(cancel);
  let timedOut = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    cancel();
  }, WAIT_MS);
  let localHost;
  let receiveCode;
  const received = new Promise((resolve) => {
    receiveCode = resolve;
  });
  controller.signal.addEventListener("abort", () => receiveCode(undefined), { once: true });
  const server = http.createServer((req, res) => {
    const reply = (status, message) => {
      res.writeHead(status, {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
        "Referrer-Policy": "no-referrer",
        "X-Content-Type-Options": "nosniff",
        Connection: "close",
      });
      res.end(message);
    };
    if (req.method !== "GET" || req.headers.host !== localHost || !req.url?.startsWith(CALLBACK_PATH + "?")) {
      return reply(404, "Page not found.");
    }
    const params = new URL(req.url, `http://${localHost}`).searchParams;
    if (params.get("state") !== state) return reply(400, "This request does not match the open Cat sign-in.");
    if (params.get("error") === "access_denied") {
      reply(200, "Sign-in canceled. You can close this tab.");
      return receiveCode(undefined);
    }
    const code = params.get("code");
    if (!code || !/^[a-zA-Z0-9_-]{43}$/.test(code)) return reply(400, "The sign-in code is invalid.");
    reply(200, "Return to your editor to finish signing in to Cat. You can close this tab.");
    receiveCode(code);
  });
  server.headersTimeout = 5000;
  server.requestTimeout = 5000;
  try {
    if (cancellation.isCancellationRequested) return;
    await new Promise((resolve, reject) => {
      server.once("error", reject);
      server.listen(0, "127.0.0.1", resolve);
    });
    if (controller.signal.aborted) return;
    const port = String(server.address().port);
    localHost = "127.0.0.1:" + port;
    const url = new URL(CONNECT_URL);
    url.hash = new URLSearchParams({ challenge, state, port, intent }).toString();
    if (!(await vscode.env.openExternal(vscode.Uri.parse(url.href)))) {
      throw new Error("Your browser could not open the Cat sign-in page.");
    }
    const code = await received;
    if (timedOut) throw new Error("Cat sign-in timed out. Start sign-in again from your editor.");
    return code;
  } finally {
    disposable.dispose();
    clearTimeout(timeout);
    server.close();
    server.closeAllConnections();
  }
}

function registerAccountCommands(context) {
  const secrets = context.secrets;
  let busy = false;
  async function updateContext() {
    const present = Boolean(await secrets.get(SESSION_KEY));
    await vscode.commands.executeCommand("setContext", "cat.signedIn", present);
  }
  async function clearIfCurrent(token) {
    if ((await secrets.get(SESSION_KEY)) === token) await secrets.delete(SESSION_KEY);
    await updateContext();
  }
  async function account() {
    const token = await secrets.get(SESSION_KEY);
    if (!token) {
      void vscode.window.showInformationMessage("Sign in to Cat to view your account.");
      return;
    }
    try {
      const user = await accountRequest("/v1/me", { token });
      if (!validUser(user)) throw new Error("Cat returned an invalid account profile.");
      void vscode.window.showInformationMessage(`Signed in to Cat as ${user.email}.`);
    } catch (error) {
      if (error.status === 401) await clearIfCurrent(token);
      throw error;
    }
  }
  async function signIn(intent) {
    if (await secrets.get(SESSION_KEY)) return account();
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: "Cat account",
        cancellable: true,
      },
      async (progress, cancellation) => {
        progress.report({ message: "Approve access in your browser." });
        const verifier = crypto.randomBytes(32).toString("base64url");
        const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");
        const state = crypto.randomBytes(32).toString("base64url");
        const code = await requestBrowserCode(intent, state, challenge, cancellation);
        if (!code || cancellation.isCancellationRequested) return;
        progress.report({ message: "Connecting your account…" });
        const session = await accountRequest("/api/browser/editor/exchange", {
          method: "POST",
          body: { code, codeVerifier: verifier },
        });
        if (!session || typeof session.sessionToken !== "string" || !session.sessionToken || !validUser(session.user)) {
          throw new Error("Cat returned an invalid sign-in response.");
        }
        const revoke = () => accountRequest("/v1/auth/logout", { method: "POST", token: session.sessionToken });
        if (cancellation.isCancellationRequested) {
          await revoke();
          return;
        }
        try {
          await secrets.store(SESSION_KEY, session.sessionToken);
        } catch (error) {
          await revoke();
          throw error;
        }
        await updateContext();
        void vscode.window.showInformationMessage(`Signed in to Cat as ${session.user.email}.`);
      },
    );
  }
  async function signOut() {
    const token = await secrets.get(SESSION_KEY);
    if (!token) return updateContext();
    try {
      await accountRequest("/v1/auth/logout", { method: "POST", token });
    } catch (error) {
      if (error.status !== 401) {
        void vscode.window.showWarningMessage(
          "Signed out of this editor. Cat could not confirm revocation. Review your devices in the Cat workspace.",
        );
        return;
      }
    } finally {
      await clearIfCurrent(token);
    }
    void vscode.window.showInformationMessage("Signed out of Cat.");
  }
  const commands = { signIn: () => signIn("signin"), signUp: () => signIn("signup"), signOut, account };
  for (const [name, action] of Object.entries(commands)) {
    context.subscriptions.push(
      vscode.commands.registerCommand("cat." + name, async () => {
        if (busy) return;
        busy = true;
        try {
          await action();
        } catch (error) {
          void vscode.window.showErrorMessage(
            error instanceof Error ? error.message : "Cat could not complete this request.",
          );
        } finally {
          busy = false;
        }
      }),
    );
  }
  context.subscriptions.push(
    secrets.onDidChange((event) => {
      if (event.key === SESSION_KEY) void updateContext();
    }),
  );
  return updateContext();
}

module.exports = { registerAccountCommands };
