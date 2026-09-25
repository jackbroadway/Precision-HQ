import type { ReactNode } from "react";
import { categoryLabel, type AssetWithUrls } from "@/lib/content";
import type { Announcement } from "@/lib/types";
import { CopyButton } from "./copy-button";
import { LinkifiedText } from "./linkified-text";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export function AnnouncementCard({ a, actions }: { a: Announcement; actions?: ReactNode }) {
  return (
    <article
      className={`rounded-sm border bg-surface p-5 ${a.pinned ? "border-accent" : "border-line"}`}
    >
      <div className="mb-1 flex flex-wrap items-center gap-2 font-mono text-[11px] tracking-wider text-faint uppercase">
        {a.pinned && (
          <span className="rounded-sm bg-accent-soft px-1.5 py-0.5 text-accent">📌 Pinned</span>
        )}
        <time dateTime={a.created_at}>{formatDate(a.created_at)}</time>
      </div>
      <h3 className="font-display text-xl font-bold tracking-wide uppercase">{a.title}</h3>
      <LinkifiedText text={a.body} className="mt-2 leading-relaxed text-dim" />
      {actions && <div className="mt-4 flex flex-wrap gap-3 border-t border-line pt-3">{actions}</div>}
    </article>
  );
}

export function AssetCard({ asset, actions }: { asset: AssetWithUrls; actions?: ReactNode }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-sm border border-line bg-surface">
      {asset.imageUrl && (
        <a href={asset.imageUrl} target="_blank" rel="noopener noreferrer" className="block bg-surface-2">
          {/* User-uploaded images from Supabase Storage; plain <img> keeps it simple. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={asset.imageUrl}
            alt={asset.title}
            loading="lazy"
            className="aspect-square w-full object-cover"
          />
        </a>
      )}
      <div className="flex flex-1 flex-col p-4">
        <p className="font-mono text-[11px] tracking-wider text-faint uppercase">
          {categoryLabel(asset.category)}
        </p>
        <h3 className="font-semibold">{asset.title}</h3>
        {asset.caption && (
          <p className="mt-2 line-clamp-4 text-sm whitespace-pre-line text-dim">{asset.caption}</p>
        )}
        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          {asset.caption && <CopyButton text={asset.caption} />}
          {asset.downloadUrl && (
            <a
              href={asset.downloadUrl}
              className="inline-flex items-center justify-center rounded-sm border border-line bg-surface-2 px-3 py-2 font-mono text-xs font-semibold tracking-wide uppercase hover:border-accent"
            >
              ↓ Download
            </a>
          )}
          {actions}
        </div>
      </div>
    </article>
  );
}
