import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui";
import { getModule, moduleLabel, playbook } from "@/lib/learning";
import { setModuleComplete } from "../actions";
import { LearningShell } from "../learning-shell";

export async function generateMetadata({ params }: PageProps<"/learn/[module]">): Promise<Metadata> {
  const m = getModule((await params).module);
  return { title: m ? `${moduleLabel(m.number)}: ${m.title}` : "Module" };
}

export default async function ModulePage({ params }: PageProps<"/learn/[module]">) {
  const m = getModule((await params).module);
  if (!m) notFound();

  const i = playbook.modules.indexOf(m);
  const prev = playbook.modules[i - 1];
  const next = playbook.modules[i + 1];
  const total = playbook.modules.length;

  return (
    <LearningShell currentSlug={m.slug}>
      {({ completed }) => {
        const done = completed.has(m.slug);
        return (
          <article>
            <header className="mb-8 flex items-end gap-4 border-b border-line pb-6">
              <span
                aria-hidden
                className="font-display text-7xl leading-[.8] font-extrabold text-transparent [-webkit-text-stroke:1.5px_var(--line)] sm:text-8xl"
              >
                {String(m.number).padStart(2, "0")}
              </span>
              <div>
                <p className="font-mono text-xs tracking-widest text-accent uppercase">
                  Module {m.number} of {total} · {m.kicker}
                </p>
                <h1 className="mt-1 font-display text-3xl leading-tight font-extrabold tracking-wide uppercase sm:text-4xl">
                  {m.title}
                </h1>
                <p className="mt-1 font-mono text-xs text-faint">
                  {m.minutes} min read{done && <span className="ml-2 text-ok">· ✓ Completed</span>}
                </p>
              </div>
            </header>

            <div className="lesson" dangerouslySetInnerHTML={{ __html: m.html }} />

            <footer className="mt-12 max-w-[68ch] border-t border-dashed border-line pt-6">
              {done ? (
                <div className="flex flex-wrap items-center gap-4">
                  <span className="font-mono text-sm tracking-wider text-ok uppercase">✓ Module completed</span>
                  <form action={setModuleComplete.bind(null, m.slug, false)}>
                    <button className="text-sm text-faint underline hover:text-text">Mark as not done</button>
                  </form>
                </div>
              ) : (
                <form action={setModuleComplete.bind(null, m.slug, true)}>
                  <Button type="submit">
                    {next ? "Mark complete & continue →" : "Mark complete & finish"}
                  </Button>
                </form>
              )}

              <nav className="mt-8 grid gap-3 sm:grid-cols-2">
                {prev ? (
                  <Link href={`/learn/${prev.slug}`} className="rounded-sm border border-line bg-surface p-4 hover:border-accent">
                    <span className="block font-mono text-[11px] tracking-wider text-faint uppercase">← Previous</span>
                    <span className="font-semibold">{prev.title}</span>
                  </Link>
                ) : (
                  <Link href="/learn" className="rounded-sm border border-line bg-surface p-4 hover:border-accent">
                    <span className="block font-mono text-[11px] tracking-wider text-faint uppercase">← Back</span>
                    <span className="font-semibold">Playbook overview</span>
                  </Link>
                )}
                {next && (
                  <Link href={`/learn/${next.slug}`} className="rounded-sm border border-line bg-surface p-4 text-right hover:border-accent">
                    <span className="block font-mono text-[11px] tracking-wider text-faint uppercase">Next →</span>
                    <span className="font-semibold">{next.title}</span>
                  </Link>
                )}
              </nav>
            </footer>
          </article>
        );
      }}
    </LearningShell>
  );
}
