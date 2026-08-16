import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { BrokerCard } from "@/components/welcome/BrokerCard";
import { brokers, links, welcomeChecklist } from "@/lib/config";

export const metadata = {
  title: "Welcome — Precision HQ",
  description: "One last step to finish setting up your Precision HQ access.",
};

export default function WelcomePage() {
  return (
    <>
      <Nav />
      <main>
        <section className="section-y container-px pt-32 sm:pt-40">
          <div className="mx-auto max-w-2xl text-center">
            <Reveal>
              <Eyebrow>You&rsquo;re In</Eyebrow>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-4 text-h1 text-ink">One Last Step</h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mx-auto mt-6 max-w-xl font-body text-ink-muted">
                Payment received. Before you get your community invite, set
                up your broker account below. Pick whichever of our partner
                brokers works for you, brand new or already trading with
                them, both are covered.
              </p>
            </Reveal>
          </div>

          <Reveal
            delay={0.22}
            className="mx-auto mt-8 max-w-xl rounded-lg border border-border bg-surface p-6"
          >
            <ol className="flex flex-col gap-3">
              {welcomeChecklist.map((step, i) => (
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

        <section className="container-px pb-12">
          <Reveal
            stagger
            className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3"
          >
            {brokers.map((broker) => (
              <BrokerCard key={broker.name} {...broker} />
            ))}
          </Reveal>
        </section>

        <section className="section-y container-px">
          <Reveal className="mx-auto max-w-2xl rounded-lg border border-gold-dim/40 bg-gold/5 p-8 text-center">
            <h2 className="text-h3 text-gold">Done All Of That?</h2>
            <p className="mt-3 font-body text-sm text-ink-muted">
              Message support with a screenshot of your verified, funded
              account and you&rsquo;ll get your community invite straight
              away.
            </p>
            <div className="mt-6">
              <Button href={links.telegramCommunity} variant="primary">
                Confirm With Support
              </Button>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
