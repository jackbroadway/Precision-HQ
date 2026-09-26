import { Button } from "./ui/Button";
import { Eyebrow } from "./ui/Eyebrow";
import { FeaturedVideoCard } from "./ui/FeaturedVideoCard";
import { LiveProfitScroller } from "./LiveProfitScroller";
import { Reveal } from "./ui/Reveal";
import { links } from "@/lib/config";

/**
 * Real member testimonials, lightly copyedited for typos and punctuation
 * only. Old "Broad FX" brand references are swapped to Precision HQ.
 * Content that named an unconfirmed product (VIP copy trading) or
 * included specific account figures/screenshots was trimmed, per an
 * explicit decision on each one rather than a blanket rule.
 */
const TESTIMONIALS_BASE = [
  {
    quote:
      "This community has been super welcoming since the day I joined. JB has taught me so much in a short amount of time, from understanding market structure to building more confidence in my trades. What's crazy is I haven't even bought the full course yet, and I'm already seeing steady progress. The amount of value and knowledge shared here is unreal. I'd definitely recommend learning here if you have the time, it's 100% worth it.",
    name: "Coop",
    role: "Community Member",
  },
  {
    quote:
      "Honestly one of the best trading communities I've been a part of. Education is on point, the trade ideas in the VIP show great results, and the community is very supportive. I've learned a lot and seen real progress. Great bunch of lads.",
    name: "Shane",
    role: "Community Trader",
  },
  {
    quote:
      "Having people like you lot in my corner means more than I can explain. You're helping me believe there's a way forward, and learning about trading has given me something to focus on and work towards.",
    name: "Dan",
    role: "Community Member",
  },
  {
    quote:
      "I joined Precision HQ a few months back and honestly the results blew me away. Watching the trades come through and hit TP consistently opened my eyes to a whole different way of looking at the markets. I was that impressed I invested in the 1 to 1 Mentorship and it has been a proper game changer. Cannot thank JB enough, the knowledge he's passed on hasn't just changed my trading, it's on the way to changing my life.",
    name: "Dan",
    role: "Mentorship Client",
  },
  {
    quote:
      "I've only known JB for two weeks and he has guided me to extraordinary heights in my trading journey. After more blown accounts, I now have discipline, all thanks to him. I understand and study the market, before I was just reckless.",
    name: "TMG",
    role: "Community Member",
  },
  {
    quote:
      "I have been in Precision HQ for a month now and the results are insane. The strategy is on point, the limits are on point, and all I can say is hats off to JB for the amazing work behind it. I value education a lot and in this community I found it. Still learning and being consistent, and most importantly, getting risk management on point.",
    name: "Adam Khoo",
    role: "Community Member",
  },
];

function Stars() {
  return (
    <div className="flex gap-1 text-gold" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
          <path d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.2 6.1-.7z" />
        </svg>
      ))}
    </div>
  );
}

const MEMBER_VIDEOS: {
  src: string;
  poster: string;
  posterPosition?: string;
}[] = [
  {
    src: "/video/member-testimonial.mp4",
    poster: "/video/member-testimonial-poster.jpg",
  },
  {
    src: "/video/member-testimonial-3.mp4",
    poster: "/video/member-testimonial-3-poster.jpg",
    posterPosition: "top",
  },
  {
    src: "/video/member-testimonial-2.mp4",
    poster: "/video/member-testimonial-2-poster.jpg",
  },
  {
    src: "/video/member-testimonial-4.mp4",
    poster: "/video/member-testimonial-4-poster.jpg",
    posterPosition: "center 32%",
  },
];

export function Testimonials() {
  return (
    <section id="results" className="section-y">
      <div className="container-px mx-auto max-w-2xl text-center">
        <Reveal>
          <Eyebrow>Results</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-4 text-h2 text-ink">What Members Say</h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mt-4 font-body text-ink-muted">
            Real messages from the Precision HQ community.
          </p>
        </Reveal>
      </div>

      <Reveal
        stagger
        className="container-px mx-auto mt-10 flex flex-wrap justify-center gap-6"
      >
        {MEMBER_VIDEOS.map((video) => (
          <FeaturedVideoCard
            key={video.src}
            src={video.src}
            poster={video.poster}
            posterPosition={video.posterPosition}
          />
        ))}
      </Reveal>

      <LiveProfitScroller />

      <Reveal delay={0.18} className="mt-14 text-center">
        <p className="font-heading text-sm uppercase tracking-[0.15em] text-gold">
          Real Members. Real Results.
        </p>
      </Reveal>

      <Reveal
        stagger
        className="container-px mx-auto mt-6 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {TESTIMONIALS_BASE.map((t) => (
          <div
            key={`${t.name}-${t.role}`}
            className="flex flex-col rounded-2xl border border-border bg-surface p-6"
          >
            <Stars />
            <p className="mt-4 font-body text-sm leading-relaxed text-ink">
              &ldquo;{t.quote}&rdquo;
            </p>
            <p className="mt-4 font-heading text-sm text-ink">{t.name}</p>
          </div>
        ))}
      </Reveal>

      <Reveal delay={0.26} className="container-px mx-auto mt-12 text-center">
        <Button href={links.dailyResults} variant="secondary">
          Track Members&rsquo; Daily Results
        </Button>
      </Reveal>
    </section>
  );
}
