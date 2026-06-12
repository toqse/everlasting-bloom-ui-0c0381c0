import type { AppProps } from "next/app";
import "../../app/globals.css";
import { plusJakarta, playfair } from "@/lib/fonts";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${plusJakarta.variable} ${playfair.variable} min-h-screen`}>
      <Component {...pageProps} />
    </div>
  );
}
