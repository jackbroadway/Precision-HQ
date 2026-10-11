"use client";

import { useState } from "react";
import { ChevronDown, TrendingUp, X } from "lucide-react";
import { Gauge } from "./Gauge";

/**
 * Illustrative product preview only. Numbers here are operational
 * (membership, session settings, cohort capacity), never trading
 * performance or returns, per the brand's no income guarantee rule.
 */

function TogglePill({ options }: { options: [string, string] }) {
  const [active, setActive] = useState(0);
  return (
    <div className="flex rounded-full bg-background p-1">
      {options.map((label, i) => (
        <button
          key={label}
          type="button"
          onClick={() => setActive(i)}
          className={`flex-1 rounded-full py-1.5 font-mono text-[11px] transition-colors ${
            active === i
              ? "bg-surface-raised text-ink shadow-sm"
              : "text-ink-faint"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function CommunityCard() {
  return (
    <div className="rounded-2xl bg-surface p-5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-wide text-gold">
          Community
        </span>
        <span className="font-mono text-xs text-ink-faint">This Month</span>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="font-mono text-[28px] font-semibold text-ink">214</span>
        <span className="flex items-center gap-1 rounded-full bg-gold/10 px-2 py-0.5 font-mono text-[11px] text-gold">
          <TrendingUp className="h-3 w-3" />
          +18 (9%)
        </span>
      </div>
      <p className="mt-1 font-mono text-[11px] text-ink-faint">
        New members compared to last month
      </p>

      <p className="mt-5 text-center font-mono text-xs text-ink-muted">
        Progress to next member milestone
      </p>
      <div className="mt-2">
        <Gauge value={78} showLabels min={0} max={250} />
      </div>

      <div className="mt-5">
        <TogglePill options={["Community", "Telegram"]} />
      </div>
    </div>
  );
}

function SessionSettingsCard() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-surface p-5">
      <div>
        <label className="font-mono text-xs text-ink-muted">Show sessions for</label>
        <button
          type="button"
          className="mt-1.5 flex w-full items-center justify-between rounded-lg border border-border-strong px-3 py-2 font-mono text-sm text-ink"
        >
          This week
          <ChevronDown className="h-4 w-4 text-ink-faint" />
        </button>
      </div>

      <div>
        <label className="font-mono text-xs text-ink-muted">Timeframe focus</label>
        <button
          type="button"
          className="mt-1.5 flex w-full items-center justify-between rounded-lg border border-border-strong px-3 py-2 font-mono text-sm text-ink"
        >
          Daily and 4H
          <ChevronDown className="h-4 w-4 text-ink-faint" />
        </button>
      </div>

      <div>
        <label className="font-mono text-xs text-ink-muted">Weekly session target</label>
        <div className="mt-1.5 flex items-center gap-1 rounded-lg border border-border-strong px-3 py-2">
          <span className="font-mono text-sm text-ink-faint">#</span>
          <span className="font-mono text-sm text-ink">3</span>
        </div>
      </div>

      <div>
        <label className="font-mono text-xs text-ink-muted">Monthly review target</label>
        <div className="mt-1.5 flex items-center gap-1 rounded-lg border border-border-strong px-3 py-2">
          <span className="font-mono text-sm text-ink-faint">#</span>
          <span className="font-mono text-sm text-ink">12</span>
        </div>
      </div>

      <div className="mt-1 flex items-center gap-4">
        <button
          type="button"
          className="rounded-lg bg-gold px-5 py-2 font-mono text-sm text-background"
        >
          Save
        </button>
        <button type="button" className="font-mono text-sm text-ink-muted underline">
          Cancel
        </button>
        <X className="ml-auto h-4 w-4 text-ink-faint" />
      </div>
    </div>
  );
}

function MentorshipSpotsCard() {
  return (
    <div className="rounded-2xl bg-surface p-5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-wide text-gold">
          Mentorship Spots
        </span>
        <span className="font-mono text-xs text-ink-faint">this cohort</span>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="font-mono text-[28px] font-semibold text-ink">6</span>
        <span className="rounded-full bg-surface-raised px-2 py-0.5 font-mono text-[11px] text-ink-muted">
          of 10
        </span>
      </div>
      <p className="mt-1 font-mono text-[11px] text-ink-faint">
        Spots filled compared to last cohort
      </p>

      <p className="mt-5 text-center font-mono text-xs text-ink-muted">
        Cohort capacity
      </p>
      <div className="mt-2">
        <Gauge value={60} color="#6B6555" />
      </div>

      <div className="mt-5">
        <TogglePill options={["This Cohort", "All Time"]} />
      </div>
    </div>
  );
}

export function DashboardPreview() {
  return (
    <div className="px-3 sm:px-4">
      <div className="mx-auto w-full max-w-[880px] rounded-3xl bg-surface-raised/60 p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          <CommunityCard />
          <SessionSettingsCard />
          <MentorshipSpotsCard />
        </div>
      </div>
    </div>
  );
}
