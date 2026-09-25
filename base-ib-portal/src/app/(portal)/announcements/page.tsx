import type { Metadata } from "next";
import { AnnouncementCard } from "@/components/content-cards";
import { PageHeader } from "@/components/ui";
import { getAnnouncements } from "@/lib/content";

export const metadata: Metadata = { title: "Announcements" };

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <div className="max-w-3xl">
      <PageHeader eyebrow="Base.IB" title="Announcements" />
      {announcements.length === 0 ? (
        <p className="text-dim">No announcements yet.</p>
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <AnnouncementCard key={a.id} a={a} />
          ))}
        </div>
      )}
    </div>
  );
}
