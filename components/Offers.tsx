import { Button } from "./ui/Button";
import { Eyebrow } from "./ui/Eyebrow";
import { Reveal } from "./ui/Reveal";
import { links } from "@/lib/config";

/**
 * VIP/Elite used to be shown here as priced tiers, then as a free card
 * plus a "message us" teaser. Per Jack, this is now stripped down to just
 * the heading and the join button - no pricing card, no VIP/Elite mention
 * at all on-site.
 */
export function Offers() {
  return (
    <section id="offers" className="section-y container-px">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <Eyebrow>Start Here</Eyebrow>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="mt-4 text-h2 text-ink">Free Trade Ideas, No Catch</h2>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mt-4 font-body text-ink-muted">
            Join the free channel first and see the method for yourself.
          </p>
        </Reveal>
        <Reveal delay={0.2} className="mt-8">
          <Button href={links.startFreeHere} variant="primary">
            Join Free
          </Button>
        </Reveal>
      </div>

      <Reveal delay={0.26} className="mx-auto mt-8 max-w-5xl text-center">
        <p className="font-mono text-xs text-ink-faint">
          Want to go 1:1 with Jack instead?{" "}
          <a
            href={links.mentorshipApplication}
            className="text-gold hover:underline"
          >
            View &amp; apply for mentorship
          </a>
        </p>
      </Reveal>
    </section>
  );
}
