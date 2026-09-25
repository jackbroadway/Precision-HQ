import "server-only";
import { createClient } from "./supabase/server";
import type { Announcement, AssetCategory, MarketingAsset } from "./types";

export const ASSET_BUCKET = "marketing";

export const ASSET_CATEGORIES: { value: AssetCategory; label: string }[] = [
  { value: "post", label: "Feed post" },
  { value: "story", label: "Story" },
  { value: "telegram", label: "Telegram" },
  { value: "general", label: "General" },
];

export const isAssetCategory = (v: unknown): v is AssetCategory =>
  ASSET_CATEGORIES.some((c) => c.value === v);

export const categoryLabel = (c: AssetCategory) =>
  ASSET_CATEGORIES.find((x) => x.value === c)?.label ?? c;

/** Pinned first, then newest. */
export async function getAnnouncements(limit?: number) {
  const supabase = await createClient();
  let query = supabase
    .from("announcements")
    .select("id, title, body, pinned, created_at, updated_at")
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data } = await query.returns<Announcement[]>();
  return data ?? [];
}

export type AssetWithUrls = MarketingAsset & { imageUrl: string | null; downloadUrl: string | null };

/** Newest first, with public view + download URLs for the image. */
export async function getAssets(opts: { limit?: number; category?: AssetCategory } = {}) {
  const supabase = await createClient();
  let query = supabase
    .from("marketing_assets")
    .select("id, title, caption, image_path, category, created_at")
    .order("created_at", { ascending: false });
  if (opts.category) query = query.eq("category", opts.category);
  if (opts.limit) query = query.limit(opts.limit);
  const { data } = await query.returns<MarketingAsset[]>();

  const bucket = supabase.storage.from(ASSET_BUCKET);
  return (data ?? []).map<AssetWithUrls>((a) => ({
    ...a,
    imageUrl: a.image_path ? bucket.getPublicUrl(a.image_path).data.publicUrl : null,
    downloadUrl: a.image_path
      ? bucket.getPublicUrl(a.image_path, { download: `${slug(a.title)}${ext(a.image_path)}` }).data
          .publicUrl
      : null,
  }));
}

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "base-ib";
const ext = (path: string) => path.slice(path.lastIndexOf("."));
