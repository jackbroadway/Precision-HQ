import { PillNavbar } from "./PillNavbar";
import { Button } from "../ui/Button";
import { HeroProofStrip } from "../HeroProofStrip";
import { VSL } from "../VSL";
import { links, media } from "@/lib/config";

type VideoHeroProps = {
  /**
   * True when mounted under the site's real fixed Nav (which already
   * provides navigation + the scroll progress bar). Hides the built-in
   * PillNavbar to avoid a duplicate, and adds top clearance so the
   * headline doesn't sit under the fixed bar.
   */
  embedded?: boolean;
};

/**
 * Video hero variant, built to preview a floating-pill-nav + full-bleed
 * hero pattern against Precision HQ's actual brand. Reskinned from a
 * generic SaaS reference: dark theme (the brand is dark only), gold
 * instead of orange, Barlow Condensed instead of a serif accent (the
 * brand spec never called for a serif face), and no hotlinked third
 * party video. Set lib/config.ts `media.heroVideoUrl` to your own hosted
 * clip once you have one; until then this falls back to the same radial
 * gold glow used on the real homepage hero.
 */
export function VideoHero({ embedded = false }: VideoHeroProps) {
  return (
    <div id="top" className={`w-full bg-background p-3 sm:p-4 ${embedded ? "" : "min-h-screen"}`}>
      <div
        className={`relative w-full overflow-hidden rounded-2xl bg-surface sm:rounded-3xl ${
          embedded ? "" : "h-[calc(100vh-24px)] sm:h-[calc(100vh-32px)]"
        }`}
      >
        {media.heroVideoUrl ? (
          <video
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            disableRemotePlayback
            poster={media.heroPosterUrl || undefined}
            src={media.heroVideoUrl}
          />
        ) : (
          <div className="absolute inset-0" aria-hidden="true">
            <div className="absolute -top-1/4 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gold opacity-[0.1] blur-[160px]" />
            <div className="noise-overlay" />
          </div>
        )}

        <div
          className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/20 to-background"
          aria-hidden="true"
        />

        <div className="relative z-10 flex h-full flex-col">
          {!embedded && <PillNavbar />}

          <div
            className={`flex flex-col items-center px-4 pb-8 text-center sm:pb-12 ${
              embedded ? "pt-16 sm:pt-36 lg:pt-40" : "pt-10 sm:pt-16"
            }`}
          >
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">
              Patience Is Precision
            </p>

            <h1 className="mt-2 max-w-2xl text-h1 font-semibold normal-case tracking-normal text-ink sm:mt-3">
              Learn To Trade <span className="text-gold-underline text-gold">With Precision</span>
            </h1>

            <div className="mt-4 w-full px-2 sm:mt-8">
              <VSL />
            </div>

            <p className="mt-3 max-w-md font-heading text-base font-medium normal-case text-ink-muted sm:mt-6 sm:text-lg">
              Trade ideas sent daily.
            </p>

            <div className="mt-4 sm:mt-8">
              <Button
                href={links.joinFree}
                variant="primary"
                className="gap-3 bg-gradient-to-r from-gold to-gold-bright hover:opacity-90"
              >
                Join Free Academy
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Button>
              <p className="mt-2 max-w-xs font-body text-sm text-ink-muted">
                Free access. Takes less than a minute.
              </p>
            </div>

            <div className="mt-4 flex flex-col items-center gap-2 sm:mt-8">
              <span className="font-mono text-xs text-ink-faint">Want more?</span>
              <a
                href={links.mentorshipApplication}
                className="rounded-full border border-gold/50 bg-gold/10 px-5 py-2 font-mono text-xs uppercase tracking-wide text-gold shadow-[0_0_30px_-6px_rgba(201,168,76,0.65)] transition-shadow hover:shadow-[0_0_40px_-4px_rgba(201,168,76,0.85)]"
              >
                Apply For 1:1 Coaching
              </a>
            </div>

            <div className="mt-4">
              <HeroProofStrip />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
