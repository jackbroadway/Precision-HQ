import Image from "next/image";
import { Eyebrow } from "./ui/Eyebrow";
import { Reveal } from "./ui/Reveal";

type Cert = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

const CERTIFICATES: Cert[] = [
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

const MEMBER_CERTIFICATES: Cert[] = [
  {
    src: "/credibility/members/shane-l-alpha-capital-phase2-1.jpg",
    alt: "Alpha Capital Group Phase 2 certificate, member Shane L.",
    width: 900,
    height: 680,
  },
  {
    src: "/credibility/members/charles-w-ftuk-funding-50k.jpg",
    alt: "FTUK Certificate of Funding, $50,000, member Charles W.",
    width: 900,
    height: 900,
  },
  {
    src: "/credibility/members/hameed-n-alpha-capital-phase1.jpg",
    alt: "Alpha Capital Group Phase 1 certificate, member Hameed N.",
    width: 900,
    height: 680,
  },
  {
    src: "/credibility/members/cooper-w-fortraders-challenge.jpg",
    alt: "For Traders Challenge pass, member Cooper W.",
    width: 900,
    height: 901,
  },
  {
    src: "/credibility/members/jordan-h-alpha-capital-phase1.jpg",
    alt: "Alpha Capital Group Phase 1 certificate, member Jordan H.",
    width: 900,
    height: 680,
  },
  {
    src: "/credibility/members/charles-w-ftuk-funding-100k.jpg",
    alt: "FTUK Certificate of Funding, $100,000, member Charles W.",
    width: 590,
    height: 574,
  },
  {
    src: "/credibility/members/shane-l-alpha-capital-phase2-2.jpg",
    alt: "Alpha Capital Group Phase 2 certificate, member Shane L.",
    width: 900,
    height: 680,
  },
];

const SLIDES = [...CERTIFICATES, ...CERTIFICATES];
const MEMBER_SLIDES = [...MEMBER_CERTIFICATES, ...MEMBER_CERTIFICATES];

function CertRow({
  certs,
  reverse = false,
}: {
  certs: Cert[];
  reverse?: boolean;
}) {
  return (
    <div className="group mt-14 overflow-hidden">
      <div
        className={`flex w-max gap-5 group-hover:[animation-play-state:paused] ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        }`}
      >
        {certs.map((cert, i) => (
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
    </div>
  );
}

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

      <Reveal delay={0.2}>
        <CertRow certs={SLIDES} />
      </Reveal>

      <div className="container-px mx-auto mt-16 max-w-2xl text-center">
        <Reveal>
          <h3 className="font-heading text-lg uppercase tracking-wide text-ink">
            And So Do Our Members
          </h3>
        </Reveal>
      </div>

      <Reveal delay={0.08}>
        <CertRow certs={MEMBER_SLIDES} reverse />
      </Reveal>
    </section>
  );
}
