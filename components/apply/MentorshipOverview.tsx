import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../ui/Reveal";

const PARAGRAPHS = [
  "The 1:1 mentorship is built to help you trade with clarity, structure and confidence.",
  "We work together through weekly private video calls over two months. Just me and you.",
  "On each call, we break down your live or recent trades, refine your entries, stops and targets, and fix mistakes early. We focus on what you're struggling with and simplify everything so there's no guessing and no noise.",
  "You'll learn how to properly read market structure and apply a clear, repeatable approach to trading Gold, EURUSD and GBPUSD, with concepts you can also use on other pairs.",
  "There's a strong focus on risk management and mindset. Protecting capital, staying disciplined, avoiding overtrading and thinking long term. We'll also build you a solid trading plan so you're not trading based on emotion.",
  "The goal is consistency and confidence. By the end, you'll know exactly what you're looking for and be able to execute without second guessing.",
];

export function MentorshipOverview() {
  return (
    <section id="mentorship" className="section-y container-px">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <Eyebrow>The Program</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-4 text-h2 text-ink">1:1 Mentorship</h2>
        </Reveal>
        <Reveal
          delay={0.14}
          stagger
          className="mt-6 flex flex-col gap-4 font-body text-ink-muted"
        >
          {PARAGRAPHS.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
