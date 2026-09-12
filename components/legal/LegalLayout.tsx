import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/ui/Reveal";

export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <main>
        <section className="section-y container-px pt-32 sm:pt-40">
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <h1 className="text-h1 text-ink">{title}</h1>
            </Reveal>
            <Reveal delay={0.06}>
              <p className="mt-3 font-mono text-xs uppercase tracking-wide text-ink-faint">
                Last updated {updated}
              </p>
            </Reveal>
            <Reveal
              delay={0.12}
              className="prose-legal mt-10 flex flex-col gap-6 font-body text-sm leading-relaxed text-ink-muted"
            >
              {children}
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-heading text-lg uppercase tracking-wide text-ink">
        {heading}
      </h2>
      {children}
    </div>
  );
}
