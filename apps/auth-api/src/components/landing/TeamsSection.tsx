import { For } from "solid-js";
import { LANDING_TEAMS_OFFER_IDS, type LandingTeamsOfferId } from "../../lib/landing-content";
import { TEAMS_ROUTE } from "../../lib/teams-page";
import { ButtonLink } from "../ui/button";
import { LandingIcon, type LandingIconName } from "./LandingIcon";
import { useLandingText } from "./LandingText";
import { useSitePath } from "./SiteText";

const OFFER_ICONS: Record<LandingTeamsOfferId, LandingIconName> = {
  servers: "cloud",
  environments: "users",
  integrations: "puzzle",
  support: "heart",
};

export function TeamsSection() {
  const landing = useLandingText();
  const path = useSitePath();
  const text = () => landing().teams;
  return (
    <section id="teams" class="landing-section landing-teams" aria-labelledby="teams-title">
      <div class="landing-section-inner landing-teams-layout">
        <header class="landing-section-heading landing-teams-aside">
          <h2 id="teams-title" class="landing-teams-title">
            {text().title}
          </h2>
          <p class="landing-teams-statement">{text().statement}</p>
          <p class="landing-teams-description">{text().description}</p>
          <div class="landing-teams-actions">
            <ButtonLink to={path("/contact")} variant="primary" size="lg" icon="contact">
              {text().contact}
            </ButtonLink>
            <ButtonLink to={path(TEAMS_ROUTE)} variant="secondary" size="lg" icon="arrow-right">
              {text().learn}
            </ButtonLink>
          </div>
        </header>
        <div class="cat-offers">
          <For each={LANDING_TEAMS_OFFER_IDS}>
            {(offer, index) => (
              <details name="cat-team-offer" open={index() === 0}>
                <summary>
                  <LandingIcon name={OFFER_ICONS[offer]} class="cat-offer-icon" />
                  <span>{text().offers[offer].label}</span>
                  <LandingIcon name="chevron-down" class="cat-offer-chevron" />
                </summary>
                <div class="cat-offer-body">
                  <h3>{text().offers[offer].title}</h3>
                  <p>{text().offers[offer].description}</p>
                </div>
              </details>
            )}
          </For>
        </div>
      </div>
    </section>
  );
}
