import { ChevronRight } from "lucide-react";
import { PillNavbar } from "./PillNavbar";
import { DashboardPreview } from "./DashboardPreview";
import { Stats } from "../Stats";
import { links, media, siteConfig } from "@/lib/config";

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
              embedded ? "pt-28 sm:pt-36 lg:pt-40" : "pt-10 sm:pt-16"
            }`}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface-raised/80 px-4 py-1.5 font-mono text-[13px] text-ink-muted shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
              {siteConfig.name}
            </span>

            <h1 className="mt-5 max-w-4xl text-display text-ink sm:mt-6">
              Trade With A Method
              <br />
              <span className="text-gold-underline text-gold">Not A Hunch</span>
            </h1>

            <p className="mt-4 max-w-xl px-2 font-body text-base text-ink-muted sm:mt-6 sm:text-lg">
              Precision HQ teaches high to low analysis across Daily, 4H and 15M
              timeframes so you understand why a trade works, not just when
              to click buy.
            </p>

            <a
              href={links.telegramCommunity}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-3 rounded-full bg-ink py-2 pl-6 pr-2 font-mono text-sm text-background transition-opacity hover:opacity-90 sm:mt-8 sm:py-2.5 sm:pl-7"
            >
              Join Community
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-background/15 sm:h-7 sm:w-7">
                <ChevronRight className="h-4 w-4" />
              </span>
            </a>

            <div className="mt-12 w-full sm:mt-16">
              <Stats />
            </div>
          </div>

          <div className="mt-auto">
            <DashboardPreview />
          </div>
        </div>
      </div>
    </div>
  );
}
