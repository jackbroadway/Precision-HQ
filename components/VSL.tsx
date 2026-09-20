"use client";

import { useState } from "react";
import { Eyebrow } from "./ui/Eyebrow";
import { Reveal } from "./ui/Reveal";

function PlayIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="ml-1 h-7 w-7 sm:h-8 sm:w-8"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

/**
 * Full-width VSL player, sat right below the hero. Shows a poster with a
 * play button until clicked (needs real audio + a deliberate play, unlike
 * the silent looping background clip in VideoHero), then swaps to a real
 * <video> with native controls.
 */
export function VSL() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="section-y">
      <div className="container-px mx-auto max-w-2xl text-center">
        <Reveal>
          <Eyebrow>Watch This First</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-4 text-h2 text-ink">The Method, Explained</h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mt-4 font-body text-ink-muted">
            Two minutes on why most traders never get consistent, and what we
            do differently.
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.2} className="container-px mt-10">
        <div className="mx-auto max-w-lg">
        <div className="relative aspect-video overflow-hidden rounded-lg border border-border-strong bg-surface shadow-[0_40px_100px_-30px_rgba(0,0,0,0.6)]">
          {playing ? (
            <video
              src="/video/vsl.mp4"
              controls
              autoPlay
              playsInline
              className="h-full w-full"
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label="Play video"
              className="group/vsl absolute inset-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/video/vsl-poster.jpg"
                alt="Watch the method explained"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-background/30 transition-colors group-hover/vsl:bg-background/20">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold text-background transition-transform group-hover/vsl:scale-105 sm:h-20 sm:w-20">
                  <PlayIcon />
                </span>
              </div>
            </button>
          )}
        </div>
        </div>
      </Reveal>
    </section>
  );
}
