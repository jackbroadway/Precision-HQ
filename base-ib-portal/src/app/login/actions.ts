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

  if (error) {
    switch (error.code) {
      // Deliberately vague: don't reveal whether the email exists.
      case "invalid_credentials":
        return { error: "Incorrect email or password.", email };
      case "email_not_confirmed":
        return { error: "This account hasn't been confirmed yet. Contact Base.IB support.", email };
      case "user_banned":
        return { error: "Your partner account is inactive. Contact Base.IB support.", email };
      default:
        // Configuration or service problems (wrong API key, Supabase down…):
        // surface them instead of blaming the password.
        console.error("Sign-in failed:", error.code, error.message);
        return { error: `Sign-in failed: ${error.message}`, email };
    }
  }

  redirect("/");
}
