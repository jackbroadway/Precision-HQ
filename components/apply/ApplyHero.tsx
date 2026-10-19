import { Button } from "../ui/Button";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../ui/Reveal";

export function ApplyHero() {
  return (
    <section className="section-y container-px pt-32 sm:pt-40">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <Eyebrow>1:1 Mentorship — Precision HQ</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="mt-4 text-h1 text-ink">
            Trade With
            <br />
            <span className="text-gold">Clarity &amp; Confidence</span>
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mx-auto mt-6 max-w-xl font-body text-ink-muted">
            A private, structured two month mentorship designed to give you a
            clear, repeatable approach to trading and the discipline to
            execute it without second guessing yourself.
          </p>
        </Reveal>
        <Reveal delay={0.24} className="mt-8">
          <Button href="#apply-form" variant="primary">
            Apply Now
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
