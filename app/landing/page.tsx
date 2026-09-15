import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { HeroProofStrip } from "@/components/HeroProofStrip";
import { Testimonials } from "@/components/Testimonials";
import { Offers } from "@/components/Offers";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { links } from "@/lib/config";

/**
 * Standalone ad-landing page, separate from the main site nav/homepage.
 * Not linked from Nav.tsx on purpose - reachable only by direct URL
 * (/landing) for campaign traffic that should land somewhere with zero
 * navigation choices above the fold, then flow straight into proof and
 * pricing. Reuses the same design tokens and already-built Testimonials /
 * Offers / FinalCTA / Footer sections so it stays on-brand.
 */
export default function LandingPage() {
  return (
    <>
      <main className="bg-background">
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-24 text-center">
          <div
            className="pointer-events-none absolute -top-1/3 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gold opacity-[0.12] blur-[180px]"
            aria-hidden="true"
          />
          <div className="noise-overlay" aria-hidden="true" />

          <div className="relative flex flex-col items-center">
            <Image
              src="/brand/logo.png"
              alt="Precision HQ"
              width={1013}
              height={251}
              className="h-10 w-auto sm:h-12"
              priority
            />

            <p className="mt-8 font-mono text-xs uppercase tracking-[0.25em] text-gold">
              Gold &middot; GBPUSD &middot; EURUSD
            </p>

            <h1 className="mt-4 max-w-3xl text-display font-semibold normal-case tracking-normal text-ink">
              Stop guessing.{" "}
              <span className="text-gold-underline text-gold">
                Start trading with precision.
              </span>
            </h1>

            <p className="mt-6 max-w-xl font-body text-lg text-ink-muted sm:text-xl">
              Daily high-to-low trade ideas across the Daily, 4H and 15M,
              shared free in our Telegram every session.
            </p>

            <div className="mt-10">
              <Button href={links.freeInsightsChannel} variant="primary" className="px-10 py-4 text-lg">
                Get Free Trade Ideas
              </Button>
              <p className="mt-3 font-mono text-xs uppercase tracking-wide text-ink-muted">
                2,000+ traders already in the free channel
              </p>
              <div className="mt-4 flex justify-center">
                <HeroProofStrip />
              </div>
            </div>
          </div>
        </section>

        <Testimonials />
        <Offers />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
