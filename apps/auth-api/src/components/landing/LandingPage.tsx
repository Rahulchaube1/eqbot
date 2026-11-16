import { AppLogo, ProviderLogo } from "@openbot/brand";
import { createSignal, For } from "solid-js";
import { OPENBOT_LINKS } from "../../lib/landing-links";
import type { LandingPageText } from "../../lib/landing-page-text";
import "./eqbots-home.css";

const workflows = [
  {
    name: "Build",
    provider: "codex",
    agent: "Codex",
    task: "Ship a dashboard",
    request: "Add a usage dashboard and validate the data.",
    steps: ["Read the project", "Build the dashboard", "Run the checks"],
    output: "dashboard.tsx",
    color: "#daff79",
  },
  {
    name: "Research",
    provider: "claude",
    agent: "Claude",
    task: "Compare three options",
    request: "Compare the trade-offs and save a decision brief.",
    steps: ["Collect the facts", "Compare the options", "Write a decision brief"],
    output: "decision-brief.md",
    color: "#ffc598",
  },
  {
    name: "Investigate",
    provider: "grok",
    agent: "Grok",
    task: "Find the source of a bug",
    request: "Reproduce the failure and document the likely cause.",
    steps: ["Reproduce the failure", "Trace the request", "Summarize the findings"],
    output: "findings.md",
    color: "#c8baff",
  },
] as const;

const features = [
  {
    icon: "◎",
    title: "Persistent agents",
    text: "Give each teammate a workspace, a conversation, and its own files. Pick up where you left off.",
  },
  {
    icon: "↳",
    title: "Tasks that move",
    text: "Queue work and follow it from request to result. Agents can pass messages and share files.",
  },
  {
    icon: "⌘",
    title: "Your models, your machine",
    text: "Run Codex, Claude Code, Grok, and more from one workspace. Project files and conversations stay on the host.",
  },
] as const;

export function LandingPage(props: { text: LandingPageText }) {
  const [active, setActive] = createSignal(0);
  const workflow = () => workflows[active()] ?? workflows[0];

  return (
    <div class="eq-home">
      <header class="eq-top eq-frame">
        <a class="eq-wordmark" href="/" aria-label="EQBots home">
          <AppLogo variant="production" /> <strong>EQBots</strong>
        </a>
        <nav aria-label="Main navigation">
          <a href="#workspace">Workspace</a>
          <a href="#features">Features</a>
          <a href="/marketplace">Marketplace</a>
        </nav>
        <a class="eq-button eq-button-outline" href="/app">
          Open workspace <span aria-hidden="true">↗</span>
        </a>
      </header>

      <main>
        <section class="eq-hero eq-frame" aria-labelledby="eq-title">
          <div class="eq-intro">
            <a class="eq-company" href="https://www.everestqai.com/">
              An EverestQai product <span aria-hidden="true">↗</span>
            </a>
            <h1 id="eq-title">
              A workspace for <em>your AI team.</em>
            </h1>
            <p>
              Give your agents their own workspaces, assign tasks, and follow the work from first prompt to finished
              file.
            </p>
            <div class="eq-actions">
              <a class="eq-button eq-button-dark" href="/app">
                Open workspace <span aria-hidden="true">↗</span>
              </a>
              <a class="eq-button eq-button-outline" href="#workspace">
                Explore a workflow <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>

          <section class="eq-demo" id="workspace" aria-label="Interactive example workspace">
            <div class="eq-demo-head">
              <span>
                <span class="eq-demo-dot" /> Example workspace
              </span>
              <span>EQBots</span>
            </div>
            <fieldset class="eq-demo-selector" aria-label="Choose a workflow">
              <For each={workflows}>
                {(item, index) => (
                  <button
                    type="button"
                    aria-pressed={index() === active() ? "true" : "false"}
                    onClick={() => setActive(index())}
                  >
                    {item.name}
                  </button>
                )}
              </For>
            </fieldset>
            <For each={[workflow()]}>
              {(item) => (
                <div class="eq-demo-main" style={{ "--eq-accent": item.color }} aria-live="polite">
                  <div class="eq-demo-profile">
                    <div class="eq-provider">
                      <ProviderLogo provider={item.provider} />
                    </div>
                    <div>
                      <span>{item.agent}</span>
                      <h2>{item.task}</h2>
                    </div>
                  </div>
                  <p class="eq-demo-request">{item.request}</p>
                  <ol class="eq-demo-progress">
                    <For each={item.steps}>
                      {(step, index) => (
                        <li style={{ "--eq-step": index() }}>
                          <span aria-hidden="true">✓</span>
                          {step}
                        </li>
                      )}
                    </For>
                  </ol>
                  <div class="eq-demo-output">
                    <span aria-hidden="true">↳</span>
                    <code>{item.output}</code>
                  </div>
                </div>
              )}
            </For>
          </section>
        </section>

        <section class="eq-features" id="features" aria-labelledby="eq-features-title">
          <div class="eq-frame">
            <h2 id="eq-features-title">Give every agent a place to work.</h2>
            <div class="eq-feature-grid">
              <For each={features}>
                {(feature) => (
                  <article>
                    <span aria-hidden="true">{feature.icon}</span>
                    <h3>{feature.title}</h3>
                    <p>{feature.text}</p>
                  </article>
                )}
              </For>
            </div>
          </div>
        </section>

        <section class="eq-faq eq-frame" aria-labelledby="eq-faq-title">
          <h2 id="eq-faq-title">{props.text.faq.title}</h2>
          <div>
            <For each={props.text.faq.questions}>
              {(entry) => (
                <details>
                  <summary>{entry.question}</summary>
                  <p>{entry.answer}</p>
                </details>
              )}
            </For>
          </div>
        </section>
      </main>

      <footer class="eq-footer">
        <div class="eq-frame">
          <div>
            <a class="eq-wordmark" href="/">
              <AppLogo variant="production" /> <strong>EQBots</strong>
            </a>
            <a class="eq-company" href="https://www.everestqai.com/">
              A product of EverestQai ↗
            </a>
          </div>
          <nav aria-label="Footer navigation">
            <a href="/guides">Guides</a>
            <a href="/brand">Brand assets</a>
            <a href="/privacy-policy">Privacy</a>
            <a href={OPENBOT_LINKS.repository}>Source code ↗</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
