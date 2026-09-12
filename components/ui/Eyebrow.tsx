import type { ReactNode } from "react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-gold">
      <span className="h-px w-6 bg-gold" aria-hidden="true" />
      {children}
    </span>
  );
}
