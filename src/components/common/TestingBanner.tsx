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
      className="sticky top-0 z-[60] flex min-h-[56px] w-full items-center justify-center border-b border-[#FCD34D] bg-[#FEF3C7] px-6 py-3.5 text-center text-[#92400E] shadow-sm"
    >
      <p className="m-0 flex flex-wrap items-center justify-center gap-2 text-sm font-medium leading-relaxed md:text-[15px] lg:text-base">
        <span aria-hidden="true" className="text-lg leading-none sm:text-xl">
          🚧
        </span>
        <span className="font-bold">Testing Environment:</span>
        <span className="font-medium">
          This website is currently under development and testing.
        </span>
      </p>
    </div>
  );
}
