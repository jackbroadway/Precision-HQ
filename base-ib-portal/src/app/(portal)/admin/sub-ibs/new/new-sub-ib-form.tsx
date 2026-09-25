"use client";

import { useActionState, useState } from "react";
import { Alert, Button, ButtonLink, Card, Field, Input } from "@/components/ui";
import { createSubIb, type FormState } from "../../actions";
import { PartnerFields } from "../partner-fields";

export function NewSubIbForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(createSubIb, {});
  const [mode, setMode] = useState<"invite" | "password">("invite");
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction}>
      <Card className="space-y-4">
        {state.error && <Alert>{state.error}</Alert>}
        <PartnerFields errors={errors} />
        <Field label="Email (login)" htmlFor="email" error={errors.email}>
          <Input id="email" name="email" type="email" autoComplete="off" required />
        </Field>

        <fieldset className="space-y-2 rounded-sm border border-line p-4">
          <legend className="px-1 font-mono text-xs tracking-wider text-dim uppercase">
            How will they get access?
          </legend>
          <AccessOption
            checked={mode === "invite"}
            onChange={() => setMode("invite")}
            value="invite"
            title="Send email invite"
            description="They get an email link to set their own password. Requires custom SMTP in Supabase."
          />
          <AccessOption
            checked={mode === "password"}
            onChange={() => setMode("password")}
            value="password"
            title="Set a temporary password"
            description="You share it with them; they must change it on first sign-in."
          />
          {mode === "password" && (
            <div className="pt-2">
              <Field label="Temporary password" htmlFor="temp_password" error={errors.temp_password}>
                <Input
                  id="temp_password"
                  name="temp_password"
                  type="text"
                  autoComplete="off"
                  minLength={8}
                  required
                  className="font-mono"
                />
              </Field>
            </div>
          )}
        </fieldset>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={pending}>
            {pending ? "Creating…" : "Create sub-IB"}
          </Button>
          <ButtonLink href="/admin" variant="secondary">
            Cancel
          </ButtonLink>
        </div>
      </Card>
    </form>
  );
}

function AccessOption(props: {
  checked: boolean;
  onChange: () => void;
  value: string;
  title: string;
  description: string;
}) {
  return (
    <label className="flex cursor-pointer gap-3 rounded-sm p-2 hover:bg-surface-2">
      <input
        type="radio"
        name="access_mode"
        value={props.value}
        checked={props.checked}
        onChange={props.onChange}
        className="mt-1 accent-[var(--accent)]"
      />
      <span>
        <span className="block font-semibold">{props.title}</span>
        <span className="block text-sm text-dim">{props.description}</span>
      </span>
    </label>
  );
}
