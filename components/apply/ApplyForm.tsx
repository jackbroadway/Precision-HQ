"use client";

import { useState, type FormEvent } from "react";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../ui/Reveal";

const inputClass =
  "w-full rounded-sm border border-border bg-surface px-4 py-3 font-body text-sm text-ink placeholder:text-ink-faint focus:border-gold focus:outline-none";
const labelClass =
  "mb-2 block font-mono text-xs uppercase tracking-wide text-gold-dim";

function FormRow({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <label className={labelClass} htmlFor={htmlFor}>
        {label}
      </label>
      {children}
    </div>
  );
}

const INSTRUMENTS = ["Forex", "Gold (XAUUSD)", "Indices", "Crypto"];

export function ApplyForm() {
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const encoded = new URLSearchParams(data as unknown as Record<string, string>).toString();

    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encoded,
      });
      if (!res.ok) throw new Error(`Submission failed: ${res.status}`);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <section id="apply-form" className="section-y container-px">
        <Reveal className="mx-auto max-w-xl rounded-lg border border-gold-dim/40 bg-gold/5 p-10 text-center">
          <h3 className="text-h3 text-gold">Application Received</h3>
          <p className="mt-3 font-body text-sm text-ink-muted">
            Thanks for applying. I read every submission myself and will
            reach out personally if it&rsquo;s a good fit.
          </p>
        </Reveal>
      </section>
    );
  }

  return (
    <section id="apply-form" className="section-y container-px">
      <div className="mx-auto max-w-xl text-center">
        <Reveal>
          <Eyebrow>Ready To Get Started?</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-4 text-h2 text-ink">Apply For Mentorship</h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mt-3 font-body text-sm text-ink-muted">
            Fill in your details below. I read every application myself and
            will reach out to arrange a call if it&rsquo;s a good fit.
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.2} className="mx-auto mt-10 max-w-xl">
        <form
          name="mentorship-application"
          method="POST"
          data-netlify="true"
          netlify-honeypot="bot-field"
          onSubmit={handleSubmit}
          className="text-left"
        >
          <input type="hidden" name="form-name" value="mentorship-application" />
          <p className="hidden">
            <label>
              Don&rsquo;t fill this out: <input name="bot-field" />
            </label>
          </p>

          <FormRow label="Full Name" htmlFor="fullName">
            <input type="text" id="fullName" name="fullName" required className={inputClass} />
          </FormRow>

          <FormRow label="Email Address" htmlFor="email">
            <input type="email" id="email" name="email" required className={inputClass} />
          </FormRow>

          <FormRow label="Phone Number" htmlFor="phone">
            <input type="tel" id="phone" name="phone" required className={inputClass} />
          </FormRow>

          <FormRow label="What Country Are You From?" htmlFor="country">
            <input type="text" id="country" name="country" required className={inputClass} />
          </FormRow>

          <FormRow label="How Long Have You Been Trading?" htmlFor="experience">
            <select id="experience" name="experience" required defaultValue="" className={inputClass}>
              <option value="" disabled>Select one</option>
              <option value="Beginner (0 to 3 months)">Beginner (0 to 3 months)</option>
              <option value="Intermediate (3 to 12 months)">Intermediate (3 to 12 months)</option>
              <option value="Advanced (1+ year)">Advanced (1+ year)</option>
            </select>
          </FormRow>

          <FormRow label="What Do You Currently Trade?">
            <div className="flex flex-wrap gap-2">
              {INSTRUMENTS.map((instrument) => (
                <label
                  key={instrument}
                  className="flex cursor-pointer items-center gap-2 rounded-sm border border-border bg-surface px-3.5 py-2.5 font-body text-sm text-ink"
                >
                  <input type="checkbox" name="instruments" value={instrument} className="accent-gold" />
                  {instrument}
                </label>
              ))}
            </div>
          </FormRow>

          <FormRow label="What Is Your Biggest Struggle In Trading?" htmlFor="struggle">
            <textarea id="struggle" name="struggle" required rows={3} className={`${inputClass} resize-y`} />
          </FormRow>

          <FormRow label="Have You Ever Been Profitable?" htmlFor="profitable">
            <select id="profitable" name="profitable" required defaultValue="" className={inputClass}>
              <option value="" disabled>Select one</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </FormRow>

          <FormRow label="What Are Your Goals With This Mentorship?" htmlFor="goals">
            <textarea id="goals" name="goals" required rows={3} className={`${inputClass} resize-y`} />
          </FormRow>

          <FormRow label="How Serious Are You About Becoming Consistently Profitable? (1 to 5)">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <label
                  key={n}
                  className="flex flex-1 cursor-pointer items-center justify-center rounded-sm border border-border bg-surface py-2.5 font-body text-sm text-ink"
                >
                  <input type="radio" name="seriousness" value={n} required className="peer sr-only" />
                  <span className="peer-checked:text-gold">{n}</span>
                </label>
              ))}
            </div>
          </FormRow>

          <FormRow label="Weekly Time You Can Commit To Trading And Calls" htmlFor="timeCommitment">
            <select id="timeCommitment" name="timeCommitment" required defaultValue="" className={inputClass}>
              <option value="" disabled>Select one</option>
              <option value="1-3 Hours">1-3 Hours</option>
              <option value="4-7 Hours">4-7 Hours</option>
              <option value="8+ Hours">8+ Hours</option>
            </select>
          </FormRow>

          <FormRow label="Are You Ready To Invest In Your Trading Education?" htmlFor="readyToInvest">
            <select id="readyToInvest" name="readyToInvest" required defaultValue="" className={inputClass}>
              <option value="" disabled>Select one</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </FormRow>

          <FormRow label="What Is Your Current Trading Capital?" htmlFor="capital">
            <select id="capital" name="capital" required defaultValue="" className={inputClass}>
              <option value="" disabled>Select one</option>
              <option value="£0-£500">£0-£500</option>
              <option value="£500-£2000">£500-£2000</option>
              <option value="£2000+">£2000+</option>
            </select>
          </FormRow>

          <button
            type="submit"
            className="w-full rounded-sm bg-gold px-7 py-3.5 font-heading text-base uppercase tracking-wide text-background transition-colors hover:bg-gold-bright"
          >
            Apply Now
          </button>
          <p className="mt-3 text-center font-mono text-xs text-ink-faint">
            Spaces are limited. I&rsquo;ll be in touch personally within a few
            days.
          </p>
          {status === "error" && (
            <p className="mt-3 text-center font-body text-sm text-danger">
              Something went wrong sending your application. Please message
              @broadfxsupport directly instead.
            </p>
          )}
        </form>
      </Reveal>
    </section>
  );
}
