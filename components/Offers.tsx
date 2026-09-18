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

function Lock() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="mt-0.5 h-4 w-4 shrink-0 text-ink-faint"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4.5" y="9" width="11" height="8" rx="1.5" />
      <path d="M6.5 9V6.5a3.5 3.5 0 0 1 7 0V9" />
    </svg>
  );
}

type Tier = "free" | "vip" | "elite";
const TIER_RANK: Record<Tier, number> = { free: 0, vip: 1, elite: 2 };
const TIER_LABEL: Record<Tier, string> = {
  free: "Free",
  vip: "VIP",
  elite: "Elite",
};

const FEATURES: { text: string; unlocksAt: Tier; comingSoon?: boolean }[] = [
  { text: "Daily trade idea sample", unlocksAt: "free" },
  { text: "Full trade idea access, 1 to 4 Sniper limit orders per day", unlocksAt: "vip" },
  { text: "Scalp setups, London/New York session", unlocksAt: "vip" },
  { text: "Scalp setups, Asia session", unlocksAt: "vip", comingSoon: true },
  { text: "BTCUSD weekend setups", unlocksAt: "vip", comingSoon: true },
  { text: "Market analysis", unlocksAt: "elite" },
  { text: "Trade breakdowns", unlocksAt: "elite" },
  { text: "Educational videos", unlocksAt: "elite" },
  { text: "News updates", unlocksAt: "elite" },
  { text: "Community chat access", unlocksAt: "elite" },
];

function FeatureChecklist({ tier }: { tier: Tier }) {
  return (
    <ul className="mt-7 flex flex-col">
      {FEATURES.map((feature, i) => {
        const unlocked = TIER_RANK[tier] >= TIER_RANK[feature.unlocksAt];
        return (
          <li
            key={feature.text}
            className={`flex items-start gap-2.5 py-3 ${
              i > 0 ? "border-t border-border" : ""
            }`}
          >
            {unlocked ? <Check /> : <Lock />}
            <span
              className={`font-body text-sm ${
                unlocked ? "text-ink" : "text-ink-faint"
              }`}
            >
              {feature.text}
              {unlocked && feature.comingSoon && (
                <span className="ml-2 whitespace-nowrap rounded-full border border-gold-dim px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-gold-dim">
                  Coming Soon
                </span>
              )}
              {!unlocked && (
                <span className="ml-2 whitespace-nowrap font-mono text-[10px] uppercase tracking-wide text-ink-faint">
                  Unlocks at {TIER_LABEL[feature.unlocksAt]}
                </span>
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

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
            Start free, or upgrade for the full setups and education.
          </p>
        </Reveal>
      </div>

      <div className="mx-auto mt-16 grid max-w-5xl gap-8 pt-3 lg:grid-cols-3">
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

          <FeatureChecklist tier="free" />

          <div className="mt-auto pt-6">
            <Button
              href={links.startFreeHere}
              variant="secondary"
              className="w-full"
            >
              Join Free
            </Button>
            <p className="mt-3 min-h-12 text-center font-mono text-xs text-ink-faint">
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
            <span className="font-mono text-sm text-ink-muted">w/ top-up</span>
          </div>
          <p className="mt-1 font-mono text-xs text-ink-faint">
            or £197 one time without a top-up
          </p>
          <p className="mt-3 font-body text-sm text-ink-muted">
            The setups. Sniper limit orders and scalp setups across every
            session.
          </p>

          <FeatureChecklist tier="vip" />

          <div className="mt-auto pt-6">
            <Button href={links.vipJoin} variant="secondary" className="w-full">
              Join VIP
            </Button>
            <p className="mt-3 min-h-12 text-center font-mono text-xs text-ink-faint">
              Free with a £300+ account top-up (your trading capital, not a
              fee), or £197 one time without.
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
            <span className="font-mono text-sm text-ink-muted">w/ top-up</span>
          </div>
          <p className="mt-1 font-mono text-xs text-ink-faint">
            or £297 one time without a top-up
          </p>
          <p className="mt-3 font-body text-sm text-ink-muted">
            Everything in VIP, plus the full education and community.
          </p>

          <FeatureChecklist tier="elite" />

          <div className="mt-auto pt-6">
            <Button
              href={links.eliteJoin}
              variant="primary"
              className="w-full bg-gradient-to-r from-gold-dim via-gold to-gold-bright hover:opacity-90"
            >
              Join Elite
            </Button>
            <p className="mt-3 min-h-12 text-center font-mono text-xs text-ink-faint">
              £197 with a £300+ account top-up (your trading capital, not a
              fee), or £297 one time without.
            </p>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.16} className="mx-auto mt-8 max-w-5xl text-center">
        <p className="font-mono text-xs text-ink-faint">
          Want to go 1:1 with Jack instead?{" "}
          <a
            href={links.mentorshipApplication}
            className="text-gold hover:underline"
          >
            View &amp; apply for mentorship
          </a>
        </p>
      </Reveal>
    </section>
  );
}
