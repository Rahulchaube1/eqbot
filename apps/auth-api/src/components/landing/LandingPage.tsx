import { AppLogo, ProviderLogo } from "@openbot/brand";
import { For, onSettled, Show } from "solid-js";
import { landingAnalytics } from "../../lib/analytics";
import type { HeroProviderPart, LandingPageText } from "../../lib/landing-page-text";
import { ContentCallToAction } from "../content/ContentCallToAction";
import { ButtonLink } from "../ui/button";
import { AgentNetworkSection } from "./AgentNetworkSection";
import { DownloadSection } from "./DownloadSection";
import { FaqSection } from "./FaqSection";
import { FeaturesSection } from "./FeaturesSection";
import { HeroDownloadSelector } from "./HeroDownloadSelector";
import { LandingAppPreview } from "./LandingAppPreview";
import "./cat-workspace.css";
import { LandingFooter } from "./LandingFooter";
import { LandingGlow } from "./LandingGlow";
import { LandingTextProvider, useLandingText } from "./LandingText";
import { PricingSection } from "./PricingSection";
import { SiteHeader } from "./SiteHeader";
import { useSitePath } from "./SiteText";
import { TeamsSection } from "./TeamsSection";

export function LandingPage(props: { text: LandingPageText }) {
  return (
    <LandingTextProvider text={props.text}>
      <LandingPageContent />
    </LandingTextProvider>
  );
}

// Named accessors, not conditionals in props: a conditional prop moves the SSR hydration keys.
/** Plain words of the hero sentence, or a provider name with its logo. */
function HeroDescriptionPart(props: { part: string | HeroProviderPart }) {
  const provider = () => (typeof props.part === "string" ? undefined : props.part);
  const words = () => (typeof props.part === "string" ? props.part : undefined);
  return (
    <Show when={provider()} fallback={words()}>
      {(part) => <HeroProvider part={part()} />}
    </Show>
  );
}

/** A provider name and its logo. The punctuation after it stays on the same line. */
function HeroProvider(props: { part: HeroProviderPart }) {
  const name = () => (
    <span class="landing-provider">
      <ProviderLogo provider={props.part.provider} class="landing-provider-logo" />
      {props.part.name}
    </span>
  );
  return (
    <Show when={props.part.suffix} fallback={name()}>
      <span class="landing-provider-item">
        {name()}
        {props.part.suffix}
      </span>
    </Show>
  );
}

function LandingPageContent() {
  const text = useLandingText();
  const path = useSitePath();
  const hero = () => text().hero;
  onSettled(() => landingAnalytics.start(document, window.location.hostname));

  return (
    <div class="landing-page">
      <SiteHeader page="landing" />
      <main>
        <section class="landing-hero" aria-labelledby="landing-title">
          <div class="cat-intro">
            <div class="cat-signature">
              <a href="https://www.everestqai.com/" class="cat-maker">
                <img src="/everestq.png" alt="" />
                EverestQai
              </a>
              <h1 id="landing-title">
                <AppLogo variant="production" animation="blink" interactive class="cat-signature-logo" /> Cat
              </h1>
            </div>
            <div class="cat-intro-body">
              <p class="cat-intro-description">
                <For each={hero().description}>{(part) => <HeroDescriptionPart part={part} />}</For>
              </p>

              <a class="cat-model" href="https://engine.everestqai.com/models">
                <img src="/everestq.png" alt="" />
                EverestQ L1 <span aria-hidden="true">↗</span>
              </a>
              <div class="cat-actions">
                <HeroDownloadSelector />
                <ButtonLink
                  to={path("/contact")}
                  variant="secondary"
                  size="lg"
                  icon="contact"
                  class="landing-button-glass"
                >
                  {hero().contact}
                </ButtonLink>
              </div>
            </div>
          </div>
          <LandingAppPreview />
        </section>
        <AgentNetworkSection />
        <FeaturesSection />
        <PricingSection />
        <TeamsSection />
        <FaqSection />
        <DownloadSection />
        <ContentCallToAction />
      </main>
      <LandingFooter />
      <LandingGlow />
    </div>
  );
}
