import "server-only";
import { guides, intro, modules } from "@/content/playbook.generated";
import { createClient } from "./supabase/server";

export const PLAYBOOK_SLUG = "base-ib-playbook";

export const playbook = {
  slug: PLAYBOOK_SLUG,
  title: intro.title,
  lede: intro.lede,
  introHtml: intro.html,
  modules,
  guides,
  totalMinutes: modules.reduce((sum, m) => sum + m.minutes, 0),
};

export type Module = (typeof modules)[number];
export type Guide = (typeof guides)[number];

export const getModule = (slug: string) => modules.find((m) => m.slug === slug);
export const getGuide = (slug: string) => guides.find((g) => g.slug === slug);

export const moduleLabel = (n: number) => `Module ${String(n).padStart(2, "0")}`;

/** Slugs of the modules `userId` has completed (RLS: own rows, or any if admin). */
export async function getCompletedModules(userId: string): Promise<Set<string>> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("learning_progress")
    .select("module")
    .eq("user_id", userId)
    .eq("playbook", PLAYBOOK_SLUG);
  return new Set((data ?? []).map((r) => r.module as string));
}

/** Progress summary used by the dashboard, sidebar and admin partner page. */
export function summarize(completed: Set<string>) {
  const done = modules.filter((m) => completed.has(m.slug)).length;
  return {
    done,
    total: modules.length,
    percent: Math.round((done / modules.length) * 100),
    next: modules.find((m) => !completed.has(m.slug)) ?? null,
    finished: done === modules.length,
  };
}
