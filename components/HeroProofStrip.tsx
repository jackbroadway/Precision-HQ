"use client";

import { useEffect, useState } from "react";

/**
 * Lightweight link to the live testimonials feed, meant to sit right under
 * the hero CTA so a cold ad-click sees proof exists before scrolling.
 * Only checks whether the feed has anything (cheap JSON call), it doesn't
 * load any images here - the 4-photo avatar version was slow to pop in
 * since it pulled full-resolution screenshots just to shrink them into
 * tiny circles. The actual photos still show, properly sized, further
 * down in LiveProfitScroller (#live-results). Renders nothing if the feed
 * is empty/unreachable, so always safe to mount.
 */
export function HeroProofStrip() {
  const [hasShots, setHasShots] = useState(false);

  useEffect(() => {
    fetch("/.netlify/functions/testimonial-shots")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setHasShots(Array.isArray(data) && data.length > 0))
      .catch(() => setHasShots(false));
  }, []);

  if (!hasShots) return null;

  return (
    <a
      href="#live-results"
      className="mt-4 inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface px-4 py-2 transition-colors hover:border-gold"
    >
      <span className="h-2 w-2 shrink-0 animate-pulse-gold rounded-full bg-gold" aria-hidden="true" />
      <span className="font-mono text-xs uppercase tracking-wide text-ink-muted">
        Live profit shots, posted daily &rarr;
      </span>
    </a>
  );
}
