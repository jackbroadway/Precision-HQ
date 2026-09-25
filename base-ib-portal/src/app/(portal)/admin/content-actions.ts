"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { ASSET_BUCKET, isAssetCategory } from "@/lib/content";
import { createClient } from "@/lib/supabase/server";
import type { FormState } from "./actions";

function refresh() {
  revalidatePath("/", "layout");
}

// ---------------------------------------------------------------------------
// Announcements
// ---------------------------------------------------------------------------

function parseAnnouncement(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const pinned = formData.get("pinned") === "on";
  const fieldErrors: Record<string, string> = {};
  if (!title) fieldErrors.title = "Add a title.";
  else if (title.length > 200) fieldErrors.title = "Keep the title under 200 characters.";
  if (!body) fieldErrors.body = "Write the announcement.";
  else if (body.length > 5000) fieldErrors.body = "Keep it under 5,000 characters.";
  return { title, body, pinned, fieldErrors };
}

export async function createAnnouncement(_prev: FormState, formData: FormData): Promise<FormState> {
  const { user } = await requireAdmin();
  const { title, body, pinned, fieldErrors } = parseAnnouncement(formData);
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const supabase = await createClient();
  const { error } = await supabase
    .from("announcements")
    .insert({ title, body, pinned, created_by: user.id });
  if (error) return { error: `Couldn't post: ${error.message}` };

  refresh();
  return { success: "Announcement posted. Partners will see it on their dashboard." };
}

export async function updateAnnouncement(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const { title, body, pinned, fieldErrors } = parseAnnouncement(formData);
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const supabase = await createClient();
  const { error } = await supabase.from("announcements").update({ title, body, pinned }).eq("id", id);
  if (error) return { error: `Couldn't save: ${error.message}` };

  refresh();
  redirect("/admin/announcements");
}

export async function setAnnouncementPinned(id: string, pinned: boolean) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("announcements").update({ pinned }).eq("id", id);
  if (error) throw new Error(error.message);
  refresh();
}

export async function deleteAnnouncement(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("announcements").delete().eq("id", id);
  if (error) throw new Error(error.message);
  refresh();
}

// ---------------------------------------------------------------------------
// Marketing assets
// The image is uploaded from the browser straight to Storage; this action
// receives only its path and saves the record.
// ---------------------------------------------------------------------------

const IMAGE_PATH = /^[0-9a-f-]{36}\.(png|jpg|jpeg|webp|gif)$/;

export async function createAsset(_prev: FormState, formData: FormData): Promise<FormState> {
  const { user } = await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const caption = String(formData.get("caption") ?? "").trim() || null;
  const imagePath = String(formData.get("image_path") ?? "") || null;
  const category = formData.get("category");

  const fieldErrors: Record<string, string> = {};
  if (!title) fieldErrors.title = "Add a title.";
  else if (title.length > 200) fieldErrors.title = "Keep the title under 200 characters.";
  if (!isAssetCategory(category)) fieldErrors.category = "Choose where it's for.";
  if (caption && caption.length > 5000) fieldErrors.caption = "Keep it under 5,000 characters.";
  if (imagePath && !IMAGE_PATH.test(imagePath)) fieldErrors.image = "Upload failed, try again.";
  if (!caption && !imagePath) fieldErrors.caption = "Add an image, a caption, or both.";

  const supabase = await createClient();
  const cleanUp = () => imagePath && supabase.storage.from(ASSET_BUCKET).remove([imagePath]);

  if (Object.keys(fieldErrors).length) {
    await cleanUp();
    return { fieldErrors };
  }

  const { error } = await supabase.from("marketing_assets").insert({
    title,
    caption,
    image_path: imagePath,
    category: category as string,
    created_by: user.id,
  });
  if (error) {
    await cleanUp();
    return { error: `Couldn't save: ${error.message}` };
  }

  refresh();
  return { success: "Asset added. Partners can now copy and download it." };
}

export async function deleteAsset(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("marketing_assets")
    .delete()
    .eq("id", id)
    .select("image_path")
    .single();
  if (error) throw new Error(error.message);
  if (data?.image_path) await supabase.storage.from(ASSET_BUCKET).remove([data.image_path]);
  refresh();
}
