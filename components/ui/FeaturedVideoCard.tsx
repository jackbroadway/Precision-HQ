"use client";

import { useEffect, useState } from "react";

function PlayIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="ml-0.5 h-5 w-5"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export function FeaturedVideoCard({
  src,
  poster,
  posterPosition = "center",
}: {
  src: string;
  poster?: string;
  posterPosition?: "center" | "top";
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Play member video testimonial"
        className="group/video relative aspect-[640/352] h-32 shrink-0 overflow-hidden rounded-lg border border-gold bg-surface sm:h-36"
      >
        <video
          src={src}
          poster={poster}
          muted
          playsInline
          preload="none"
          className={`h-full w-full object-cover ${
            posterPosition === "top" ? "object-top" : "object-center"
          }`}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-background/40 transition-colors group-hover/video:bg-background/20">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-background sm:h-10 sm:w-10">
            <PlayIcon />
          </span>
        </div>
        <span className="absolute bottom-2 left-2 rounded-full bg-background/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-ink">
          Watch
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative flex max-h-full max-w-2xl justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={src}
              controls
              autoPlay
              playsInline
              className="max-h-[85vh] w-auto max-w-full rounded-lg"
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close video"
              className="absolute -top-10 right-0 font-mono text-xs uppercase tracking-wide text-ink hover:text-gold"
            >
              Close ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
