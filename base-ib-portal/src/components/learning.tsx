import Link from "next/link";
import type { Guide, Module } from "@/lib/learning";

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
const pad = (n: number) => String(n).padStart(2, "0");

export function ProgressBar({ percent, className }: { percent: number; className?: string }) {
  return (
    <div
      className={cx("h-1.5 overflow-hidden rounded-full bg-surface-2", className)}
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-ok to-accent transition-[width]"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

function Check({ done }: { done: boolean }) {
  return (
    <span
      aria-label={done ? "Completed" : "Not started"}
      className={cx(
        "flex h-5 w-5 flex-none items-center justify-center rounded-full border text-[11px] font-bold",
        done ? "border-ok bg-ok text-surface" : "border-line text-transparent",
      )}
    >
      ✓
    </span>
  );
}

/** Numbered card linking to a module — used in the dashboard/overview grids. */
export function ModuleCard({ module: m, done }: { module: Module; done: boolean }) {
  return (
    <Link
      href={`/learn/${m.slug}`}
      className="group flex items-start gap-4 rounded-sm border border-line bg-surface p-4 transition hover:border-accent"
    >
      <span className="font-display text-4xl leading-none font-extrabold text-faint group-hover:text-accent">
        {pad(m.number)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-mono text-[11px] tracking-wider text-faint uppercase">
          {m.kicker} · {m.minutes} min
        </span>
        <span className="mt-0.5 block leading-snug font-semibold">{m.title}</span>
      </span>
      <Check done={done} />
    </Link>
  );
}

export function GuideCard({ guide: g }: { guide: Guide }) {
  return (
    <Link
      href={`/guides/${g.slug}`}
      className="group block rounded-sm border border-line bg-surface p-4 transition hover:border-accent"
    >
      <span className="block font-mono text-[11px] tracking-wider text-faint uppercase">
        {g.kicker} · {g.minutes} min
      </span>
      <span className="mt-0.5 block font-semibold group-hover:text-accent">{g.title} →</span>
    </Link>
  );
}

/** Module list with ticks. Sticky sidebar on desktop, collapsible on mobile. */
export function ModuleNav({
  modules,
  guides,
  completed,
  currentSlug,
  percent,
  done,
}: {
  modules: readonly Module[];
  guides: readonly Guide[];
  completed: Set<string>;
  currentSlug?: string;
  percent: number;
  done: number;
}) {
  const list = (
    <nav className="space-y-5">
      <div>
        <div className="mb-1.5 flex justify-between font-mono text-[11px] tracking-wider text-dim uppercase">
          <span>Your progress</span>
          <span>
            {done}/{modules.length}
          </span>
        </div>
        <ProgressBar percent={percent} />
      </div>
      <div>
        <Link
          href="/learn"
          className={cx(
            "mb-1 block rounded-sm px-2 py-1.5 font-mono text-xs tracking-wider uppercase hover:bg-surface-2",
            !currentSlug ? "text-accent" : "text-dim",
          )}
        >
          Start here
        </Link>
        <ol className="space-y-0.5">
          {modules.map((m) => {
            const active = m.slug === currentSlug;
            return (
              <li key={m.slug}>
                <Link
                  href={`/learn/${m.slug}`}
                  aria-current={active ? "page" : undefined}
                  className={cx(
                    "flex items-center gap-2.5 rounded-sm border-l-2 px-2 py-1.5 text-sm leading-snug",
                    active
                      ? "border-accent bg-surface-2 text-text"
                      : "border-transparent text-dim hover:bg-surface-2 hover:text-text",
                  )}
                >
                  <span className="w-5 flex-none font-mono text-[11px] text-faint">{pad(m.number)}</span>
                  <span className="flex-1">{m.title}</span>
                  <Check done={completed.has(m.slug)} />
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
      <div>
        <p className="mb-1 px-2 font-mono text-[11px] tracking-wider text-faint uppercase">Guides</p>
        <ul className="space-y-0.5">
          {guides.map((g) => (
            <li key={g.slug}>
              <Link
                href={`/guides/${g.slug}`}
                aria-current={g.slug === currentSlug ? "page" : undefined}
                className={cx(
                  "block rounded-sm px-2 py-1.5 text-sm hover:bg-surface-2 hover:text-text",
                  g.slug === currentSlug ? "bg-surface-2 text-text" : "text-dim",
                )}
              >
                {g.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );

  return (
    <>
      <details className="mb-6 rounded-sm border border-line bg-surface lg:hidden">
        <summary className="cursor-pointer px-4 py-3 font-mono text-xs tracking-wider text-dim uppercase">
          All modules · {done}/{modules.length} complete
        </summary>
        <div className="border-t border-line p-3">{list}</div>
      </details>
      <aside className="sticky top-6 hidden max-h-[calc(100vh-3rem)] overflow-y-auto lg:block">
        {list}
      </aside>
    </>
  );
}
