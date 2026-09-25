import type { Metadata } from "next";
import { ConfirmButton } from "@/components/confirm-button";
import { AssetCard } from "@/components/content-cards";
import { PageHeader } from "@/components/ui";
import { ASSET_CATEGORIES, getAssets } from "@/lib/content";
import { deleteAsset } from "../content-actions";
import { AssetForm } from "./asset-form";

export const metadata: Metadata = { title: "Marketing assets" };

export default async function AdminAssetsPage() {
  const assets = await getAssets();

  return (
    <>
      <PageHeader eyebrow="Admin" title="Marketing assets" />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <section>
          <h2 className="mb-3 font-display text-xl font-bold tracking-wide uppercase">Add asset</h2>
          <AssetForm categories={ASSET_CATEGORIES} />
        </section>
        <section>
          <h2 className="mb-3 font-display text-xl font-bold tracking-wide uppercase">
            Library ({assets.length})
          </h2>
          {assets.length === 0 ? (
            <p className="text-dim">No assets yet. Add your first image or caption.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {assets.map((a) => (
                <AssetCard
                  key={a.id}
                  asset={a}
                  actions={
                    <form action={deleteAsset.bind(null, a.id)}>
                      <ConfirmButton
                        message="Delete this asset? The image will be removed for all partners."
                        className="inline-flex items-center rounded-sm border border-danger bg-danger-soft px-3 py-2 font-mono text-xs font-semibold tracking-wide text-danger uppercase"
                      >
                        Delete
                      </ConfirmButton>
                    </form>
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
