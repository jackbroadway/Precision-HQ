import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { links } from "@/lib/config";

export const metadata = {
  title: "Indicator Access — Precision HQ",
  description: "Payment received for Precision HQ Sniper. Here's what happens next.",
};

const STEPS = [
  "We've received your payment and your TradingView username from checkout.",
  "We manually grant invite-only access to your TradingView account.",
  "You'll receive access within 24 hours. Once granted, you can add the indicator to any chart from TradingView's Indicators panel under Invite-Only Scripts.",
];

export default function IndicatorAccessPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="section-y container-px pt-32 sm:pt-40">
          <div className="mx-auto max-w-2xl text-center">
            <Reveal>
              <Eyebrow>Payment Received</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-4 text-h1 text-ink">
                Your Access Is On The Way
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mx-auto mt-6 max-w-xl font-body text-ink-muted">
                Thanks for picking up Precision HQ Sniper. There&rsquo;s
                nothing else for you to do, we&rsquo;ll take it from here.
              </p>
            </Reveal>
          </div>

          <Reveal
            delay={0.22}
            className="mx-auto mt-8 max-w-xl rounded-lg border border-border bg-surface p-6"
          >
            <ol className="flex flex-col gap-3">
              {STEPS.map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold-dim font-mono text-xs text-gold">
                    {i + 1}
                  </span>
                  <span className="font-body text-sm leading-relaxed text-ink-muted">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>
        </section>

        <section className="section-y container-px">
          <Reveal className="mx-auto max-w-2xl rounded-lg border border-gold-dim/40 bg-gold/5 p-8 text-center">
            <h2 className="text-h3 text-gold">Wrong TradingView Username?</h2>
            <p className="mt-3 font-body text-sm text-ink-muted">
              If you think you mistyped your TradingView username at
              checkout, or haven&rsquo;t received access after 24 hours,
              message support and we&rsquo;ll sort it out.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
              <Button href={links.indicatorAccessHelp} variant="primary">
                Message Support
              </Button>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
