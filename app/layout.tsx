import type { Metadata } from "next";
import Script from "next/script";
import { Barlow_Condensed, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Precision HQ | Trading Education for Gold and FX",
  description:
    "Precision HQ teaches a high to low trading method across Daily, 4H and 15M timeframes on XAUUSD, GBPUSD and EURUSD. Free Telegram community, paid membership and 1:1 mentorship with Jack.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${barlowCondensed.variable} ${inter.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        {children}
        <Script
          defer
          data-domain="precisionhq.io"
          src="https://plausible.io/js/script.outbound-links.js"
          strategy="afterInteractive"
        />
        <Script id="plausible-queue" strategy="beforeInteractive">
          {`window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }`}
        </Script>
      </body>
    </html>
  );
}
