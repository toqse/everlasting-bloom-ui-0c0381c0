import {
  Plus_Jakarta_Sans,
  Noto_Sans_Malayalam,
  Playfair_Display,
} from "next/font/google";

export const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

/** Renders Malayalam copy in Jathagam / porutham cards without tofu. */
export const notoMalayalam = Noto_Sans_Malayalam({
  subsets: ["malayalam"],
  variable: "--font-ml",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});
