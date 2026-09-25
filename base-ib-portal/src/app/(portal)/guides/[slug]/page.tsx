import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuide } from "@/lib/learning";
import { LearningShell } from "../../learn/learning-shell";

export async function generateMetadata({ params }: PageProps<"/guides/[slug]">): Promise<Metadata> {
  return { title: getGuide((await params).slug)?.title ?? "Guide" };
}

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const g = getGuide((await params).slug);
  if (!g) notFound();

  return (
    <LearningShell currentSlug={g.slug}>
      {() => (
        <article>
          <header className="mb-8 border-b border-line pb-6">
            <p className="font-mono text-xs tracking-widest text-accent uppercase">
              Guide · {g.kicker} · {g.minutes} min read
            </p>
            <h1 className="mt-1 font-display text-3xl font-extrabold tracking-wide uppercase sm:text-4xl">
              {g.title}
            </h1>
          </header>
          <div className="lesson" dangerouslySetInnerHTML={{ __html: g.html }} />
          <p className="mt-10">
            <Link href="/learn" className="font-mono text-xs tracking-wider text-dim uppercase hover:text-accent">
              ← Playbook overview
            </Link>
          </p>
        </article>
      )}
    </LearningShell>
  );
}
