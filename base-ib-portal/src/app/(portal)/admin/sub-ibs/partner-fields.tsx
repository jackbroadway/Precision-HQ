import { Field, Input, Select } from "@/components/ui";
import { BROKERS } from "@/lib/brokers";
import type { Broker } from "@/lib/types";

/** Name / broker / IB account / rate — shared by the create and edit forms. */
export function PartnerFields({
  defaults,
  errors = {},
}: {
  defaults?: { full_name?: string | null; broker?: Broker; ib_account_id?: string; rate_per_lot?: number };
  errors?: Partial<Record<string, string>>;
}) {
  return (
    <>
      <Field label="Full name" htmlFor="full_name" error={errors.full_name}>
        <Input id="full_name" name="full_name" required defaultValue={defaults?.full_name ?? ""} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Broker" htmlFor="broker" error={errors.broker}>
          <Select id="broker" name="broker" required defaultValue={defaults?.broker ?? ""}>
            <option value="" disabled>
              Select broker…
            </option>
            {BROKERS.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="IB account ID" htmlFor="ib_account_id" error={errors.ib_account_id}>
          <Input
            id="ib_account_id"
            name="ib_account_id"
            required
            className="font-mono"
            defaultValue={defaults?.ib_account_id ?? ""}
          />
        </Field>
      </div>
      <Field
        label="Rate ($ per lot)"
        htmlFor="rate_per_lot"
        hint="USD paid to this sub-IB per standard lot."
        error={errors.rate_per_lot}
      >
        <Input
          id="rate_per_lot"
          name="rate_per_lot"
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          max="1000"
          required
          className="font-mono"
          defaultValue={defaults?.rate_per_lot ?? ""}
        />
      </Field>
    </>
  );
}
