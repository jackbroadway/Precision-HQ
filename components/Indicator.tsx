import { Button } from "./ui/Button";
import { Eyebrow } from "./ui/Eyebrow";
import { Reveal } from "./ui/Reveal";
import { links, indicatorPrice } from "@/lib/config";

function Check() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="mt-0.5 h-4 w-4 shrink-0 text-gold"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 10.5l3.5 3.5L16 5.5" />
    </svg>
  );
}

const FEATURES = [
  {
    title: "Scalp Layer",
    body: "EMA based, filtered so it only fires in genuine trending conditions.",
  },
  {
    title: "Structure Layer",
    body: "Automatic order block detection built on confirmed market structure.",
  },
  {
    title: "Higher Probability Flags",
    body: "Surfaces the strongest zones separately from the rest.",
  },
  {
    title: "Bias Table",
    body: "Trend direction and strength across four timeframes, at a glance.",
  },
];

export function Indicator() {
  return (
    <section id="indicator" className="section-y container-px">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_360px] lg:gap-12">
        <div>
          <Reveal>
            <Eyebrow>The Indicator</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-4 text-h2 text-ink">Precision HQ Sniper</h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-4 max-w-xl font-body text-ink-muted">
              Precision HQ Sniper combines a multi EMA scalp system with
              automatic order block detection built on confirmed market
              structure.
            </p>
          </Reveal>

          <Reveal stagger delay={0.2} className="mt-7 flex flex-col gap-5">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="flex items-start gap-2.5">
                <Check />
                <div>
                  <span className="block font-heading text-sm uppercase tracking-wide text-ink">
                    {feature.title}
                  </span>
                  <span className="mt-1 block font-body text-sm leading-relaxed text-ink-muted">
                    {feature.body}
                  </span>
                </div>
              </div>
            ))}
          </Reveal>
        </div>

        <Reveal
          delay={0.1}
          className="flex flex-col rounded-2xl border border-gold bg-gradient-to-b from-surface-raised to-surface p-7 shadow-[0_0_40px_-12px_rgba(201,168,76,0.35)] lg:h-fit"
        >
          <span className="font-mono text-xs uppercase tracking-[0.15em] text-gold">
            Sniper Indicator
          </span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-4xl text-ink">{indicatorPrice}</span>
            <span className="font-mono text-sm text-ink-muted">one time</span>
          </div>
          <p className="mt-3 font-body text-sm text-ink-muted">
            TradingView invite-only access. You will be asked for your
            TradingView username at checkout so access can be granted
            directly to your account.
          </p>

          <div className="mt-7">
            <Button
              href={links.indicatorCheckout}
              variant="primary"
              className="w-full bg-gradient-to-r from-gold-dim via-gold to-gold-bright hover:opacity-90"
            >
              Get The Indicator
            </Button>
            <p className="mt-3 text-center font-mono text-xs text-ink-faint">
              One time payment. Non refundable.
            </p>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.1} className="mx-auto mt-10 max-w-5xl border-t border-border pt-6">
        <p className="max-w-3xl font-mono text-xs leading-relaxed text-ink-faint">
          This is a decision support tool built for traders who already
          understand market structure concepts. It does not provide
          financial advice, and it does not guarantee results. Past
          structure does not predict future price movement. Always use
          your own risk management.
        </p>
      </Reveal>
    </section>
  );
}
