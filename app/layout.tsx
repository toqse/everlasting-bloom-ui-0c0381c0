import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import ScrollToTop from "@/components/ScrollToTop";
import SiteChrome from "@/components/SiteChrome";
import { plusJakarta, notoMalayalam, playfair } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Aiswarya Matrimony",
  description: "Aiswarya Matrimony - Find Your Perfect Match",
  authors: [{ name: "Aiswarya Matrimony" }],
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "Aiswarya Matrimony",
    description: "Aiswarya Matrimony - Find Your Perfect Match",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Aiswarya Matrimony",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aiswarya Matrimony",
    description: "Aiswarya Matrimony - Find Your Perfect Match",
    images: ["/og-image.png"],
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
  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} ${playfair.variable} ${notoMalayalam.variable}`}
    >
      <body>
        <Providers>
          <ScrollToTop />
          <SiteChrome>{children}</SiteChrome>
        </Providers>
      </body>
    </html>
  );
}
