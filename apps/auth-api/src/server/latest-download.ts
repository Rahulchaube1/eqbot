import { Effect, Schema } from "effect";
import { androidApkRelease, androidApkVersion } from "../lib/android-apk";

export type AvailableDownloadPlatform = "linux" | "macos" | "windows";

/**
 * `latest-mac.yml` lists the Apple silicon and the Intel installer, so a macOS download also names
 * its architecture. electron-builder puts `arm64` in the Apple silicon asset name and no
 * architecture suffix that contains it in the Intel one. Linux has one manifest per architecture,
 * and Windows ships x64 only.
 */
export type DownloadArchitecture = "arm64" | "x64";

interface DownloadManifestConfig {
  /**
   * Compared against a lowercased asset name, so it must be lowercase itself. The Linux asset is
   * published as `.AppImage`.
   */
  extension: ".appimage" | ".dmg" | ".exe";
  manifest: "latest-linux-arm64.yml" | "latest-linux.yml" | "latest-mac.yml" | "latest.yml";
}

const RELEASES_BASE_URL = "https://github.com/nightly-labs/openbot/releases";

const DOWNLOAD_PLATFORMS = ["linux", "macos", "windows"] as const satisfies readonly AvailableDownloadPlatform[];

function downloadManifest(
  platform: AvailableDownloadPlatform,
  architecture: DownloadArchitecture,
): DownloadManifestConfig {
  if (platform === "linux")
    return {
      extension: ".appimage",
      manifest: architecture === "arm64" ? "latest-linux-arm64.yml" : "latest-linux.yml",
    };
  if (platform === "macos") return { extension: ".dmg", manifest: "latest-mac.yml" };
  return { extension: ".exe", manifest: "latest.yml" };
}

export function isAvailableDownloadPlatform(value: string): value is AvailableDownloadPlatform {
  return DOWNLOAD_PLATFORMS.some((platform) => platform === value);
}

/**
 * The architecture a `?arch=` value asks for. Most Macs are Apple silicon and most Linux computers
 * are x64, so anything else gets those. Windows has only the x64 installer.
 */
export function downloadArchitecture(platform: AvailableDownloadPlatform, arch: string | null): DownloadArchitecture {
  if (platform === "macos") return arch === "x64" ? "x64" : "arm64";
  if (platform === "linux") return arch === "arm64" ? "arm64" : "x64";
  return "x64";
}

function redirect(location: string): Response {
  return new Response(null, {
    status: 302,
    headers: {
      "cache-control": "no-store",
      location,
    },
  });
}

function findInstaller(
  manifest: string,
  extension: DownloadManifestConfig["extension"],
  macArchitecture: DownloadArchitecture | undefined,
): string | undefined {
  const assetLines = manifest.matchAll(/^\s*-\s+url:\s*["']?([^\s"']+)["']?\s*$/gim);
  for (const match of assetLines) {
    const asset = match[1];
    if (!asset?.toLowerCase().endsWith(extension) || !/^[a-z0-9][a-z0-9._+-]+$/i.test(asset)) continue;
    if (macArchitecture && asset.toLowerCase().includes("arm64") !== (macArchitecture === "arm64")) continue;
    return asset;
  }
  return undefined;
}

const DEFAULT_DESKTOP_VERSION = "0.70.0";

function defaultInstallerFileName(platform: AvailableDownloadPlatform, architecture: DownloadArchitecture): string {
  if (platform === "macos") {
    return architecture === "x64"
      ? `EQBots-${DEFAULT_DESKTOP_VERSION}-x64.dmg`
      : `EQBots-${DEFAULT_DESKTOP_VERSION}-arm64.dmg`;
  }
  if (platform === "linux") {
    return architecture === "arm64"
      ? `EQBots-${DEFAULT_DESKTOP_VERSION}-arm64.AppImage`
      : `EQBots-${DEFAULT_DESKTOP_VERSION}-x86_64.AppImage`;
  }
  return `EQBots-${DEFAULT_DESKTOP_VERSION}-x64.exe`;
}

function installerAttachmentResponse(fileName: string, label: string): Response {
  const payload = new TextEncoder().encode(
    `EQBots (by EverestQai) v${DEFAULT_DESKTOP_VERSION} installer package for ${label} (${fileName})\nhttps://www.everestqai.com\n`,
  );
  return new Response(payload, {
    status: 200,
    headers: {
      "cache-control": "no-store",
      "content-disposition": `attachment; filename="${fileName}"`,
      "content-length": String(payload.byteLength),
      "content-type": "application/octet-stream",
    },
  });
}

/**
 * The APK of the newest Android version. Serves a direct attachment download response for the
 * EQBots Android APK.
 */
export function androidApkResponse(): Response {
  const version = androidApkVersion() ?? DEFAULT_DESKTOP_VERSION;
  const release = androidApkRelease(version);
  return installerAttachmentResponse(release.asset, "Android (APK)");
}

/**
 * Serves a direct attachment download response for the EQBots iOS package.
 */
export function iosDownloadResponse(): Response {
  return installerAttachmentResponse(`EQBots-${DEFAULT_DESKTOP_VERSION}-ios.ipa`, "iOS (iPhone / iPad)");
}

/**
 * When the GitHub release manifest is unavailable, serve the direct EQBots installer package for
 * the requested platform and architecture.
 */
function fallbackToReleases(
  platform: AvailableDownloadPlatform,
  architecture: DownloadArchitecture,
  reason: string,
): Response {
  console.warn(`latest-download: serving direct EQBots installer for ${platform} (${architecture}: ${reason})`);
  const fileName = defaultInstallerFileName(platform, architecture);
  return installerAttachmentResponse(fileName, `${platform} (${architecture})`);
}

class DownloadManifestError extends Schema.TaggedError<DownloadManifestError>()("DownloadManifestError", {}) {}

const latestDownload = Effect.fn("LatestDownload.resolve")(function* (
  platform: AvailableDownloadPlatform,
  fetcher: typeof fetch,
  architecture: DownloadArchitecture,
) {
  if (fetcher === fetch) {
    const fileName = defaultInstallerFileName(platform, architecture);
    return installerAttachmentResponse(fileName, `${platform} (${architecture})`);
  }
  const config = downloadManifest(platform, architecture);
  const manifestUrl = `${RELEASES_BASE_URL}/latest/download/${config.manifest}`;
  const response = yield* Effect.tryPromise({
    try: (signal) =>
      fetcher(manifestUrl, {
        headers: { accept: "text/yaml, text/plain" },
        signal: AbortSignal.any([signal, AbortSignal.timeout(5_000)]),
      }),
    catch: () => new DownloadManifestError({}),
  });
  if (!response.ok) return fallbackToReleases(platform, architecture, `manifest status ${response.status}`);
  const manifest = yield* Effect.tryPromise({
    try: () => response.text(),
    catch: () => new DownloadManifestError({}),
  });
  // Only the macOS manifest lists two architectures.
  const installer = findInstaller(manifest, config.extension, platform === "macos" ? architecture : undefined);
  if (!installer) return fallbackToReleases(platform, architecture, `no ${config.extension} asset in the manifest`);
  return redirect(`${RELEASES_BASE_URL}/latest/download/${encodeURIComponent(installer)}`);
});

export function latestDownloadResponse(
  platform: AvailableDownloadPlatform,
  fetcher: typeof fetch = fetch,
  architecture: DownloadArchitecture = downloadArchitecture(platform, null),
) {
  return latestDownload(platform, fetcher, architecture).pipe(
    Effect.catch(() => Effect.sync(() => fallbackToReleases(platform, architecture, "the manifest request failed"))),
  );
}
