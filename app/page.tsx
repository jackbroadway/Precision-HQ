import { Nav } from "@/components/Nav";
import { VideoHero } from "@/components/preview/VideoHero";
import { Problem } from "@/components/Problem";
import { Method } from "@/components/Method";
import { Indicator } from "@/components/Indicator";
import { Offers } from "@/components/Offers";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";

// Credibility (the funded account pass certificates) is disabled for now,
// per Jack's request — not deleted, just not rendered, so it's a one-line
// re-add later. Re-import and drop <Credibility /> back in below Method
// when he wants it back.

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <VideoHero embedded />
        <Testimonials />
        <Offers />
        <Problem />
        <Method />
        <Indicator />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
