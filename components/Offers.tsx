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
  "Daily trade ideas, called using the same method",
  "News, updates and announcements as they happen",
  "Education hub with trade breakdowns and market analysis",
  "Mindset section to keep discipline and psychology in check",
  "Daily bias, Asia range and London Open notes posted each morning",
  "Ongoing direct support from Jack and the community chat",
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

      <div className="mx-auto mt-16 grid max-w-4xl gap-8 pt-3 lg:grid-cols-2">
        <Reveal
          delay={0.05}
          className="relative flex flex-col rounded-2xl border border-gold bg-gradient-to-b from-surface-raised to-surface p-8 shadow-[0_0_40px_-12px_rgba(201,168,76,0.35)]"
        >
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-gold-dim via-gold to-gold-bright px-4 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-background shadow-md">
            Most Popular
          </span>

          <span className="font-mono text-xs uppercase tracking-[0.15em] text-gold">
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

          <ul className="mt-7 flex flex-col">
            {COMMUNITY_FEATURES.map((feature, i) => (
              <li
                key={feature}
                className={`flex items-start gap-2.5 py-3 ${
                  i > 0 ? "border-t border-border" : ""
                }`}
              >
                <Check />
                <span className="font-body text-sm text-ink">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <Button
              href={links.communityCheckout}
              variant="primary"
              className="w-full bg-gradient-to-r from-gold-dim via-gold to-gold-bright hover:opacity-90"
            >
              Get Instant Access
            </Button>
            <p className="mt-3 text-center font-mono text-xs text-ink-faint">
              One time payment. Non refundable.
            </p>
          </div>
        </Reveal>

        <Reveal
          delay={0.12}
          className="flex flex-col rounded-2xl border border-border-strong bg-gradient-to-b from-surface to-surface p-8"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-[0.15em] text-ink-muted">
              Mentorship
            </span>
            <span className="rounded-full border border-border-strong px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-ink-muted">
              Application Only
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-2xl text-ink">Discussed On Your Onboarding Call</span>
          </div>
          <p className="mt-3 font-body text-sm text-ink-muted">
            8 weeks working directly with Jack, 1:1. A 3 month interest free
            payment plan is available for approved applicants.
          </p>

          <ul className="mt-7 flex flex-col">
            {MENTORSHIP_FEATURES.map((feature, i) => (
              <li
                key={feature}
                className={`flex items-start gap-2.5 py-3 ${
                  i > 0 ? "border-t border-border" : ""
                }`}
              >
                <Check />
                <span className="font-body text-sm text-ink">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <Button
              href={links.mentorshipApplication}
              variant="secondary"
              className="w-full"
            >
              Apply For Mentorship
            </Button>
            <p className="mt-3 text-center font-mono text-xs text-ink-faint">
              Application required. Non refundable once accepted.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
