import { Nav } from "@/components/Nav";
import { VideoHero } from "@/components/preview/VideoHero";
import { Problem } from "@/components/Problem";
import { Method } from "@/components/Method";
import { Indicator } from "@/components/Indicator";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";
import { ScrollNudge } from "@/components/ScrollNudge";

// Credibility (the funded account pass certificates) is disabled for now,
// per Jack's request — not deleted, just not rendered, so it's a one-line
// re-add later. Re-import and drop <Credibility /> back in below Method
// when he wants it back.

// Offers (the free/VIP/Elite pricing section) is disabled for now, per
// Jack's request - not deleted, just not rendered. The hero's "Get Free
// Trade Ideas" button is the only join-free CTA now.

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <VideoHero embedded />
        <Testimonials />
        <Problem />
        <Method />
        <Indicator />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <ScrollNudge />
    </>
  );
}
