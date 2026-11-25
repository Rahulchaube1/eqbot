import { createFileRoute } from "@tanstack/solid-router";
import { SiteHeader } from "../components/landing/SiteHeader";
import { LandingFooter } from "../components/landing/LandingFooter";
import { LandingIcon } from "../components/landing/LandingIcon";

export const Route = createFileRoute("/cat-computer")({
  head: () => ({ meta: [{ title: "Cat Computer · Local Linux desktop" }] }),
  component: ComputerPage,
});
function ComputerPage() {
  return (
    <div class="landing-page">
      <SiteHeader page="content" />
      <main class="cat-tool">
        <header class="cat-tool-title">
          <LandingIcon name="laptop" />
          <h1>Cat Computer</h1>
          <p>
            Give each project a Linux desktop with its own browser profile and persistent files. Docker runs it on your
            machine.
          </p>
        </header>
        <div class="cat-tool-body">
          <section>
            <h2>Start a desktop</h2>
            <p>Download the configuration, then run this command in the same folder with Docker running.</p>
            <a download href="/cat-computer.yaml">
              Download desktop configuration ↓
            </a>
            <pre>docker compose -p cat-research -f cat-computer.yaml up -d</pre>
            <p>
              <a href="https://localhost:3301" target="_blank" rel="noreferrer">
                Open local desktop ↗
              </a>
            </p>
            <p>
              The local desktop uses a self-signed HTTPS certificate. For another desktop, choose a different project
              name and set the CAT_PORT environment variable to another free port.
            </p>
          </section>
          <section>
            <h2>Pause your desktop</h2>
            <pre>docker compose -p cat-research -f cat-computer.yaml stop</pre>
            <p>Run the start command again to resume with your files.</p>
          </section>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
