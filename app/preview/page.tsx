import type { Metadata } from "next";
import { VideoHero } from "@/components/preview/VideoHero";

export const metadata: Metadata = {
  title: "Precision HQ | Hero Preview",
  robots: { index: false, follow: false },
};

/**
 * Isolated preview of an alternate video-hero pattern. Not linked from
 * the real site and excluded from indexing. Safe to delete once reviewed,
 * or promote VideoHero into the real homepage if it's a keeper.
 */
export default function PreviewPage() {
  return <VideoHero />;
}
