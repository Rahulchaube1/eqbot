import { createFileRoute } from "@tanstack/solid-router";
import { runApiEffect } from "../../../server/effect-runtime";
import {
  androidApkResponse,
  downloadArchitecture,
  iosDownloadResponse,
  isAvailableDownloadPlatform,
  latestDownloadResponse,
} from "../../../server/latest-download";

// The installer itself. `/download/<platform>` is the page that describes it, and every download
// button on the site links here. `?arch=x64` is the Intel Mac installer and `?arch=arm64` the Linux
// arm64 AppImage. `android` is the APK and `ios` is the iOS package.
export const Route = createFileRoute("/download/$platform_/latest")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        if (params.platform === "android") return androidApkResponse();
        if (params.platform === "ios") return iosDownloadResponse();
        if (!isAvailableDownloadPlatform(params.platform)) return new Response("Not found", { status: 404 });
        const architecture = downloadArchitecture(params.platform, new URL(request.url).searchParams.get("arch"));
        return runApiEffect(latestDownloadResponse(params.platform, fetch, architecture));
      },
    },
  },
});
