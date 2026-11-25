import { createFileRoute } from "@tanstack/solid-router";
import { createSignal, For, Show } from "solid-js";
import { SiteHeader } from "../components/landing/SiteHeader";
import { LandingFooter } from "../components/landing/LandingFooter";
import { LandingIcon } from "../components/landing/LandingIcon";

export const Route = createFileRoute("/cat-ship")({
  head: () => ({ meta: [{ title: "Cat-Ship · Pull request review" }] }),
  component: ShipPage,
});

interface Pull {
  title: string;
  state: string;
  merged: boolean;
  draft: boolean;
  head: { sha: string };
  changed_files: number;
  additions: number;
  deletions: number;
}
interface Check {
  name: string;
  status: string;
  conclusion: string | null;
}
interface Report {
  pull: Pull;
  checks: Check[];
  total: number;
  legacy: string | null;
  url: string;
}

async function github<T>(path: string): Promise<T> {
  const response = await fetch("https://api.github.com/repos/" + path, { credentials: "omit" });
  if (response.status === 404) throw new Error("This public pull request could not be found.");
  if (response.status === 403 || response.status === 429)
    throw new Error("GitHub has limited requests. Try again later.");
  if (!response.ok) throw new Error("GitHub could not return the review data. Try again.");
  return response.json();
}

function ShipPage() {
  const [link, setLink] = createSignal("");
  const [busy, setBusy] = createSignal(false);
  const [error, setError] = createSignal("");
  const [report, setReport] = createSignal<Report | null>(null);
  async function inspect() {
    if (busy()) return;
    setReport(null);
    setError("");
    const match = /^https:\/\/github\.com\/([\w.-]+)\/([\w.-]+)\/pull\/(\d+)\/?$/.exec(link().trim());
    if (!match) {
      setError("Enter a public GitHub pull request URL ending in /pull/number.");
      return;
    }
    setBusy(true);
    try {
      const repo = match[1] + "/" + match[2];
      const pull = await github<Pull>(repo + "/pulls/" + match[3]);
      const commit = repo + "/commits/" + pull.head.sha;
      const [suite, status] = await Promise.all([
        github<{ check_runs: Check[]; total_count: number }>(commit + "/check-runs?per_page=100"),
        github<{ state: string; total_count: number }>(commit + "/status"),
      ]);
      setReport({
        pull,
        checks: suite.check_runs,
        total: suite.total_count,
        legacy: status.total_count ? status.state : null,
        url: match[0],
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to read this pull request.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div class="landing-page">
      <SiteHeader page="content" />
      <main class="cat-tool">
        <header class="cat-tool-title">
          <LandingIcon name="code" />
          <h1>Cat-Ship</h1>
          <p>Review the changes and live CI results for a public pull request.</p>
        </header>
        <div class="cat-tool-body">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void inspect();
            }}
          >
            <label for="cat-pr">Pull request URL</label>
            <input
              id="cat-pr"
              type="url"
              placeholder="https://github.com/owner/repo/pull/123"
              required
              value={link()}
              onInput={(event) => setLink(event.currentTarget.value)}
            />
            <button disabled={busy()}>{busy() ? "Checking…" : "Check pull request"}</button>
          </form>
          <p role="alert">{error()}</p>
          <section aria-live="polite">
            <Show when={report()}>
              {(result) => (
                <>
                  <h2>{result().pull.title}</h2>
                  <p>
                    {result().pull.merged ? "Merged" : result().pull.draft ? "Draft" : result().pull.state} ·{" "}
                    {result().pull.changed_files} files · +{result().pull.additions} / −{result().pull.deletions}
                  </p>
                  <h3>Checks on {result().pull.head.sha.slice(0, 7)}</h3>
                  <Show when={result().legacy}>
                    <p>Commit status · {result().legacy}</p>
                  </Show>
                  <Show when={result().total === 0}>
                    <p>No check runs reported.</p>
                  </Show>
                  <ul>
                    <For each={result().checks}>
                      {(check) => (
                        <li>
                          {check.name} <strong>{check.conclusion ?? check.status}</strong>
                        </li>
                      )}
                    </For>
                  </ul>
                  <Show when={result().total > result().checks.length}>
                    <p>
                      Showing the first {result().checks.length} of {result().total} checks.
                    </p>
                  </Show>
                  <a href={result().url}>Review the diff and approvals on GitHub ↗</a>
                </>
              )}
            </Show>
          </section>
          <a class="cat-tool-related" href="/cat-computer">
            Set up Cat Computer →
          </a>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
