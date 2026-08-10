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
  "Marks daily bias zones directly on the chart",
  "Highlights the Asia session range automatically",
  "Flags the London Open sweep as it happens",
  "Colour codes Daily, 4H and 15M context so you always know what you are looking at",
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
            <h2 className="mt-4 text-h2 text-ink">
              See The Method Live On Your Charts
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="mt-4 max-w-xl font-body text-ink-muted">
              The Sniper Indicator plots the same framework taught in the
              Method section directly onto TradingView, so you see the
              structure forming in real time instead of guessing where it
              might be. Built for XAUUSD, GBPUSD and EURUSD, the same
              markets covered throughout Precision HQ.
            </p>
          </Reveal>

          <Reveal stagger delay={0.2} className="mt-7 flex flex-col gap-3">
            {FEATURES.map((feature) => (
              <div key={feature} className="flex items-start gap-2.5">
                <Check />
                <span className="font-body text-sm text-ink">{feature}</span>
              </div>
            ))}
          </Reveal>
        </div>

        <Reveal
          delay={0.1}
          className="flex flex-col rounded-lg border border-border bg-surface p-7 lg:h-fit"
        >
          <span className="font-mono text-xs uppercase tracking-[0.15em] text-ink-muted">
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
            <Button href={links.indicatorCheckout} variant="primary" className="w-full">
              Get The Indicator
            </Button>
            <p className="mt-3 font-mono text-xs text-ink-faint">
              One time payment. Non refundable.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
