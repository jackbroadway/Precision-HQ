import Image from "next/image";
import Link from "next/link";
import { links, siteConfig } from "@/lib/config";

const SOCIALS = [
  {
    label: "Instagram",
    href: links.instagram,
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" fill="none" />
        <circle cx="12" cy="12" r="4" fill="none" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
      </>
    ),
  },
  {
    label: "TikTok",
    href: links.tiktok,
    icon: (
      <path
        d="M14 4v9.5a3.5 3.5 0 1 1 -3.5 -3.5c.35 0 .68.04 1 .12V7.7a6 6 0 1 0 4.5 5.8V9.2a6.5 6.5 0 0 0 3.5 1.02V7.2A4 4 0 0 1 16 3h-2Z"
        fill="none"
      />
    ),
  },
  {
    label: "Telegram",
    href: links.telegramCommunity,
    icon: (
      <path
        d="M21 4L3 11.5l6 2.2M21 4l-3.2 15.5L9 13.7M21 4L9 13.7m0 0v5.3l2.9 -3.1"
        fill="none"
      />
    ),
  },
];

const LEGAL_LINKS = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Risk Disclaimer", href: "/risk-disclaimer" },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container-px flex flex-col gap-10 py-14">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <Link href="/#top" className="shrink-0">
            <Image
              src="/brand/logo.png"
              alt="Precision HQ"
              width={1013}
              height={251}
              className="h-8 w-auto"
            />
          </Link>

          <div className="flex items-center gap-5">
            {SOCIALS.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border-strong text-ink-muted transition-colors hover:border-gold hover:text-gold"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {social.icon}
                </svg>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-2xl font-mono text-xs leading-relaxed text-ink-faint">
            Risk disclaimer: trading involves risk. Past results and trade
            ideas shared inside Precision HQ are no guarantee of future
            profit. Nothing on this site is financial advice. Content is for
            educational purposes only. Read the full{" "}
            <Link href="/risk-disclaimer" className="underline hover:text-gold">
              risk disclaimer
            </Link>
            .
          </p>
          <p className="whitespace-nowrap font-mono text-xs text-ink-faint">
            © {new Date().getFullYear()} {siteConfig.name}
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 border-t border-border pt-6 sm:flex-row sm:justify-between">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-xs uppercase tracking-wide text-ink-faint transition-colors hover:text-gold"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Link
            href={links.affiliateApplication}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs uppercase tracking-wide text-ink-faint transition-colors hover:text-gold"
          >
            Become An Affiliate
          </Link>
        </div>
      </div>
    </footer>
  );
}
