import { Eyebrow } from "./ui/Eyebrow";
import { Reveal } from "./ui/Reveal";

const STEPS = [
  {
    step: "01",
    title: "Daily Bias",
    body: "Every session starts on the Daily chart. We read where price sits relative to key levels and order blocks to form a directional bias before anything else, long, short or no trade at all.",
  },
  {
    step: "02",
    title: "4H and Asia Range Structure",
    body: "The 4H chart shows how the current move is structured. The Asia session range marks out a pocket of liquidity resting above and below price that the rest of the day tends to react around.",
  },
  {
    step: "03",
    title: "London Open Sweep",
    body: "London Open is where the Asia range is often swept. We watch how price behaves around that sweep, the reaction matters far more than the size of the first move.",
  },
  {
    step: "04",
    title: "15M and New York Confirmation",
    body: "The 15M chart is used to confirm the idea into New York. Order blocks and market structure on the lower timeframe are lined up against the bias formed earlier in the day.",
  },
];

export function Method() {
  return (
    <section id="method" className="section-y container-px">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <Eyebrow>The Method</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-4 text-h2 text-ink">
            High To Low Analysis, Every Session
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mt-4 font-body text-ink-muted">
            Four timeframes, one framework. This is the concept behind every
            trade idea we share, not a set of exact entry rules.
          </p>
        </Reveal>
      </div>

      <div className="relative mx-auto mt-16 max-w-2xl">
        <div
          className="absolute left-[19px] top-2 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-gold via-border-strong to-transparent sm:left-[23px]"
          aria-hidden="true"
        />

        <ol className="flex flex-col gap-12">
          {STEPS.map((item, i) => (
            <Reveal key={item.step} as="li" delay={i * 0.05} className="relative pl-14 sm:pl-16">
              <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-gold bg-background font-mono text-xs text-gold sm:h-12 sm:w-12">
                {item.step}
              </span>
              <h3 className="text-h3 text-ink">{item.title}</h3>
              <p className="mt-2 max-w-lg font-body text-sm leading-relaxed text-ink-muted">
                {item.body}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
