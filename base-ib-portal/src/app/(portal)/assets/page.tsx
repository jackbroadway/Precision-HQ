import type { Metadata } from "next";
import Link from "next/link";
import { AssetCard } from "@/components/content-cards";
import { PageHeader } from "@/components/ui";
import { ASSET_CATEGORIES, getAssets, isAssetCategory } from "@/lib/content";

export const metadata: Metadata = { title: "Marketing assets" };

export default async function AssetsPage({ searchParams }: PageProps<"/assets">) {
  const { c } = await searchParams;
  const category = isAssetCategory(c) ? c : undefined;
  const assets = await getAssets({ category });

  const tab = (href: string, label: string, active: boolean) => (
    <Link
      key={href}
      href={href}
      className={`rounded-sm border px-3 py-1.5 font-mono text-xs tracking-wider uppercase ${
        active ? "border-accent bg-accent-soft text-accent" : "border-line text-dim hover:border-accent"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <>
      <PageHeader eyebrow="Ready to post" title="Marketing assets" />
      <p className="-mt-3 mb-6 max-w-2xl text-dim">
        Download the image, copy the caption, post it. Add your own referral link before you share.
      </p>
      <nav className="mb-6 flex flex-wrap gap-2">
        {tab("/assets", "All", !category)}
        {ASSET_CATEGORIES.map((cat) => tab(`/assets?c=${cat.value}`, cat.label, category === cat.value))}
      </nav>
      {assets.length === 0 ? (
        <p className="text-dim">Nothing here yet. Check back soon.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {assets.map((a) => (
            <AssetCard key={a.id} asset={a} />
          ))}
        </div>
      )}
    </>
  );
}
