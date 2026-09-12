const TICK_COUNT = 40;
const ARC_START = Math.PI;
const ARC_END = Math.PI * 2;
const CENTER = { x: 100, y: 100 };
const OUTER_RADIUS = 80;
const TICK_LENGTH = 10;

type GaugeProps = {
  value: number;
  color?: string;
  showLabels?: boolean;
  min?: number;
  max?: number;
};

export function Gauge({
  value,
  color = "#C9A84C",
  showLabels = false,
  min,
  max,
}: GaugeProps) {
  const activeCount = Math.round((value / 100) * TICK_COUNT);

  const ticks = Array.from({ length: TICK_COUNT }, (_, i) => {
    const angle = ARC_START + (i / (TICK_COUNT - 1)) * (ARC_END - ARC_START);
    const innerRadius = OUTER_RADIUS - TICK_LENGTH;

    const x1 = CENTER.x + innerRadius * Math.cos(angle);
    const y1 = CENTER.y + innerRadius * Math.sin(angle);
    const x2 = CENTER.x + OUTER_RADIUS * Math.cos(angle);
    const y2 = CENTER.y + OUTER_RADIUS * Math.sin(angle);

    return { x1, y1, x2, y2, active: i < activeCount };
  });

  return (
    <div>
      <svg viewBox="0 0 200 120" className="mx-auto w-full max-w-[260px]">
        {ticks.map((tick, i) => (
          <line
            key={i}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            stroke={tick.active ? color : "#2A2416"}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        ))}
        <text
          x="100"
          y="105"
          textAnchor="middle"
          fontSize={22}
          fontWeight={600}
          fontFamily="var(--font-mono)"
          fill="#F3F1E8"
        >
          {value}%
        </text>
      </svg>
      {showLabels && (
        <div className="mx-auto flex max-w-[220px] justify-between font-mono text-[11px] text-ink-faint">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
}
