"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { PLAYBOOK_SLUG, playbook } from "@/lib/learning";
import { createClient } from "@/lib/supabase/server";

/** Mark a module complete (then move on to the next one) or not complete. */
export async function setModuleComplete(slug: string, complete: boolean) {
  const { user } = await requireUser();
  const index = playbook.modules.findIndex((m) => m.slug === slug);
  if (index === -1) throw new Error("Unknown module");

  const supabase = await createClient();
  if (complete) {
    const { error } = await supabase
      .from("learning_progress")
      .upsert(
        { user_id: user.id, playbook: PLAYBOOK_SLUG, module: slug },
        { onConflict: "user_id,playbook,module", ignoreDuplicates: true },
      );
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase
      .from("learning_progress")
      .delete()
      .eq("user_id", user.id)
      .eq("playbook", PLAYBOOK_SLUG)
      .eq("module", slug);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/", "layout");
  if (complete) {
    const next = playbook.modules[index + 1];
    redirect(next ? `/learn/${next.slug}` : "/learn?completed=1");
  }
}
