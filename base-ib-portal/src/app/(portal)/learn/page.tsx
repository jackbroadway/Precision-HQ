import type { Metadata } from "next";
import { Alert, ButtonLink } from "@/components/ui";
import { GuideCard, ModuleCard, ProgressBar } from "@/components/learning";
import { moduleLabel, playbook, summarize } from "@/lib/learning";
import { LearningShell } from "./learning-shell";

export const metadata: Metadata = { title: "Playbook" };

export default async function PlaybookPage({ searchParams }: PageProps<"/learn">) {
  const { completed: justFinished } = await searchParams;

  return (
    <LearningShell>
      {({ completed }) => {
        const { done, total, percent, next, finished } = summarize(completed);
        return (
          <>
            {justFinished && finished && (
              <div className="mb-6">
                <Alert tone="ok">
                  You&apos;ve completed every module of the Base IB Playbook. Great work.
                </Alert>
              </div>
            )}

            <header className="mb-8 border-b border-line pb-8">
              <p className="font-mono text-xs tracking-widest text-accent uppercase">
                Partner education · {total} modules · ~{playbook.totalMinutes} min
              </p>
              <h1 className="mt-2 font-display text-4xl font-extrabold tracking-wide uppercase sm:text-5xl">
                {playbook.title}
              </h1>
              <p className="mt-3 max-w-[60ch] text-lg text-dim">{playbook.lede}</p>

              <div className="mt-6 max-w-md">
                <div className="mb-1.5 flex justify-between font-mono text-xs tracking-wider text-dim uppercase">
                  <span>{finished ? "Completed" : `${done} of ${total} complete`}</span>
                  <span>{percent}%</span>
                </div>
                <ProgressBar percent={percent} />
              </div>
              {next && (
                <ButtonLink href={`/learn/${next.slug}`} className="mt-6">
                  {done === 0 ? "Start module 01" : `Continue: ${moduleLabel(next.number)}`} →
                </ButtonLink>
              )}
            </header>

            <div
              className="lesson mb-10"
              dangerouslySetInnerHTML={{ __html: playbook.introHtml }}
            />

            <h2 className="mb-3 font-display text-2xl font-bold tracking-wide uppercase">Modules</h2>
            <div className="mb-10 grid gap-3 sm:grid-cols-2">
              {playbook.modules.map((m) => (
                <ModuleCard key={m.slug} module={m} done={completed.has(m.slug)} />
              ))}
            </div>

            <h2 className="mb-3 font-display text-2xl font-bold tracking-wide uppercase">Guides</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {playbook.guides.map((g) => (
                <GuideCard key={g.slug} guide={g} />
              ))}
            </div>
          </>
        );
      }}
    </LearningShell>
  );
}
