import { createIsomorphicFn } from "@tanstack/solid-start";
import { getRequestUrl } from "@tanstack/solid-start/server";
import { OPENBOT_SITE_URL, siteUrlForPage } from "./site-metadata";

/**
 * The site URL for the head tags of the page being rendered. The root route reads it
 * in `beforeLoad`, and each page takes it from `match.context`. The server reads it
 * from the request. The browser runs `beforeLoad` again on navigation and reads it
 * from its own location, which is the same address, so the two agree.
 *
 * Only the root route imports this. Outside the Start build,
 * `@tanstack/solid-start/server` loads Solid Router as raw JSX and fails, and the
 * tests import the page routes directly.
 */
export const servingSiteUrl = createIsomorphicFn()
  .server(() => (import.meta.env.VITE_CAT_STATIC_SITE === "true" ? OPENBOT_SITE_URL : siteUrlForPage(getRequestUrl())))
  .client(() => siteUrlForPage(new URL(window.location.href)));
