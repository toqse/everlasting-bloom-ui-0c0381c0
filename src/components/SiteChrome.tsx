"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { isDashboardPath, withoutTrailingSlash } from "@/lib/utils";

/**
 * Persistent marketing chrome (Navbar + Footer) across soft navigations.
 * Auth, dashboard, chat, and legal pages use their own shells and skip this chrome.
 */
function shouldShowMarketingChrome(pathname: string | null): boolean {
  const p = withoutTrailingSlash(pathname ?? "");
  if (!p) return true;
  if (p === "/auth" || p.startsWith("/auth/")) return false;
  if (isDashboardPath(p)) return false;
  if (p === "/chat" || p.startsWith("/chat/")) return false;
  // Legal pages: content only (no navbar / footer)
  if (p === "/terms-conditions" || p === "/privacy-policy") return false;
  return true;
}

export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const showChrome = shouldShowMarketingChrome(pathname);

  if (!showChrome) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
