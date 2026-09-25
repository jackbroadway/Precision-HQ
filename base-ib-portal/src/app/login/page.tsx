import type { Metadata } from "next";
import { AuthShell } from "../auth-shell";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

const NOTICES: Record<string, string> = {
  "signed-out": "You've been signed out.",
  "link-invalid": "That link is invalid or has expired. Request a new one.",
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { m } = await searchParams;
  const notice = typeof m === "string" ? NOTICES[m] : undefined;

  return (
    <AuthShell title="Sign in">
      <LoginForm notice={notice} />
    </AuthShell>
  );
}
