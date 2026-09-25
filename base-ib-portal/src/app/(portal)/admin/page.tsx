import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink, Card, PageHeader, StatusBadge } from "@/components/ui";
import { BROKERS, brokerLabel, formatRate } from "@/lib/brokers";
import { createClient } from "@/lib/supabase/server";
import type { SubIbWithProfile } from "@/lib/types";

export const metadata: Metadata = { title: "Partners" };

export default async function AdminPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sub_ibs")
    .select("*, profile:profiles!sub_ibs_user_id_fkey(email, full_name)")
    .order("created_at", { ascending: false })
    .returns<SubIbWithProfile[]>();

  const partners = data ?? [];
  const active = partners.filter((p) => p.status === "active").length;

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Sub-IB partners"
        actions={<ButtonLink href="/admin/sub-ibs/new">+ Add sub-IB</ButtonLink>}
      />

      <dl className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <SummaryCard label="Total partners" value={partners.length} />
        <SummaryCard label="Active" value={active} />
        {BROKERS.map((b) => (
          <SummaryCard
            key={b.value}
            label={b.label}
            value={partners.filter((p) => p.broker === b.value).length}
          />
        ))}
      </dl>

      <div className="overflow-hidden rounded-sm border border-line bg-surface shadow-sm">
        {error ? (
          <p className="p-6 text-danger">Couldn&apos;t load partners: {error.message}</p>
        ) : partners.length === 0 ? (
          <div className="p-10 text-center">
            <p className="mb-4 text-dim">No sub-IBs yet.</p>
            <ButtonLink href="/admin/sub-ibs/new">Add your first sub-IB</ButtonLink>
          </div>
        ) : (
          <>
          <ul className="divide-y divide-line md:hidden">
            {partners.map((p) => (
              <li key={p.id}>
                <Link href={`/admin/sub-ibs/${p.id}`} className="block px-4 py-4 hover:bg-surface-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{p.profile?.full_name ?? "—"}</p>
                      <p className="truncate text-xs text-faint">{p.profile?.email}</p>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                  <div className="mt-2 flex items-center justify-between font-mono text-sm">
                    <span className="text-dim">
                      {brokerLabel(p.broker)} · {p.ib_account_id}
                    </span>
                    <span className="text-accent">{formatRate(Number(p.rate_per_lot))}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-line bg-surface-2 font-mono text-xs tracking-wider text-faint uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Partner</th>
                  <th className="px-4 py-3 font-medium">Broker</th>
                  <th className="px-4 py-3 font-medium">IB account</th>
                  <th className="px-4 py-3 text-right font-medium">$/lot</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {partners.map((p) => (
                  <tr key={p.id} className="border-b border-line last:border-0 hover:bg-surface-2">
                    <td className="px-4 py-3">
                      <Link href={`/admin/sub-ibs/${p.id}`} className="font-semibold hover:text-accent">
                        {p.profile?.full_name ?? "—"}
                      </Link>
                      <div className="text-xs text-faint">{p.profile?.email}</div>
                    </td>
                    <td className="px-4 py-3">{brokerLabel(p.broker)}</td>
                    <td className="px-4 py-3 font-mono">{p.ib_account_id}</td>
                    <td className="px-4 py-3 text-right font-mono">{formatRate(Number(p.rate_per_lot))}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={p.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </>
        )}
      </div>
    </>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <Card className="p-4">
      <dt className="font-mono text-xs tracking-wider text-faint uppercase">{label}</dt>
      <dd className="mt-1 font-display text-3xl font-bold">{value}</dd>
    </Card>
  );
}
