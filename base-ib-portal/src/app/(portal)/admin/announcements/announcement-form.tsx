"use client";

import { useActionState } from "react";
import { Alert, Button, Card, Field, Input } from "@/components/ui";
import type { FormState } from "../actions";

export function AnnouncementForm({
  action,
  defaults,
  submitLabel,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  defaults?: { title: string; body: string; pinned: boolean };
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, {});
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction}>
      <Card className="space-y-4">
        {state.error && <Alert>{state.error}</Alert>}
        {state.success && <Alert tone="ok">{state.success}</Alert>}
        <Field label="Title" htmlFor="title" error={errors.title}>
          <Input id="title" name="title" required maxLength={200} defaultValue={defaults?.title} />
        </Field>
        <Field
          label="Message"
          htmlFor="body"
          hint="Line breaks are kept and links become clickable."
          error={errors.body}
        >
          <textarea
            id="body"
            name="body"
            required
            maxLength={5000}
            rows={6}
            defaultValue={defaults?.body}
            className="w-full rounded-sm border border-line bg-bg px-3 py-2 text-text placeholder:text-faint focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
          />
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="pinned"
            defaultChecked={defaults?.pinned}
            className="h-4 w-4 accent-[var(--accent)]"
          />
          Pin to the top of partners&apos; dashboards
        </label>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : submitLabel}
        </Button>
      </Card>
    </form>
  );
}
