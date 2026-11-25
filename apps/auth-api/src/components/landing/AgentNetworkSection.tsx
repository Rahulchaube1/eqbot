import { createSignal, For, lazy, onSettled, Show } from "solid-js";
import { LANDING_TEAM_SENDERS } from "../../lib/landing-content";
import { useLandingText } from "./LandingText";

const Avatar = lazy(() =>
  import("@openbot/ui/features/agents/AgentAvatar").then((module) => ({ default: module.AgentAvatar })),
);

export function AgentNetworkSection() {
  const text = useLandingText();
  const [selected, select] = createSignal(0);
  const [mounted, mount] = createSignal(false);
  onSettled(() => {
    mount(true);
  });
  return (
    <section class="cat-handoff" aria-labelledby="cat-handoff-title">
      <header>
        <img class="cat-handoff-mark" src="/everestq.png" width="40" height="40" alt="EverestQai" />
        <h2 id="cat-handoff-title">{text().network.title.join(" ")}</h2>
        <p>{text().network.description}</p>
      </header>
      <div class="cat-thread">
        <div class="cat-thread-bar">
          <img src="/icon-192x192.png" alt="" width="26" height="26" /> Cat <span> / {text().picture.channel}</span>
        </div>
        <div class="cat-senders">
          <For each={LANDING_TEAM_SENDERS}>
            {(entry, index) => (
              <button
                type="button"
                aria-pressed={selected() === index() ? "true" : "false"}
                aria-controls="cat-message"
                onClick={() => select(index())}
              >
                <span class="cat-portrait">
                  <Show when={mounted()} fallback={entry.from.name[0]}>
                    <Avatar seed={entry.from.avatarSeed} hue={entry.from.avatarHue} motion="hover" />
                  </Show>
                </span>
                <strong>{entry.from.name}</strong>
                <time>{entry.time}</time>
              </button>
            )}
          </For>
        </div>
        <div id="cat-message" aria-live="polite" aria-atomic="true">
          <For each={[selected()]}>
            {(index) => (
              <blockquote>
                <strong>{LANDING_TEAM_SENDERS[index]?.from.name}</strong>
                <p>{text().picture.team.messages[index]}</p>
              </blockquote>
            )}
          </For>
        </div>
      </div>
    </section>
  );
}
