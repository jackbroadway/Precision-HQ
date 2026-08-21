import { Button } from "./ui/Button";
import { Eyebrow } from "./ui/Eyebrow";
import { FeaturedVideoCard } from "./ui/FeaturedVideoCard";
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

const TESTIMONIALS = [...TESTIMONIALS_BASE, ...TESTIMONIALS_BASE];

const MEMBER_VIDEOS: {
  src: string;
  poster: string;
  posterPosition?: "center" | "top";
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

      <Reveal delay={0.2} className="group mt-10 overflow-hidden">
        <div className="flex w-max animate-marquee-slow gap-6 group-hover:[animation-play-state:paused]">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={`${t.name}-${t.role}-${i}`}
              className="flex w-80 shrink-0 flex-col justify-between rounded-lg border border-border bg-surface p-7 sm:w-96"
            >
              <p className="font-body text-sm leading-relaxed text-ink-muted">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 border-t border-border pt-4">
                <p className="font-heading text-sm uppercase tracking-wide text-ink">
                  {t.name}
                </p>
                <p className="font-mono text-xs text-ink-faint">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.26} className="container-px mx-auto mt-12 text-center">
        <Button href={links.dailyResults} variant="secondary">
          Track Members&rsquo; Daily Results
        </Button>
      </Reveal>
    </section>
  );
}
