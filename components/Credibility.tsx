import Image from "next/image";
import { Eyebrow } from "./ui/Eyebrow";
import { Reveal } from "./ui/Reveal";

const CERTIFICATES = [
  {
    src: "/credibility/ftmo-verification-1.jpg",
    alt: "FTMO Passed Verification certificate, 4 Dec 2025",
  },
  {
    src: "/credibility/ftmo-verification-2.jpg",
    alt: "FTMO Passed Verification certificate, 18 Nov 2025",
  },
  {
    src: "/credibility/ftmo-verification-3.jpg",
    alt: "FTMO Passed Verification certificate, 13 Oct 2025",
  },
  {
    src: "/credibility/alpha-capital-verification.jpg",
    alt: "Alpha Capital Group Passed Verification certificate",
  },
];

export function Credibility() {
  return (
    <section id="credibility" className="section-y container-px">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <Eyebrow>Proof It Works</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-4 text-h2 text-ink">Funded, Not Just Talking</h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mt-4 font-body text-ink-muted">
            Here&apos;s just a few of the funded passes cleared using this
            same method.
          </p>
        </Reveal>
      </div>

      <Reveal
        stagger
        className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4"
      >
        {CERTIFICATES.map((cert) => (
          <div
            key={cert.src}
            className="relative aspect-square overflow-hidden rounded-lg border border-border bg-surface"
          >
            <Image
              src={cert.src}
              alt={cert.alt}
              fill
              sizes="(min-width: 1024px) 22vw, 45vw"
              className="object-cover"
            />
          </div>
        ))}
      </Reveal>
    </section>
  );
}
