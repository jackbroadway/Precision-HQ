"use client";

import { useState } from "react";
import { Button } from "../ui/Button";

type BrokerCardProps = {
  name: string;
  signupUrl: string;
  transferMethod: "form" | "email";
  ibNumber?: string;
  ibFieldLabel?: string;
  transferSteps?: readonly string[];
  transferNote?: string | null;
  transferEmail?: string;
  transferEmailBody?: string;
};

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="font-mono text-[11px] uppercase tracking-wide text-gold hover:text-gold-bright"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export function BrokerCard({
  name,
  signupUrl,
  transferMethod,
  ibNumber,
  ibFieldLabel,
  transferSteps,
  transferNote,
  transferEmail,
  transferEmailBody,
}: BrokerCardProps) {
  const [tab, setTab] = useState<"new" | "existing">("existing");

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
        ) : transferMethod === "form" ? (
          <>
            <ol className="flex flex-col gap-2.5">
              {transferSteps?.map((step, i) => (
                <li
                  key={step}
                  className="flex gap-2.5 font-body text-sm leading-relaxed text-ink-muted"
                >
                  <span className="shrink-0 font-mono text-xs text-gold-dim">
                    {i + 1}.
                  </span>
                  {step}
                </li>
              ))}
            </ol>
            {ibNumber && (
              <div className="mt-4 rounded-sm border border-border bg-background p-3">
                <p className="font-mono text-[11px] uppercase tracking-wide text-gold-dim">
                  {ibFieldLabel}
                </p>
                <div className="mt-1.5 flex items-center justify-between gap-2">
                  <span className="font-mono text-sm text-ink">
                    {ibNumber}
                  </span>
                  <CopyButton value={ibNumber} />
                </div>
              </div>
            )}
            {transferNote && (
              <p className="mt-4 font-mono text-xs text-ink-faint">
                {transferNote}
              </p>
            )}
          </>
        ) : (
          <>
            <p className="font-body text-sm leading-relaxed text-ink-muted">
              {name} doesn&rsquo;t have a self-service transfer form. Email
              their partners team with the message below.
            </p>
            <div className="mt-4 rounded-sm border border-border bg-background p-3">
              <p className="font-mono text-[11px] uppercase tracking-wide text-gold-dim">
                Email To
              </p>
              <p className="mt-1.5 font-mono text-sm text-ink">
                {transferEmail}
              </p>
            </div>
            {transferEmailBody && (
              <div className="mt-3 rounded-sm border border-border bg-background p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono text-[11px] uppercase tracking-wide text-gold-dim">
                    Message
                  </p>
                  <CopyButton value={transferEmailBody} />
                </div>
                <p className="mt-1.5 whitespace-pre-line font-body text-sm leading-relaxed text-ink-muted">
                  {transferEmailBody}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
