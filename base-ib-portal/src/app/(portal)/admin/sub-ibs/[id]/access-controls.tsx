"use client";

import { useState, useTransition } from "react";
import { Alert, Button, Card } from "@/components/ui";
import type { PartnerStatus } from "@/lib/types";
import type { FormState } from "../../actions";

type Action = () => Promise<FormState>;

export function AccessControls({
  status,
  onToggleStatus,
  onSendReset,
  onDelete,
}: {
  status: PartnerStatus;
  onToggleStatus: Action;
  onSendReset: Action;
  onDelete: Action;
}) {
  const [result, setResult] = useState<FormState>({});
  const [pending, startTransition] = useTransition();

  const run = (action: Action, confirmText?: string) => {
    if (confirmText && !window.confirm(confirmText)) return;
    startTransition(async () => setResult(await action()));
  };

  return (
    <Card className="space-y-4">
      <h2 className="font-display text-xl font-bold tracking-wide uppercase">Access</h2>
      {result.error && <Alert>{result.error}</Alert>}
      {result.success && <Alert tone="ok">{result.success}</Alert>}

      <div className="space-y-2">
        <Button variant="secondary" className="w-full" disabled={pending} onClick={() => run(onSendReset)}>
          Send password reset
        </Button>
        <Button
          variant="secondary"
          className="w-full"
          disabled={pending}
          onClick={() =>
            run(
              onToggleStatus,
              status === "active"
                ? "Deactivate this partner? They will be signed out and unable to log in."
                : undefined,
            )
          }
        >
          {status === "active" ? "Deactivate" : "Reactivate"}
        </Button>
      </div>

      <div className="border-t border-line pt-4">
        <Button
          variant="danger"
          className="w-full"
          disabled={pending}
          onClick={() =>
            run(onDelete, "Permanently delete this partner and their login? This cannot be undone.")
          }
        >
          Delete partner
        </Button>
        <p className="mt-2 text-xs text-faint">Prefer deactivating — it keeps their history.</p>
      </div>
    </Card>
  );
}
