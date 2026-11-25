import type { JSX } from "@solidjs/web";
import { Link } from "@tanstack/solid-router";
import { For, onSettled } from "solid-js";
import { type LandingScreenPath, landingAnalytics } from "../../lib/analytics";
import { formatArticleDate } from "../../lib/content-collection";
import { LandingFooter } from "../landing/LandingFooter";
import { SiteHeader } from "../landing/SiteHeader";

export interface LegalPageProps {
  route: LandingScreenPath;
  title: string;
  /** The "Last updated" date, as `YYYY-MM-DD`. */
  updatedAt: string;
  children: JSX.Element;
}

const documents = [
  { to: "/privacy-policy", title: "Privacy policy" },
  { to: "/terms", title: "Terms" },
  { to: "/commercial-license", title: "Commercial license" },
  { to: "/dpa", title: "Data processing agreement" },
  { to: "/cla", title: "Contributor agreement" },
] as const;

export function LegalPage(props: LegalPageProps) {
  onSettled(() => landingAnalytics.start(document, window.location.hostname, props.route));

  return (
    <div class="landing-page post-article cat-legal">
      <SiteHeader page="content" />

      <main class="post-main">
        <article class="post-container post-article-body">
          <header class="post-article-header" data-enter="post-copy">
            <h1 class="post-article-title">{props.title}</h1>
            <p class="post-meta post-article-byline">
              Last updated <time datetime={props.updatedAt}>{formatArticleDate(props.updatedAt)}</time>
            </p>
          </header>

          <nav class="cat-document-index" aria-label="Legal documents">
            <For each={documents}>
              {(document) => (
                <Link to={document.to} aria-current={props.route === document.to ? "page" : undefined}>
                  {document.title}
                </Link>
              )}
            </For>
          </nav>
          <div class="post-prose" data-enter="post-prose">
            {props.children}
          </div>
        </article>
      </main>

      <LandingFooter />
    </div>
  );
}
