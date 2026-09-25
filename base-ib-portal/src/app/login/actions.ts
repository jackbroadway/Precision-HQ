"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type LoginState = { error?: string; email?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { error: "Enter your email and password.", email };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error?.code === "user_banned") {
    return { error: "Your partner account is inactive. Contact Base.IB support.", email };
  }
  // Deliberately vague: don't reveal whether the email exists.
  if (error) return { error: "Incorrect email or password.", email };

  redirect("/");
}
