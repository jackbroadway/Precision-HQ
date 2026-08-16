"use client";

import { useState } from "react";
import { Button } from "../ui/Button";

type BrokerCardProps = {
  name: string;
  signupUrl: string;
  transferInstructions: string;
};

export function BrokerCard({
  name,
  signupUrl,
  transferInstructions,
}: BrokerCardProps) {
  const [tab, setTab] = useState<"new" | "existing">("new");

  return (
    <div className="flex flex-col rounded-lg border border-border bg-surface p-6">
      <h3 className="font-heading text-lg uppercase tracking-wide text-ink">
        {name}
      </h3>

      <div className="mt-4 flex gap-1 rounded-sm border border-border p-1">
        <button
          type="button"
          onClick={() => setTab("new")}
          className={`flex-1 rounded-sm py-2 font-mono text-xs uppercase tracking-wide transition-colors ${
            tab === "new"
              ? "bg-gold text-background"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          New Trader
        </button>
        <button
          type="button"
          onClick={() => setTab("existing")}
          className={`flex-1 rounded-sm py-2 font-mono text-xs uppercase tracking-wide transition-colors ${
            tab === "existing"
              ? "bg-gold text-background"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          Already Have An Account
        </button>
      </div>

      <div className="mt-5 flex-1">
        {tab === "new" ? (
          <>
            <p className="font-body text-sm leading-relaxed text-ink-muted">
              Brand new to {name}? Sign up using the link below so your
              account is linked to Precision HQ.
            </p>
            <div className="mt-5">
              <Button href={signupUrl} variant="primary" className="w-full">
                Sign Up To {name}
              </Button>
            </div>
          </>
        ) : (
          <p className="font-body text-sm leading-relaxed text-ink-muted">
            {transferInstructions}
          </p>
        )}
      </div>
    </div>
  );
}
