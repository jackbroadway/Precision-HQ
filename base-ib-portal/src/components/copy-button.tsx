"use client";

import { useState } from "react";

export function CopyButton({ text, label = "Copy caption" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          window.prompt("Copy the caption:", text);
        }
      }}
      className="inline-flex items-center justify-center rounded-sm bg-accent px-3 py-2 font-mono text-xs font-semibold tracking-wide text-on-accent uppercase hover:brightness-110"
    >
      {copied ? "✓ Copied" : label}
    </button>
  );
}
