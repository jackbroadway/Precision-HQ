import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AuthShell } from "../auth-shell";
import { SetPasswordForm } from "./set-password-form";

export const metadata: Metadata = { title: "Set password" };

export default async function SetPasswordPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <AuthShell title="Set your password">
      <p className="mb-4 text-sm text-dim">
        Signed in as <span className="font-mono">{session.profile.email}</span>
      </p>
      <SetPasswordForm />
    </AuthShell>
  );
}
