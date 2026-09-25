import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Alert, Card, PageHeader, Stat, StatusBadge } from "@/components/ui";
import { ProgressBar } from "@/components/learning";
import { brokerLabel } from "@/lib/brokers";
import { getCompletedModules, moduleLabel, summarize } from "@/lib/learning";
import { createClient } from "@/lib/supabase/server";
import type { SubIbWithProfile } from "@/lib/types";
import { deleteSubIb, sendPasswordReset, setSubIbStatus, updateSubIb } from "../../actions";
import { AccessControls } from "./access-controls";
import { EditSubIbForm } from "./edit-sub-ib-form";

export const metadata: Metadata = { title: "Partner" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const CREATED_NOTICE: Record<string, string> = {
  invite: "Sub-IB created. An invite email has been sent so they can set their password.",
  password:
    "Sub-IB created. Share their email and temporary password — they'll be asked to change it on first sign-in.",
};

export default async function SubIbPage({ params, searchParams }: PageProps<"/admin/sub-ibs/[id]">) {
  const { id } = await params;
  const { created } = await searchParams;
  if (!UUID.test(id)) notFound();

  const supabase = await createClient();
  const { data: p } = await supabase
    .from("sub_ibs")
    .select("*, profile:profiles!sub_ibs_user_id_fkey(email, full_name)")
    .eq("id", id)
    .maybeSingle<SubIbWithProfile>();
  if (!p) notFound();
  const training = summarize(await getCompletedModules(p.user_id));

  const nextStatus = p.status === "active" ? "inactive" : "active";
  const notice = typeof created === "string" ? CREATED_NOTICE[created] : undefined;

  return (
    <>
      <p className="mb-2 font-mono text-xs tracking-wider uppercase">
        <Link href="/admin" className="text-dim hover:text-accent">
          ← All partners
        </Link>
      </p>
      <PageHeader
        eyebrow={`${brokerLabel(p.broker)} · ${p.ib_account_id}`}
        title={p.profile?.full_name ?? p.profile?.email ?? "Partner"}
        actions={<StatusBadge status={p.status} />}
      />

      {notice && (
        <div className="mb-6">
          <Alert tone="ok">{notice}</Alert>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <EditSubIbForm
            action={updateSubIb.bind(null, p.id)}
            defaults={{
              full_name: p.profile?.full_name ?? null,
              broker: p.broker,
              ib_account_id: p.ib_account_id,
              rate_per_lot: Number(p.rate_per_lot),
            }}
          />
        </div>
        <div className="space-y-6">
          <Card>
            <dl className="space-y-4">
              <Stat label="Login email" value={p.profile?.email ?? "—"} />
              <Stat label="Added" value={new Date(p.created_at).toLocaleDateString("en-GB")} />
              <Stat label="Last updated" value={new Date(p.updated_at).toLocaleDateString("en-GB")} />
            </dl>
          </Card>
          <Card>
            <h2 className="mb-3 font-display text-xl font-bold tracking-wide uppercase">Training</h2>
            <div className="mb-1.5 flex justify-between font-mono text-xs tracking-wider text-dim uppercase">
              <span>
                {training.done} of {training.total} modules
              </span>
              <span>{training.percent}%</span>
            </div>
            <ProgressBar percent={training.percent} />
            <p className="mt-3 text-sm text-dim">
              {training.finished
                ? "Completed the Base IB Playbook."
                : `Next up: ${moduleLabel(training.next!.number)}, ${training.next!.title}`}
            </p>
          </Card>
          <AccessControls
            status={p.status}
            onToggleStatus={setSubIbStatus.bind(null, p.id, nextStatus)}
            onSendReset={sendPasswordReset.bind(null, p.id)}
            onDelete={deleteSubIb.bind(null, p.id)}
          />
        </div>
      </div>
    </>
  );
}
