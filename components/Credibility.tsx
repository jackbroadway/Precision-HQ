import Image from "next/image";
import { Eyebrow } from "./ui/Eyebrow";
import { Reveal } from "./ui/Reveal";

const CERTIFICATES = [
  {
    src: "/credibility/ftmo-verification-1.jpg",
    alt: "FTMO Passed Verification certificate, 4 Dec 2025",
    width: 900,
    height: 902,
  },
  {
    src: "/credibility/ftmo-challenge-1.jpg",
    alt: "FTMO Passed Challenge certificate, 7 Oct 2025",
    width: 900,
    height: 900,
  },
  {
    src: "/credibility/ftmo-verification-2.jpg",
    alt: "FTMO Passed Verification certificate, 18 Nov 2025",
    width: 900,
    height: 900,
  },
  {
    src: "/credibility/ftmo-challenge-2.jpg",
    alt: "FTMO Passed Challenge certificate, 1 Nov 2025",
    width: 900,
    height: 900,
  },
  {
    src: "/credibility/ftmo-verification-3.jpg",
    alt: "FTMO Passed Verification certificate, 13 Oct 2025",
    width: 900,
    height: 900,
  },
  {
    src: "/credibility/ftmo-challenge-3.jpg",
    alt: "FTMO Passed Challenge certificate, 29 Nov 2025",
    width: 900,
    height: 842,
  },
];

const SLIDES = [...CERTIFICATES, ...CERTIFICATES];

export function Credibility() {
  return (
    <section id="credibility" className="section-y">
      <div className="container-px mx-auto max-w-2xl text-center">
        <Reveal>
          <Eyebrow>Proof It Works</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-4 text-h2 text-ink">Real Certificates</h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mt-4 font-body text-ink-muted">
            A few of the certificates cleared using this same method.
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.2} className="group mt-14 overflow-hidden">
        <div className="flex w-max animate-marquee gap-5 group-hover:[animation-play-state:paused]">
          {SLIDES.map((cert, i) => (
            <div
              key={`${cert.src}-${i}`}
              className="h-52 shrink-0 overflow-hidden rounded-lg border border-border bg-surface sm:h-64"
            >
              <Image
                src={cert.src}
                alt={cert.alt}
                width={cert.width}
                height={cert.height}
                className="h-full w-auto"
              />
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
