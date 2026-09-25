import type { ReactNode } from "react";
import { ModuleNav } from "@/components/learning";
import { requireUser } from "@/lib/auth";
import { getCompletedModules, playbook, summarize } from "@/lib/learning";

/** Two-column layout: module list on the left, reading column on the right. */
export async function LearningShell({
  currentSlug,
  children,
}: {
  currentSlug?: string;
  children: (ctx: { completed: Set<string> }) => ReactNode;
}) {
  const { user } = await requireUser();
  const completed = await getCompletedModules(user.id);
  const { done, percent } = summarize(completed);

  return (
    <div className="grid gap-8 lg:grid-cols-[270px_minmax(0,1fr)] lg:gap-12">
      <div>
        <ModuleNav
          modules={playbook.modules}
          guides={playbook.guides}
          completed={completed}
          currentSlug={currentSlug}
          done={done}
          percent={percent}
        />
      </div>
      <div className="min-w-0">{children({ completed })}</div>
    </div>
  );
}
