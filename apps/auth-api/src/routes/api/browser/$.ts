import { env } from "cloudflare:workers";
import { createFileRoute } from "@tanstack/solid-router";
import { Effect } from "effect";
import { handleBrowserApi } from "../../../server/browser-api";
import { handleGoogleSignIn } from "../../../server/google-sign-in";
import { readHostLogo } from "../../../server/host-logo";
import {
  hostedServerErrorResponse,
  requestAccountAttribution,
  requestAuthService,
  requestAvatarBucket,
  requestBillingService,
  requestCompanySignIn,
  requestHostedServerService,
  requestHostedSiteService,
  requestRemoteControlPlane,
  requestTeamInviteEmailDelivery,
} from "../../../server/request-auth";
import { requestSourceIp } from "../../../server/source-ip";
import { requireWorkerBindings } from "../../../server/types";

async function handle({ request }: { request: Request }) {
  const bindings = requireWorkerBindings(env);
  const url = new URL(request.url);
  if (url.pathname.startsWith("/api/browser/google/")) {
    const result = await handleGoogleSignIn(request, bindings, (email) =>
      Effect.runPromise(requestCompanySignIn().usesCompanySignIn(email)),
    );
    if (result) return result;
  }
  // Vercel forwards browser API requests to this Worker. Use the configured web origin
  // for the existing same-origin checks and return URLs.
  const webOrigin = bindings.GOOGLE_OAUTH_ORIGIN;
  const publicRequest = webOrigin ? new Request(new URL(url.pathname + url.search, webOrigin), request) : request;
  return handleBrowserApi(publicRequest, {
    auth: requestAuthService(),
    remote: requestRemoteControlPlane(),
    companySignIn: requestCompanySignIn,
    hostLogo: (hostId, version) => readHostLogo(requestAvatarBucket(), hostId, version),
    hosting: requestHostedServerService,
    inviteEmailDelivery: requestTeamInviteEmailDelivery,
    attribution: requestAccountAttribution,
    billing: requestBillingService,
    avatarBucket: requestAvatarBucket,
    hostedSites: requestHostedSiteService,
    sourceIp: requestSourceIp,
    errorResponse: hostedServerErrorResponse,
  });
}

export const Route = createFileRoute("/api/browser/$")({ server: { handlers: { ANY: handle } } });
