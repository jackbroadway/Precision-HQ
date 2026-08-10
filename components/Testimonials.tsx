import { Eyebrow } from "./ui/Eyebrow";
import { Reveal } from "./ui/Reveal";

const PLACEHOLDER_CARDS = [1, 2, 3];

export function Testimonials() {
  return (
    <section id="results" className="section-y container-px">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <Eyebrow>Results</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-4 text-h2 text-ink">What Members Say</h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mt-4 font-body text-ink-muted">
            Placeholder quotes below. Swap each one for a real member
            testimonial before this page goes live, nothing here is a real
            quote yet.
          </p>
        </Reveal>
      </div>

      <Reveal
        stagger
        className="mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-3"
      >
        {PLACEHOLDER_CARDS.map((n) => (
          <div
            key={n}
            className="flex flex-col justify-between rounded-lg border border-dashed border-border-strong bg-surface p-7"
          >
            <div>
              <span className="inline-block rounded-full border border-gold px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-gold">
                Placeholder {n}
              </span>
              <p className="mt-5 font-body text-sm leading-relaxed text-ink-muted">
                &ldquo;Replace this with a real quote from a Precision HQ
                member. Keep it specific, what changed for them and why.&rdquo;
              </p>
            </div>
            <div className="mt-6 border-t border-border pt-4">
              <p className="font-heading text-sm uppercase tracking-wide text-ink">
                Member Name
              </p>
              <p className="font-mono text-xs text-ink-faint">
                Community or Mentorship, add role here
              </p>
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
