"use client";

import { useEffect, useState } from "react";
import { Reveal } from "./ui/Reveal";
import { Eyebrow } from "./ui/Eyebrow";

type Shot = { id: string; url: string; name: string; caption: string; date: number };

/**
 * Pulls the latest screenshots posted in the private testimonials group
 * (via a Telegram bot webhook -> netlify/functions/telegram-webhook.js)
 * and scrolls them in a marquee, same pattern as the quote marquee in
 * Testimonials.tsx. Renders nothing if the feed is empty or unreachable
 * (e.g. local dev, or before the bot has posted anything yet) so this is
 * safe to always mount.
 */
export function LiveProfitScroller() {
  const [shots, setShots] = useState<Shot[]>([]);

  useEffect(() => {
    fetch("/.netlify/functions/testimonial-shots")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setShots(Array.isArray(data) ? data : []))
      .catch(() => setShots([]));
  }, []);

  if (shots.length === 0) return null;

  const looped = [...shots, ...shots];

  return (
    <section className="section-y">
      <div className="container-px mx-auto max-w-2xl text-center">
        <Reveal>
          <Eyebrow>Live From The Free Channel</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-4 text-h2 text-ink">Results, Posted Daily</h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mt-4 font-body text-ink-muted">
            Real screenshots members share in the free channel.
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.2} className="group mt-10 overflow-hidden">
        <div className="flex w-max animate-marquee-slow gap-6 group-hover:[animation-play-state:paused]">
          {looped.map((shot, i) => (
            <div
              key={`${shot.id}-${i}`}
              className="w-52 shrink-0 overflow-hidden rounded-lg border border-border bg-surface"
            >
              <div className="h-64 w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={shot.url}
                  alt={shot.caption || "Member result screenshot"}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              {shot.name && (
                <p className="border-t border-border px-3 py-2 font-mono text-xs uppercase tracking-wide text-ink-muted">
                  {shot.name}
                </p>
              )}
            </div>
          ))}
        </div>
      </Reveal>

      <p className="container-px mx-auto mt-6 max-w-xl text-center font-mono text-[11px] text-ink-faint">
        Individual results shared by members. Not a guarantee of future
        performance — trading involves risk of loss.
      </p>
    </section>
  );
}
