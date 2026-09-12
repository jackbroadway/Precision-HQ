import Image from "next/image";
import { Eyebrow } from "../ui/Eyebrow";
import { Reveal } from "../ui/Reveal";

export function MentorBio() {
  return (
    <section id="jack" className="section-y container-px">
      <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[380px_1fr] lg:gap-16">
        <Reveal className="relative aspect-[4/5] overflow-hidden rounded-lg border border-border">
          <Image
            src="/apply/jack-photo.jpg"
            alt="Jack, founder of Precision HQ"
            fill
            sizes="(min-width: 1024px) 380px, 90vw"
            className="object-cover object-[center_38%]"
          />
        </Reveal>

        <div>
          <Reveal>
            <Eyebrow>Your Mentor</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-4 text-h2 text-ink">Meet Jack</h2>
          </Reveal>
          <Reveal
            delay={0.14}
            stagger
            className="mt-6 flex flex-col gap-4 font-body text-ink-muted"
          >
            <p>
              I&rsquo;m Jack, founder of{" "}
              <strong className="text-gold">Precision HQ</strong>. I built
              this brand around one principle: precision, discipline, and
              consistency are what separate traders who survive the markets
              from traders who don&rsquo;t.
            </p>
            <p>
              I lead a community of{" "}
              <strong className="text-gold">200 plus active traders</strong>,
              providing professional trade ideas, education, mentorship and
              live market insight every day. Everything I share is backed by
              real execution. I trade what I teach, and I teach what I trade.
            </p>
            <p>
              Beyond the charts, I&rsquo;m also building a life around the
              freedom that disciplined trading creates. Precision HQ is more
              than trade ideas. It&rsquo;s focused on building profitable
              traders, developing winning mindsets, and creating a high
              performance trading lifestyle.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
