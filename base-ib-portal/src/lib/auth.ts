import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";
import type { Profile } from "./types";

/**
 * The signed-in user plus their profile row, or null.
 * Uses getUser() (verified with Supabase Auth on each call) rather than
 * trusting the cookie, and is cached for the duration of one request.
 */
export const getSession = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, created_at")
    .eq("id", user.id)
    .single<Profile>();
  if (!profile) return null;

  return {
    user,
    profile,
    mustChangePassword: user.app_metadata?.must_change_password === true,
  };
});

/** Any signed-in user. Redirects to /login otherwise. */
export async function requireUser() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.mustChangePassword) redirect("/set-password");
  return session;
}

/** Admins only. Sub-IBs are sent to their dashboard. */
export async function requireAdmin() {
  const session = await requireUser();
  if (session.profile.role !== "admin") redirect("/dashboard");
  return session;
}
