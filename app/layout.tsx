import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import ScrollToTop from "@/components/ScrollToTop";
import TestingBanner from "@/components/common/TestingBanner";
import { plusJakarta, notoMalayalam, playfair } from "@/lib/fonts";
import {
  shouldShowTestingBanner,
  TESTING_BANNER_HEIGHT_CSS,
} from "@/lib/siteMode";

export const metadata: Metadata = {
  title: "Aiswarya Matrimony",
  description: "Aiswarya Matrimony - Find Your Perfect Match",
  authors: [{ name: "Aiswarya Matrimony" }],
  icons: [{ rel: "icon", type: "image/svg+xml", url: "/favicon.svg" }],
  openGraph: {
    title: "Aiswarya Matrimony",
    description: "Aiswarya Matrimony - Find Your Perfect Match",
    type: "website",
    images: ["/favicon.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aiswarya Matrimony",
    description: "Aiswarya Matrimony - Find Your Perfect Match",
    images: ["/favicon.svg"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
  themeColor: "#6B2D5C",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const showTestingBanner = shouldShowTestingBanner();
  const htmlStyle = showTestingBanner
    ? ({ "--testing-banner-height": TESTING_BANNER_HEIGHT_CSS } as CSSProperties)
    : undefined;

  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${playfair.variable} ${notoMalayalam.variable}`}
      data-testing-banner={showTestingBanner ? "true" : undefined}
      style={htmlStyle}
    >
      <body>
        <TestingBanner />
        <Providers>
          <ScrollToTop />
          {children}
        </Providers>
      </body>
    </html>
  );
}
