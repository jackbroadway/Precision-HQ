import { Nav } from "@/components/Nav";
import { VideoHero } from "@/components/preview/VideoHero";
import { Problem } from "@/components/Problem";
import { Method } from "@/components/Method";
import { Credibility } from "@/components/Credibility";
import { Indicator } from "@/components/Indicator";
import { Offers } from "@/components/Offers";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <VideoHero embedded />
        <Problem />
        <Method />
        <Credibility />
        <Offers />
        <Indicator />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
