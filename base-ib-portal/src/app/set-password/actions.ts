"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type SetPasswordState = { error?: string };

export async function setPassword(
  _prev: SetPasswordState,
  formData: FormData,
): Promise<SetPasswordState> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (password.length < 8) return { error: "Use at least 8 characters." };
  if (password !== confirm) return { error: "Passwords don't match." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?m=link-invalid");

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return {
      error:
        error.code === "same_password"
          ? "Choose a password different from your temporary one."
          : error.message,
    };
  }

  // Clear the "must change password" flag set when an admin created the
  // account with a temporary password. app_metadata is only writable with
  // the secret key, so users can't clear it themselves without this step.
  if (user.app_metadata?.must_change_password) {
    const admin = createAdminClient();
    await admin.auth.admin.updateUserById(user.id, {
      app_metadata: { must_change_password: false },
    });
    await supabase.auth.refreshSession();
  }

  redirect("/");
}
