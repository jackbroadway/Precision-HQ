"use client";

import { useEffect, useState } from "react";

type Shot = { id: string; url: string; name: string; caption: string; date: number };

/**
 * Compact 4-thumbnail preview of the live testimonials feed, meant to sit
 * right under the hero CTA so a cold ad-click sees proof before scrolling.
 * Links down to the full LiveProfitScroller section (#live-results).
 * Renders nothing if the feed is empty/unreachable, so always safe to mount.
 */
export function HeroProofStrip() {
  const [shots, setShots] = useState<Shot[]>([]);

  useEffect(() => {
    fetch("/.netlify/functions/testimonial-shots")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setShots(Array.isArray(data) ? data.slice(0, 4) : []))
      .catch(() => setShots([]));
  }, []);

  if (shots.length === 0) return null;

  return (
    <a
      href="#live-results"
      className="mt-4 inline-flex items-center gap-3 rounded-full border border-border-strong bg-surface px-3 py-2 transition-colors hover:border-gold"
    >
      <span className="flex -space-x-3">
        {shots.map((shot) => (
          <span
            key={shot.id}
            className="h-9 w-9 overflow-hidden rounded-full border-2 border-surface"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={shot.url}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </span>
        ))}
      </span>
      <span className="font-mono text-xs uppercase tracking-wide text-ink-muted">
        Live profit shots, posted daily &rarr;
      </span>
    </a>
  );
}
