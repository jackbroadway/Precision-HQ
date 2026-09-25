"use client";

import { useActionState } from "react";
import { Alert, Button, Card } from "@/components/ui";
import type { Broker } from "@/lib/types";
import type { FormState } from "../../actions";
import { PartnerFields } from "../partner-fields";

export function EditSubIbForm({
  action,
  defaults,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  defaults: { full_name: string | null; broker: Broker; ib_account_id: string; rate_per_lot: number };
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, {});

  return (
    <form action={formAction}>
      <Card className="space-y-4">
        <h2 className="font-display text-xl font-bold tracking-wide uppercase">Partner details</h2>
        {state.error && <Alert>{state.error}</Alert>}
        {state.success && <Alert tone="ok">{state.success}</Alert>}
        <PartnerFields defaults={defaults} errors={state.fieldErrors} />
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </Button>
      </Card>
    </form>
  );
}
