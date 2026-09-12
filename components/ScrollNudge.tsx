"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/Button";
import { links } from "@/lib/config";

const DISMISS_KEY = "phq-scroll-nudge-dismissed";
const SCROLL_THRESHOLD = 0.5;

export function ScrollNudge() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY)) return;

    const onScroll = () => {
      const scrolled = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && scrolled / max >= SCROLL_THRESHOLD) {
        setVisible(true);
        window.removeEventListener("scroll", onScroll);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem(DISMISS_KEY, "1");
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-sm animate-fade-up rounded-lg border border-gold/50 bg-surface p-5 shadow-2xl sm:inset-x-auto sm:right-6">
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute right-3 top-3 font-mono text-xs text-ink-faint hover:text-ink"
      >
        ✕
      </button>
      <p className="pr-4 font-heading text-lg uppercase tracking-wide text-ink">
        Still Deciding?
      </p>
      <p className="mt-1 font-body text-sm text-ink-muted">
        Join our free trade ideas channel.
      </p>
      <div className="mt-4" onClick={dismiss}>
        <Button href={links.freeInsightsChannel} variant="primary" className="w-full">
          Join Free Channel
        </Button>
      </div>
    </div>
  );
}
