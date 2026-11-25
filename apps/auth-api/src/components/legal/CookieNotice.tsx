import { createSignal, onSettled, Show } from "solid-js";

export const COOKIE_SETTINGS_EVENT = "cat:cookie-settings";
const choiceKey = "cat.privacy.choice.v1";

export function CookieNotice() {
  const [visible, setVisible] = createSignal(false);
  let opener: HTMLElement | null = null;
  let closeButton: HTMLButtonElement | undefined;
  onSettled(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem(choiceKey); } catch { /* Storage may be disabled. */ }
    setVisible(saved !== "essential" && saved !== "acknowledged");
    const open = () => {
      opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setVisible(true);
      requestAnimationFrame(() => closeButton?.focus());
    };
    window.addEventListener(COOKIE_SETTINGS_EVENT, open);
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, open);
  });
  function dismiss(choice?: "essential" | "acknowledged") {
    try { if (choice) localStorage.setItem(choiceKey, choice); } catch { /* Still dismiss for this visit. */ }
    setVisible(false);
    opener?.focus();
  }
  return <Show when={visible()}>
    <aside class="cat-cookie" aria-labelledby="cat-cookie-title" onKeyDown={event => {
      if (event.key === "Escape") dismiss();
    }}>
      <header><img src="/favicon-32x32.png" width="22" height="22" alt="" />
        <strong id="cat-cookie-title">Cookie policy</strong>
        <button type="button" ref={closeButton} class="cat-cookie-close" aria-label="Dismiss cookie notice" onClick={() => dismiss()}>×</button>
      </header>
      <p>Cat uses essential cookies for sign-in, security and your language preference.</p>
      <nav aria-label="Legal information"><a href="/privacy-policy#cat-cookies">Cookie policy</a><a href="/privacy-policy">Privacy policy</a><a href="/terms">Terms &amp; conditions</a></nav>
      <div class="cat-cookie-actions"><button type="button" onClick={() => dismiss("acknowledged")}>Got it</button><button type="button" onClick={() => dismiss("essential")}>Decline optional</button></div>
    </aside>
  </Show>;
}
