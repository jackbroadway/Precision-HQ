import { Button } from "./ui/Button";
import { Eyebrow } from "./ui/Eyebrow";
import { Reveal } from "./ui/Reveal";
import { Stats } from "./Stats";
import { links } from "@/lib/config";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden pb-16 pt-32 sm:pt-40 lg:pb-24 lg:pt-48"
    >
      <div
        className="pointer-events-none absolute -top-1/3 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gold opacity-[0.08] blur-[160px]"
        aria-hidden="true"
      />
      <div className="noise-overlay" aria-hidden="true" />

      <div className="container-px relative flex flex-col items-center gap-8 text-center">
        <Reveal>
          <Eyebrow>Gold and FX Trading Education</Eyebrow>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="max-w-4xl text-display text-ink">
            Patience Is
            <br />
            <span className="text-gold-underline text-gold">Precision</span>
          </h1>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="max-w-xl text-balance font-body text-base text-ink-muted sm:text-lg">
            Precision HQ teaches high to low analysis across Daily, 4H and 15M
            timeframes so you understand why a trade works, not just when to
            click buy. Built around XAUUSD, GBPUSD and EURUSD.
          </p>
        </Reveal>

        <Reveal delay={0.24} className="flex flex-col gap-4 sm:flex-row">
          <Button href={links.telegramCommunity} variant="primary">
            Join Community
          </Button>
          <Button href={links.mentorshipApplication} variant="secondary">
            Apply For Mentorship
          </Button>
        </Reveal>
      </div>

      <div className="mt-20 lg:mt-28">
        <Stats />
      </div>
    </section>
  );
}
