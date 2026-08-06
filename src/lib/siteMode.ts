/** Public site deployment mode (Next.js `NEXT_PUBLIC_SITE_MODE`). */
export type SiteMode = "development" | "testing" | "production";

export function getSiteMode(): SiteMode | string {
  return (process.env.NEXT_PUBLIC_SITE_MODE ?? "production").trim().toLowerCase();
}

/** Testing banner is shown only in development or testing. */
export function shouldShowTestingBanner(): boolean {
  const mode = getSiteMode();
  return mode === "development" || mode === "testing";
}

/** Matches TestingBanner min-height (40–44px). Used to offset fixed headers. */
export const TESTING_BANNER_HEIGHT_CSS = "2.625rem"; // 42px
