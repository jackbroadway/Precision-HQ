import type { ReactNode } from "react";
import { Card, Logo } from "@/components/ui";

/** Centered card used by the signed-out pages. */
export function AuthShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <Logo className="text-4xl" />
          <p className="mt-1 font-mono text-xs tracking-widest text-faint uppercase">
            Partner Portal
          </p>
        </div>
        <Card>
          <h1 className="mb-5 font-display text-2xl font-bold tracking-wide uppercase">{title}</h1>
          {children}
        </Card>
      </div>
    </main>
  );
}
