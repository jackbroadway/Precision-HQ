import { Eyebrow } from "./ui/Eyebrow";
import { Reveal } from "./ui/Reveal";

const CARDS = [
  {
    icon: (
      <path
        d="M12 17.5v-.75m0-2.75c0-1.1.9-1.6 1.63-2.2.73-.6 1.37-1.3 1.37-2.3 0-1.66-1.5-3-3-3s-3 1.2-3 2.75M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
        fill="none"
      />
    ),
    title: "No Reasoning",
    body: "You get an entry and a stop loss copied from someone else, no bias, no structure, nothing behind it. When the trade loses you have no idea what actually changed on the chart.",
  },
  {
    icon: (
      <path
        d="M12 3l7 3v5c0 4.5 -3 8 -7 10 -4 -2 -7 -5.5 -7 -10V6l7 -3Z M9.5 12l1.8 1.8 3.2 -3.6"
        fill="none"
      />
    ),
    title: "No Risk Framework",
    body: "Position size, drawdown limits and when to step back are never covered. One bad week of blindly following calls can undo months of account growth.",
  },
  {
    icon: (
      <path
        d="M9 3H6a3 3 0 0 0 -3 3v3M15 3h3a3 3 0 0 1 3 3v3M9 21H6a3 3 0 0 1 -3 -3v-3M15 21h3a3 3 0 0 0 3 -3v-3M8 12h8"
        fill="none"
      />
    ),
    title: "Total Dependency",
    body: "The moment the group goes quiet or the caller has an off week, you have no method of your own to fall back on. You never actually learned to trade.",
  },
];

export function Problem() {
  return (
    <section className="section-y container-px">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <Eyebrow>The Problem</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-4 text-h2 text-ink">
            Why Blind Signal Groups Fail Traders
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mt-4 font-body text-ink-muted">
            Copying trade ideas with no context feels like progress. It is
            not. Here is what it actually costs you.
          </p>
        </Reveal>
      </div>

      <Reveal
        stagger
        className="mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-3"
      >
        {CARDS.map((card) => (
          <div
            key={card.title}
            className="rounded-lg border border-border bg-surface p-7"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-9 w-9 stroke-gold"
              strokeWidth={1.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {card.icon}
            </svg>
            <h3 className="mt-5 text-h3 text-ink">{card.title}</h3>
            <p className="mt-3 font-body text-sm leading-relaxed text-ink-muted">
              {card.body}
            </p>
          </div>
        ))}
      </Reveal>

      <Reveal delay={0.24} className="mx-auto mt-10 max-w-3xl text-center">
        <p className="font-body text-sm leading-relaxed text-ink-muted">
          That is exactly why Precision HQ is built around a News &amp;
          Updates feed, Announcements, a Mindset section, a full Education
          hub for trade breakdowns and analysis, and ongoing direct support
          from Jack and the community chat, not just calls.
        </p>
      </Reveal>
    </section>
  );
}
