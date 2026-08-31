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

const siteUrl = "https://precisionhq.io";
const title = "Precision HQ | Trading Education for Gold and FX";
const description =
  "Precision HQ teaches a high to low trading method across Daily, 4H and 15M timeframes on XAUUSD, GBPUSD and EURUSD. Free Telegram community, paid membership and 1:1 mentorship with Jack.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "Precision HQ",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.png"],
  },
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
