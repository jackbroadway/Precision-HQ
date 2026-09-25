import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";
import type { Announcement } from "@/lib/types";
import { updateAnnouncement } from "../../content-actions";
import { AnnouncementForm } from "../announcement-form";

export const metadata: Metadata = { title: "Edit announcement" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function EditAnnouncementPage({ params }: PageProps<"/admin/announcements/[id]">) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const supabase = await createClient();
  const { data: a } = await supabase
    .from("announcements")
    .select("id, title, body, pinned, created_at, updated_at")
    .eq("id", id)
    .maybeSingle<Announcement>();
  if (!a) notFound();

  return (
    <div className="max-w-2xl">
      <p className="mb-2 font-mono text-xs tracking-wider uppercase">
        <Link href="/admin/announcements" className="text-dim hover:text-accent">
          ← All announcements
        </Link>
      </p>
      <PageHeader eyebrow="Admin · Announcements" title="Edit announcement" />
      <AnnouncementForm
        action={updateAnnouncement.bind(null, a.id)}
        defaults={{ title: a.title, body: a.body, pinned: a.pinned }}
        submitLabel="Save changes"
      />
    </div>
  );
}
