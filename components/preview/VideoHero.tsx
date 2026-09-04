import { PillNavbar } from "./PillNavbar";
import { Stats } from "../Stats";
import { Button } from "../ui/Button";
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
              embedded ? "pt-28 sm:pt-36 lg:pt-40" : "pt-10 sm:pt-16"
            }`}
          >
            <h1 className="max-w-4xl text-display text-ink">
              Patience Is
              <br />
              <span className="text-gold-underline text-gold">Precision</span>
            </h1>

            <div className="mt-4 max-w-xl px-2 sm:mt-6">
              <p className="font-body text-lg text-ink sm:text-xl">
                No chasing moves.
              </p>
              <p className="mt-2 font-body text-base text-ink-muted sm:text-lg">
                Just methods that wait for the market to confirm itself.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:mt-8 sm:flex-row">
              <Button href="/#offers" variant="primary">
                View Access Tiers
              </Button>
              <Button href={links.mentorshipApplication} variant="secondary">
                Apply For Mentorship
              </Button>
            </div>

            <div className="mt-12 w-full sm:mt-16">
              <Stats />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
