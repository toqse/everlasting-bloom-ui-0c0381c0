import { shouldShowTestingBanner } from "@/lib/siteMode";

/**
 * Sticky environment notice for development/testing deploys.
 * Hidden when `NEXT_PUBLIC_SITE_MODE=production` (or unset).
 */
export default function TestingBanner() {
  if (!shouldShowTestingBanner()) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="sticky top-0 z-[60] flex min-h-[40px] items-center justify-center border-b border-[#FCD34D] bg-[#FEF3C7] px-4 py-2 text-center text-[13px] leading-snug text-[#92400E] sm:min-h-[42px] sm:text-sm"
    >
      <p className="m-0 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5">
        <span aria-hidden="true">🚧</span>
        <span className="font-semibold">Testing Environment:</span>
        <span className="font-normal">
          This website is currently under development and testing.
        </span>
      </p>
    </div>
  );
}
