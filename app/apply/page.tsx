import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ApplyHero } from "@/components/apply/ApplyHero";
import { MentorBio } from "@/components/apply/MentorBio";
import { MentorshipOverview } from "@/components/apply/MentorshipOverview";
import { CoveragePillars } from "@/components/apply/CoveragePillars";
import { ProcessSteps } from "@/components/apply/ProcessSteps";
import { ProofLink } from "@/components/apply/ProofLink";
import { ApplyForm } from "@/components/apply/ApplyForm";

export const metadata = {
  title: "1:1 Mentorship — Precision HQ",
  description:
    "Apply for Precision HQ's private 1:1 trading mentorship with Jack.",
};

export default function ApplyPage() {
  return (
    <>
      <Nav />
      <main>
        <ApplyHero />
        <MentorBio />
        <MentorshipOverview />
        <CoveragePillars />
        <ProcessSteps />
        <ProofLink />
        <ApplyForm />
      </main>
      <Footer />
    </>
  );
}
