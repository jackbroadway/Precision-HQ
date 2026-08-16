"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Button } from "./ui/Button";
import { links } from "@/lib/config";

const NAV_LINKS = [
  { label: "Method", href: "/#method" },
  { label: "Community", href: "/#offers" },
  { label: "Mentorship", href: "/#offers" },
  { label: "Results", href: "/#results" },
  { label: "FAQ", href: "/#faq" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const trigger = ScrollTrigger.create({
      start: 0,
      end: () =>
        document.documentElement.scrollHeight - window.innerHeight,
      onUpdate: (self) => {
        if (progressRef.current) {
          progressRef.current.style.width = `${self.progress * 100}%`;
        }
        setScrolled(self.scroll() > 24);
      },
    });

    return () => trigger.kill();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav className="container-px flex h-16 items-center justify-between sm:h-20">
        <Link href="/#top" className="shrink-0">
          <Image
            src="/brand/logo.png"
            alt="Precision HQ"
            width={1013}
            height={251}
            priority
            className="h-8 w-auto sm:h-10"
          />
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="font-mono text-xs uppercase tracking-[0.15em] text-ink-muted transition-colors hover:text-gold"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <Button href={links.telegramCommunity} variant="primary" className="px-5 py-2.5 text-sm">
            Join Community
          </Button>
        </div>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center text-ink lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="relative block h-4 w-6">
            <span
              className={`absolute left-0 top-0 h-px w-6 bg-current transition-transform duration-200 ${
                menuOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 h-px w-6 -translate-y-1/2 bg-current transition-opacity duration-200 ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute bottom-0 left-0 h-px w-6 bg-current transition-transform duration-200 ${
                menuOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </nav>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-border bg-background px-5 pb-8 pt-4 lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 font-heading text-lg uppercase tracking-wide text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button
            href={links.telegramCommunity}
            variant="primary"
            className="mt-4 w-full"
          >
            Join Community
          </Button>
        </div>
      )}

      <div className="h-px w-full bg-border">
        <div
          ref={progressRef}
          className="h-px bg-gradient-to-r from-gold-dim via-gold to-gold-bright"
          style={{ width: "0%" }}
        />
      </div>
    </header>
  );
}
