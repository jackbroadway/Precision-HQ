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

const COMING_SOON = new Set([
  "Scalp setups throughout the Asia session",
  "BTCUSD weekend setups",
]);

function FeatureList({ features }: { features: string[] }) {
  return (
    <ul className="mt-7 flex flex-col">
      {features.map((feature, i) => (
        <li
          key={feature}
          className={`flex items-start gap-2.5 py-3 ${
            i > 0 ? "border-t border-border" : ""
          }`}
        >
          <Check />
          <span className="font-body text-sm text-ink">
            {feature}
            {COMING_SOON.has(feature) && (
              <span className="ml-2 whitespace-nowrap rounded-full border border-gold-dim px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-gold-dim">
                Coming Soon
              </span>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}

const FREE_FEATURES = [
  "1 to 2 trade ideas per day, selected at random from VIP",
  "Daily student results shared in the free channel",
  "No signup or payment required",
];

const VIP_FEATURES = [
  "1 to 4 Sniper limit orders per day",
  "Scalp setups throughout the London/New York session",
  "Scalp setups throughout the Asia session",
  "BTCUSD weekend setups",
];

const ELITE_FEATURES = [
  "Market analysis",
  "Trade breakdowns",
  "Educational videos",
  "News updates",
  "Community chat access",
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
          <h2 className="mt-4 text-h2 text-ink">Pick Your Access</h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mt-4 font-body text-ink-muted">
            Start free, upgrade for the full setups and education, or go 1:1
            with Jack directly.
          </p>
        </Reveal>
      </div>

      <div className="mx-auto mt-16 grid max-w-6xl gap-8 pt-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Free Insights */}
        <Reveal
          delay={0.02}
          className="flex flex-col rounded-2xl border border-border-strong bg-gradient-to-b from-surface to-surface p-7"
        >
          <span className="w-fit rounded-full border border-border-strong px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-ink-muted">
            100% Free
          </span>
          <span className="mt-4 font-mono text-xs uppercase tracking-[0.15em] text-ink-muted">
            Free Insights
          </span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-4xl text-ink">£0</span>
          </div>
          <p className="mt-3 font-body text-sm text-ink-muted">
            A taste of what VIP sees. No signup, no payment, no catch.
          </p>

          <FeatureList features={FREE_FEATURES} />

          <div className="mt-auto pt-6">
            <Button
              href={links.freeInsights}
              variant="secondary"
              className="w-full"
            >
              Join Free
            </Button>
            <p className="mt-3 text-center font-mono text-xs text-ink-faint">
              No signup. No payment.
            </p>
          </div>
        </Reveal>

        {/* VIP */}
        <Reveal
          delay={0.06}
          className="flex flex-col rounded-2xl border border-border-strong bg-gradient-to-b from-surface to-surface p-7"
        >
          <span className="font-mono text-xs uppercase tracking-[0.15em] text-ink-muted">
            VIP
          </span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-4xl text-ink">Free</span>
            <span className="font-mono text-sm text-ink-muted">w/ broker</span>
          </div>
          <p className="mt-1 font-mono text-xs text-ink-faint">
            or £197 one time without a broker
          </p>
          <p className="mt-3 font-body text-sm text-ink-muted">
            The setups. Sniper limit orders and scalp setups across every
            session.
          </p>

          <FeatureList features={VIP_FEATURES} />

          <div className="mt-auto pt-6">
            <Button href={links.vipJoin} variant="secondary" className="w-full">
              Join VIP
            </Button>
            <p className="mt-3 text-center font-mono text-xs text-ink-faint">
              Free with our recommended broker (£300 min deposit), or £197
              one time without.
            </p>
          </div>
        </Reveal>

        {/* Elite */}
        <Reveal
          delay={0.1}
          className="relative flex flex-col rounded-2xl border border-gold bg-gradient-to-b from-surface-raised to-surface p-7 shadow-[0_0_40px_-12px_rgba(201,168,76,0.35)]"
        >
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-gold-dim via-gold to-gold-bright px-4 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-background shadow-md">
            Most Popular
          </span>

          <span className="font-mono text-xs uppercase tracking-[0.15em] text-gold">
            Elite
          </span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-4xl text-ink">£197</span>
            <span className="font-mono text-sm text-ink-muted">w/ broker</span>
          </div>
          <p className="mt-1 font-mono text-xs text-ink-faint">
            or £297 one time without a broker
          </p>
          <p className="mt-3 font-body text-sm text-ink-muted">
            Everything in VIP, plus the full education and community.
          </p>

          <FeatureList features={ELITE_FEATURES} />

          <div className="mt-auto pt-6">
            <Button
              href={links.eliteJoin}
              variant="primary"
              className="w-full bg-gradient-to-r from-gold-dim via-gold to-gold-bright hover:opacity-90"
            >
              Join Elite
            </Button>
            <p className="mt-3 text-center font-mono text-xs text-ink-faint">
              £197 with our recommended broker (£300 min deposit), or £297
              one time without.
            </p>
          </div>
        </Reveal>

        {/* Mentorship */}
        <Reveal
          delay={0.14}
          className="flex flex-col rounded-2xl border border-border-strong bg-gradient-to-b from-surface to-surface p-7"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-[0.15em] text-ink-muted">
              Mentorship
            </span>
            <span className="rounded-full border border-border-strong px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-ink-muted">
              Apply Only
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-xl text-ink">
              Discussed On Your Call
            </span>
          </div>
          <p className="mt-3 font-body text-sm text-ink-muted">
            8 weeks working directly with Jack, 1:1. A 3 month interest free
            payment plan is available for approved applicants.
          </p>

          <FeatureList features={MENTORSHIP_FEATURES} />

          <div className="mt-auto pt-6">
            <Button
              href={links.mentorshipApplication}
              variant="secondary"
              className="w-full"
            >
              View &amp; Apply
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
