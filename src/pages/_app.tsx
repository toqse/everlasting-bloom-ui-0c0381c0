import type { AppProps } from "next/app";
import "../../app/globals.css";
import { plusJakarta, playfair } from "@/lib/fonts";
import { Providers } from "../../app/providers";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <div className={`${plusJakarta.variable} ${playfair.variable} min-h-screen`}>
        <Component {...pageProps} />
      </div>
    </Providers>
  );
}
