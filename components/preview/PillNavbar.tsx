"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Menu, X } from "lucide-react";
import { links } from "@/lib/config";

const NAV_LINKS = [
  { label: "Method", href: "#method" },
  { label: "Community", href: "#offers" },
  { label: "Mentorship", href: "#offers" },
  { label: "Results", href: "#results" },
  { label: "FAQ", href: "#faq" },
];

export function PillNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-center px-3 pt-4 sm:px-4 sm:pt-6">
      <div className="relative z-20 w-full max-w-[760px] rounded-full border border-border-strong bg-surface-raised/95 py-2 pl-4 pr-2 shadow-lg backdrop-blur-sm">
        <div className="flex items-center">
          <Link href="#top" className="shrink-0">
            <Image
              src="/brand/logo.png"
              alt="Precision HQ"
              width={1013}
              height={251}
              className="h-7 w-auto"
            />
          </Link>

          <ul className="ml-8 hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link, i) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="flex items-center gap-1.5 font-mono text-[13px] text-ink-muted transition-colors hover:text-gold"
                >
                  {i === 0 && (
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
                  )}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="ml-auto flex items-center gap-2">
            <Link
              href={links.telegramCommunity}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gold py-1.5 pl-4 pr-1.5 font-mono text-[13px] text-background transition-colors hover:bg-gold-bright"
            >
              <span className="hidden sm:inline">Join Community</span>
              <span className="sm:hidden">Join</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-background/15">
                <ChevronRight className="h-4 w-4" />
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="pill-mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="flex h-9 w-9 items-center justify-center text-ink md:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div
            id="pill-mobile-menu"
            className="absolute left-2 right-2 top-full z-20 mt-2 rounded-2xl border border-border-strong bg-surface-raised p-3 shadow-lg md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2.5 font-mono text-sm text-ink hover:bg-surface"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
