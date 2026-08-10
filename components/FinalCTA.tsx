import { Button } from "./ui/Button";
import { Reveal } from "./ui/Reveal";
import { links } from "@/lib/config";

export function FinalCTA() {
  return (
    <section className="container-px pb-24 pt-8 sm:pb-32">
      <Reveal className="relative overflow-hidden rounded-lg border border-border-strong bg-surface px-6 py-16 text-center sm:px-16">
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[600px] -translate-x-1/2 rounded-full bg-gold opacity-[0.1] blur-[140px]"
          aria-hidden="true"
        />
        <div className="relative">
          <h2 className="text-h2 text-ink">
            Learn The Method.
            <br />
            <span className="text-gold">Stop Waiting On A Call.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md font-body text-ink-muted">
            Join the free community to see how we think, or apply for
            mentorship if you are ready to go through it directly with Jack.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Button href={links.telegramCommunity} variant="primary">
              Join Community
            </Button>
            <Button href={links.mentorshipApplication} variant="secondary">
              Apply For Mentorship
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
