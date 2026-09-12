import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../ui/Reveal";

const PILLARS = [
  {
    title: "Weekly Private Calls",
    body: "Eight one to one video calls over two months. Just you and me, working through your trading in detail every week.",
  },
  {
    title: "Live Trade Breakdowns",
    body: "We review your live or recent trades together, refining your entries, stops and targets and correcting mistakes before they become habits.",
  },
  {
    title: "Market Structure",
    body: "A clear, repeatable approach to reading structure on Gold, EURUSD and GBPUSD, with concepts that transfer across other pairs too.",
  },
  {
    title: "Risk Management",
    body: "Protecting capital, staying disciplined, avoiding overtrading and learning to think in terms of the long game rather than any single trade.",
  },
  {
    title: "Mindset",
    body: "Trading is as much psychological as it is technical. We work on the discipline and mental framework that lets you execute without hesitation.",
  },
  {
    title: "Your Trading Plan",
    body: "By the end, you'll have a solid, personalised trading plan so every decision comes from structure and process, not emotion.",
  },
];

export function CoveragePillars() {
  return (
    <section id="focus" className="section-y container-px">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>What&rsquo;s Included</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-4 text-h2 text-ink">
              What We Cover Together
            </h2>
          </Reveal>
        </div>

        <Reveal
          stagger
          className="mt-12 grid overflow-hidden rounded-lg border border-border sm:grid-cols-3"
        >
          {PILLARS.map((pillar, i) => (
            <div
              key={pillar.title}
              className={`bg-surface p-7 ${
                i % 3 !== 0 ? "sm:border-l sm:border-border" : ""
              } ${i >= 3 ? "border-t border-border" : ""}`}
            >
              <h3 className="font-heading text-sm uppercase tracking-wide text-gold">
                {pillar.title}
              </h3>
              <p className="mt-2.5 font-body text-sm leading-relaxed text-ink-muted">
                {pillar.body}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
