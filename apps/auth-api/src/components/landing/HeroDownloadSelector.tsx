import { PlatformLogo } from "@openbot/brand";
import { OPENBOT_DOWNLOAD_LINKS } from "../../lib/landing-links";
import { useSiteChrome } from "./SiteText";

export function HeroDownloadSelector() {
  const chrome = useSiteChrome();
  return (
    <a class="landing-download-primary" href={OPENBOT_DOWNLOAD_LINKS.windows}>
      <PlatformLogo platform="windows" solid /> {chrome().text.download} · Windows x64
    </a>
  );
}
