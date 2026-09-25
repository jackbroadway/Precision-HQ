import type { Metadata } from "next";
import { AuthShell } from "../auth-shell";
import { ForgotForm } from "./forgot-form";

export const metadata: Metadata = { title: "Reset password" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell title="Reset password">
      <ForgotForm />
    </AuthShell>
  );
}
