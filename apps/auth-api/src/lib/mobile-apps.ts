import type { MobilePlatformLogoVariant } from "@openbot/brand";
import { ANDROID_PLAY_STORE_URL } from "@openbot/ui/features/mobile-app/android-play-store";
import { IOS_APP_STORE_URL } from "@openbot/ui/features/mobile-app/ios-app-store";
import type { PlatformNavigator } from "./download-platforms";

export type MobilePlatform = MobilePlatformLogoVariant;

export interface MobileAppDetails {
  action: string;
  description: string;
  href: string;
  id: MobilePlatform;
  label: string;
  status: "Available";
}

/** The phone apps on the landing cards. They link directly to the mobile download endpoints. */
export const MOBILE_APPS: Record<MobilePlatform, MobileAppDetails> = {
  ios: {
    id: "ios",
    label: "iPhone",
    status: "Available",
    description: "iOS 16.4+ · Connects to your computer",
    action: "Download for iPhone",
    href: IOS_APP_STORE_URL,
  },
  android: {
    id: "android",
    label: "Android",
    status: "Available",
    description: "Android 7.0+ · Connects to your computer",
    action: "Download for Android",
    href: ANDROID_PLAY_STORE_URL,
  },
};

export const MOBILE_APP_ORDER: readonly MobilePlatform[] = ["ios", "android"];

/**
 * The phone app for a visitor on a phone. Android reports Linux and an iPhone reports "like Mac OS X",
 * so check this before the desktop detection. An iPad in desktop mode reports a Mac and stays one.
 */
export function detectMobilePlatform(source: PlatformNavigator): MobilePlatform | undefined {
  const platform =
    `${source.userAgentData?.platform ?? ""} ${source.platform ?? ""} ${source.userAgent ?? ""}`.toLowerCase();

  if (/iphone|ipad|ipod/.test(platform)) return "ios";
  if (/android/.test(platform)) return "android";
  return undefined;
}
