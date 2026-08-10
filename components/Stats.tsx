import { CountUp } from "./ui/CountUp";
import { Reveal } from "./ui/Reveal";

const STATS = [
  { end: 200, suffix: "+", label: "Active Members" },
  { end: 6, suffix: "+", label: "Years Trading Full Time" },
  { end: 1000, suffix: "+", label: "Trade Ideas Shared" },
  { end: 3, suffix: "", label: "Core Markets Traded" },
];

export function Stats() {
  return (
    <Reveal
      as="div"
      stagger
      className="container-px grid grid-cols-2 gap-8 border-t border-border pt-10 sm:grid-cols-4 sm:gap-6"
    >
      {STATS.map((stat) => (
        <div key={stat.label} className="text-center sm:text-left">
          <CountUp
            end={stat.end}
            suffix={stat.suffix}
            className="block font-mono text-stat font-medium text-gold"
          />
          <p className="mt-1 font-mono text-xs uppercase tracking-[0.12em] text-ink-muted">
            {stat.label}
          </p>
        </div>
      ))}
    </Reveal>
  );
}
