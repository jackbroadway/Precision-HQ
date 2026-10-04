import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../ui/Reveal";

const STEPS = [
  {
    step: "01",
    title: "Book An Onboarding Call",
    body: "I only work with a small number of traders so I can give each person proper attention. The onboarding call is where we see if we're a good fit and discuss the details.",
  },
  {
    step: "02",
    title: "We Discuss Pricing And Fit",
    body: "If it makes sense for both of us, we'll go through pricing and what the mentorship will look like for your specific goals and experience level.",
  },
  {
    step: "03",
    title: "We Begin The Two Month Program",
    body: "Weekly calls begin, working through your trading in detail every step of the way until you're trading with clarity and confidence.",
  },
];

export function ProcessSteps() {
  return (
    <section id="process" className="section-y container-px">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <Eyebrow>Getting Started</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-4 text-h2 text-ink">How It Works</h2>
        </Reveal>
      </div>

      <Reveal
        stagger
        className="mx-auto mt-12 flex max-w-2xl flex-col gap-4"
      >
        {STEPS.map((item) => (
          <div
            key={item.step}
            className="flex items-start gap-5 rounded-lg border border-border bg-surface p-6"
          >
            <span className="shrink-0 rounded-sm border border-gold-dim bg-gold/10 px-3 py-1.5 font-mono text-xs text-gold">
              Step {item.step}
            </span>
            <div>
              <h3 className="font-heading text-sm uppercase tracking-wide text-ink">
                {item.title}
              </h3>
              <p className="mt-1.5 font-body text-sm leading-relaxed text-ink-muted">
                {item.body}
              </p>
            </div>
          </div>
        ))}
      </Reveal>

      <Reveal
        delay={0.2}
        className="mx-auto mt-8 max-w-2xl rounded-lg border border-gold-dim/40 bg-gold/5 p-6"
      >
        <p className="font-body text-sm leading-relaxed text-ink">
          <strong className="text-gold">Spaces are limited by design.</strong>{" "}
          This is a hands on, personal mentorship and I keep numbers low so
          every trader I work with gets proper attention.
        </p>
      </Reveal>
    </section>
  );
}
