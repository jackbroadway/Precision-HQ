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

const FREE_FEATURES = [
  "Daily trade idea sample",
  "See the method applied every session",
  "No signup, no payment, no catch",
];

/**
 * VIP/Elite used to be shown here as priced tiers with a feature-unlock
 * checklist. Per Jack, pricing for those is now handled directly in a
 * Telegram conversation rather than published on the site, so this
 * section is just the free tier plus a low-key nudge toward messaging
 * him for VIP/Elite - not a pricing table.
 */
export function Offers() {
  return (
    <section id="offers" className="section-y container-px">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <Eyebrow>Start Here</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-4 text-h2 text-ink">Free Trade Ideas, No Catch</h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mt-4 font-body text-ink-muted">
            Join the free channel first and see the method for yourself.
          </p>
        </Reveal>
      </div>

      <Reveal
        delay={0.1}
        className="mx-auto mt-12 flex max-w-md flex-col rounded-2xl border border-border-strong bg-gradient-to-b from-surface to-surface p-7"
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

        <ul className="mt-7 flex flex-col">
          {FREE_FEATURES.map((feature, i) => (
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

        <div className="mt-auto pt-6">
          <Button
            href={links.startFreeHere}
            variant="primary"
            className="w-full"
          >
            Join Free
          </Button>
          <p className="mt-3 text-center font-mono text-xs text-ink-faint">
            No signup. No payment.
          </p>
        </div>
      </Reveal>

      <Reveal
        delay={0.16}
        className="mx-auto mt-8 max-w-md rounded-2xl border border-gold/40 bg-surface/50 p-6 text-center"
      >
        <p className="font-body text-sm text-ink-muted">
          Want the full setups, scalps and education? Message us on Telegram
          and we&rsquo;ll talk you through VIP and Elite access and what it
          costs.
        </p>
        <div className="mt-4">
          <Button href={links.vipEliteInterest} variant="secondary">
            Ask About VIP / Elite
          </Button>
        </div>
      </Reveal>

      <Reveal delay={0.2} className="mx-auto mt-8 max-w-5xl text-center">
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
