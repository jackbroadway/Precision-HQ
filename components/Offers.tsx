import { Button } from "./ui/Button";
import { Eyebrow } from "./ui/Eyebrow";
import { Reveal } from "./ui/Reveal";
import { links } from "@/lib/config";

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

const COMMUNITY_FEATURES = [
  "Daily trade ideas with full reasoning behind every level",
  "Private trading channel and live session breakdowns",
  "Daily bias, Asia range and London Open notes posted each morning",
  "Trade idea archive so you can review past reasoning",
  "Direct access to Jack and the wider community",
];

const MENTORSHIP_FEATURES = [
  "8 weeks of 1:1 sessions with Jack",
  "A trading plan built around your account and schedule",
  "Direct reviews of your own trades and journal",
  "Private direct access for the full 8 weeks",
  "A structured path from the method to your own execution",
];

export function Offers() {
  return (
    <section id="offers" className="section-y container-px">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <Eyebrow>Work With Us</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-4 text-h2 text-ink">Two Ways In</h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mt-4 font-body text-ink-muted">
            Learn alongside the community or go through the method with Jack
            directly. Both are built around the same framework.
          </p>
        </Reveal>
      </div>

      <div className="mx-auto mt-14 grid max-w-4xl gap-6 lg:grid-cols-2">
        <Reveal
          delay={0.05}
          className="flex flex-col rounded-lg border border-border bg-surface p-8"
        >
          <span className="font-mono text-xs uppercase tracking-[0.15em] text-ink-muted">
            Community
          </span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-4xl text-ink">£197</span>
            <span className="font-mono text-sm text-ink-muted">one time</span>
          </div>
          <p className="mt-3 font-body text-sm text-ink-muted">
            Full access to the paid membership community and everything we
            publish inside it.
          </p>

          <ul className="mt-7 flex flex-col gap-3">
            {COMMUNITY_FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5">
                <Check />
                <span className="font-body text-sm text-ink">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Button href={links.communityCheckout} variant="primary" className="w-full">
              Get Instant Access
            </Button>
            <p className="mt-3 font-mono text-xs text-ink-faint">
              One time payment. Non refundable.
            </p>
          </div>
        </Reveal>

        <Reveal
          delay={0.12}
          className="flex flex-col rounded-lg border border-gold bg-surface-raised p-8"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-[0.15em] text-gold">
              Mentorship
            </span>
            <span className="rounded-full border border-border-strong px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-ink-muted">
              Application Only
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-2xl text-ink">Priced Individually</span>
          </div>
          <p className="mt-3 font-body text-sm text-ink-muted">
            8 weeks working directly with Jack, 1:1. Klarna is available at
            checkout for approved applicants.
          </p>

          <ul className="mt-7 flex flex-col gap-3">
            {MENTORSHIP_FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5">
                <Check />
                <span className="font-body text-sm text-ink">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Button href={links.mentorshipApplication} variant="primary" className="w-full">
              Apply For Mentorship
            </Button>
            <p className="mt-3 font-mono text-xs text-ink-faint">
              Application required. Non refundable once accepted.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
