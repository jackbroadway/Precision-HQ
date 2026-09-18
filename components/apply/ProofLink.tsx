import { Button } from "../ui/Button";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../ui/Reveal";

export function ProofLink() {
  return (
    <section className="section-y container-px">
      <Reveal className="mx-auto max-w-2xl rounded-lg border border-border bg-surface p-10 text-center">
        <Eyebrow>Proof</Eyebrow>
        <h2 className="mt-4 text-h3 text-ink">
          See The Certificates And Member Results
        </h2>
        <p className="mt-3 font-body text-sm text-ink-muted">
          Real certificates, member trader passes and testimonials are on the
          main site, not locked behind an application.
        </p>
        <div className="mt-6">
          <Button href="/#credibility" variant="secondary">
            View Results
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
