import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { GuideCard, ModuleCard, ProgressBar } from "@/components/learning";
import { ButtonLink, Card, PageHeader, Stat } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getCompletedModules, moduleLabel, playbook, summarize } from "@/lib/learning";

export const metadata: Metadata = { title: "Dashboard" };

function SectionTitle({ title, href, linkLabel }: { title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-4">
      <h2 className="font-display text-2xl font-bold tracking-wide uppercase">{title}</h2>
      {href && (
        <Link href={href} className="font-mono text-xs tracking-wider text-dim uppercase hover:text-accent">
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}

export default async function DashboardPage() {
  const { user, profile } = await requireUser();
  if (profile.role === "admin") redirect("/admin");

  // Broker, IB account and rate are admin-only (not readable by sub-IBs).
  const completed = await getCompletedModules(user.id);
  const progress = summarize(completed);
  const firstName = profile.full_name?.split(" ")[0];

  return (
    <div className="space-y-10">
      <PageHeader eyebrow="Partner dashboard" title={firstName ? `Welcome, ${firstName}` : "Welcome"} />

      {/* 1. Continue learning */}
      <Card>
        <p className="font-mono text-xs tracking-wider text-accent uppercase">
          {progress.finished ? "Playbook complete" : "Continue learning"}
        </p>
        <h2 className="mt-1 font-display text-3xl font-extrabold tracking-wide uppercase">
          {progress.next ? progress.next.title : playbook.title}
        </h2>
        <p className="mt-1 text-dim">
          {progress.next
            ? `${moduleLabel(progress.next.number)} · ${progress.next.kicker} · ${progress.next.minutes} min read`
            : "You've completed all modules. Revisit any of them from the list below."}
        </p>
        <div className="mt-6 max-w-xl">
          <div className="mb-1.5 flex justify-between font-mono text-xs tracking-wider text-dim uppercase">
            <span>
              {progress.done} of {progress.total} modules
            </span>
            <span>{progress.percent}%</span>
          </div>
          <ProgressBar percent={progress.percent} />
        </div>
        <ButtonLink href={progress.next ? `/learn/${progress.next.slug}` : "/learn"} className="mt-5">
          {progress.done === 0 ? "Start the playbook →" : progress.next ? "Continue →" : "Open playbook"}
        </ButtonLink>
      </Card>

      {/* 2. Playbook modules */}
      <section>
        <SectionTitle title={playbook.title} href="/learn" linkLabel="Overview" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {playbook.modules.map((m) => (
            <ModuleCard key={m.slug} module={m} done={completed.has(m.slug)} />
          ))}
        </div>
      </section>

      {/* 3. Guides */}
      <section>
        <SectionTitle title="Guides" />
        <div className="grid gap-3 sm:grid-cols-3">
          {playbook.guides.map((g) => (
            <GuideCard key={g.slug} guide={g} />
          ))}
        </div>
      </section>

      {/* 4. Profile */}
      <Card>
        <h2 className="mb-5 font-display text-xl font-bold tracking-wide uppercase">Your profile</h2>
        <dl className="grid gap-5 sm:grid-cols-3">
          <Stat label="Name" value={profile.full_name ?? "—"} />
          <Stat label="Email" value={profile.email} />
          <Stat
            label="Partner since"
            value={new Date(profile.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          />
        </dl>
      </Card>
    </div>
  );
}
