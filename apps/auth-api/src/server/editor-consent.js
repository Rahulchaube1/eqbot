// Runs only on the consent page. The verifier stays in the extension.
(async () => {
  const status = document.getElementById("status");
  const login = document.getElementById("login");
  const consent = document.getElementById("consent");
  const allow = document.getElementById("allow");
  const key = "cat.editor.connect.v1";
  let user;
  try {
    const fragment = location.hash.slice(1);
    if (fragment) {
      sessionStorage.removeItem(key);
      const fields = new URLSearchParams(fragment);
      const challenge = fields.get("challenge");
      const state = fields.get("state");
      const port = Number(fields.get("port"));
      if (
        !challenge ||
        !state ||
        !/^[A-Za-z0-9_-]{43}$/.test(challenge) ||
        !/^[A-Za-z0-9_-]{43}$/.test(state) ||
        !Number.isInteger(port) ||
        port < 1024 ||
        port > 65535
      ) {
        throw new Error("invalid connection");
      }
      sessionStorage.setItem(key, JSON.stringify({ challenge, state, port, until: Date.now() + 10 * 60_000 }));
      history.replaceState(null, "", location.pathname);
    }
    const flow = JSON.parse(sessionStorage.getItem(key));
    if (!flow || Date.now() >= flow.until) throw new Error("expired");
    const failedGoogle = new URLSearchParams(location.search).get("google_sign_in") === "failed";
    const check = async () => {
      const result = await fetch("/api/browser/session", { cache: "no-store" });
      if (result.status === 401) {
        consent.hidden = true;
        login.hidden = false;
        status.textContent = failedGoogle
          ? "Google sign-in did not finish. Try again or use another sign-in method."
          : "Sign in to Cat to choose the account you want to connect.";
        return;
      }
      if (!result.ok) throw new Error("session unavailable");
      user = (await result.json()).user;
      status.textContent = "Signed in as " + user.email;
      login.hidden = true;
      consent.hidden = false;
    };
    document.getElementById("refresh").onclick = () => {
      location.reload();
    };
    document.getElementById("cancel").onclick = () => {
      sessionStorage.removeItem(key);
      consent.hidden = true;
      status.textContent = "Connection canceled. You can close this tab.";
      const target = new URL("http://127.0.0.1:" + flow.port + "/cat/callback");
      target.search = new URLSearchParams({ error: "access_denied", state: flow.state }).toString();
      location.replace(target.href);
    };
    allow.onclick = async () => {
      allow.disabled = true;
      document.getElementById("cancel").disabled = true;
      try {
        if (Date.now() >= flow.until) throw new Error("expired");
        const response = await fetch("/api/browser/editor/approve", {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-OpenBot-Browser": "1" },
          body: JSON.stringify({ accountId: user.id, challenge: flow.challenge, state: flow.state, port: flow.port }),
        });
        if (!response.ok) throw new Error("approval failed");
        const target = new URL((await response.json()).callback);
        if (
          target.origin !== "http://127.0.0.1:" + flow.port ||
          target.pathname !== "/cat/callback" ||
          target.searchParams.get("state") !== flow.state
        )
          throw new Error("invalid callback");
        sessionStorage.removeItem(key);
        status.textContent = "Returning to Cat in VS Code…";
        location.replace(target.href);
      } catch {
        consent.hidden = true;
        status.textContent = "The connection could not finish. Restart sign-in from Cat in VS Code.";
      }
    };
    await check();
  } catch {
    consent.hidden = true;
    login.hidden = true;
    status.textContent = "Start sign-in from Cat in VS Code to connect this browser.";
  }
})();
