"use server";

import { createClient } from "@/lib/supabase/server";

export type ForgotState = { sent?: boolean; error?: string };

export async function requestReset(_prev: ForgotState, formData: FormData): Promise<ForgotState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "Enter your email." };

  const supabase = await createClient();
  // The link in the email is built by the "Reset Password" email template
  // in Supabase (see README) and lands on /auth/confirm.
  await supabase.auth.resetPasswordForEmail(email);

  // Always report success so the form can't be used to discover accounts.
  return { sent: true };
}
