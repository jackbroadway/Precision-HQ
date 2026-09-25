import type { Metadata } from "next";
import Link from "next/link";
import { ConfirmButton } from "@/components/confirm-button";
import { AnnouncementCard } from "@/components/content-cards";
import { PageHeader } from "@/components/ui";
import { getAnnouncements } from "@/lib/content";
import { createAnnouncement, deleteAnnouncement, setAnnouncementPinned } from "../content-actions";
import { AnnouncementForm } from "./announcement-form";

export const metadata: Metadata = { title: "Announcements" };

const actionClass = "font-mono text-xs tracking-wider text-dim uppercase hover:text-accent";

export default async function AdminAnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <>
      <PageHeader eyebrow="Admin" title="Announcements" />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <section>
          <h2 className="mb-3 font-display text-xl font-bold tracking-wide uppercase">New announcement</h2>
          <AnnouncementForm action={createAnnouncement} submitLabel="Post to partners" />
        </section>
        <section>
          <h2 className="mb-3 font-display text-xl font-bold tracking-wide uppercase">
            Posted ({announcements.length})
          </h2>
          {announcements.length === 0 ? (
            <p className="text-dim">Nothing posted yet.</p>
          ) : (
            <div className="space-y-4">
              {announcements.map((a) => (
                <AnnouncementCard
                  key={a.id}
                  a={a}
                  actions={
                    <>
                      <form action={setAnnouncementPinned.bind(null, a.id, !a.pinned)}>
                        <button className={actionClass}>{a.pinned ? "Unpin" : "Pin"}</button>
                      </form>
                      <Link href={`/admin/announcements/${a.id}`} className={actionClass}>
                        Edit
                      </Link>
                      <form action={deleteAnnouncement.bind(null, a.id)}>
                        <ConfirmButton
                          message="Delete this announcement? Partners will no longer see it."
                          className="font-mono text-xs tracking-wider text-danger uppercase hover:underline"
                        >
                          Delete
                        </ConfirmButton>
                      </form>
                    </>
                  }
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
