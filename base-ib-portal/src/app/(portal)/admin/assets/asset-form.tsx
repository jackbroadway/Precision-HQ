"use client";

import { useActionState, useState } from "react";
import { Alert, Button, Card, Field, Input, Select } from "@/components/ui";
import type { AssetCategory } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import type { FormState } from "../actions";
import { createAsset } from "../content-actions";

const MAX_BYTES = 10 * 1024 * 1024;
const TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function AssetForm({ categories }: { categories: { value: AssetCategory; label: string }[] }) {
  const [preview, setPreview] = useState<string | null>(null);

  const [state, formAction, pending] = useActionState<FormState, FormData>(async (prev, formData) => {
    const file = formData.get("image");
    formData.delete("image");

    if (file instanceof File && file.size > 0) {
      const ext = TYPES[file.type];
      if (!ext) return { fieldErrors: { image: "Use a PNG, JPG, WEBP or GIF image." } };
      if (file.size > MAX_BYTES) return { fieldErrors: { image: "Images must be under 10 MB." } };

      // Upload straight from the browser (Storage policies allow admins only).
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await createClient()
        .storage.from("marketing")
        .upload(path, file, { contentType: file.type });
      if (error) return { error: `Image upload failed: ${error.message}` };
      formData.set("image_path", path);
    }

    const result = await createAsset(prev, formData);
    if (result.success) setPreview(null);
    return result;
  }, {});
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction}>
      <Card className="space-y-4">
        {state.error && <Alert>{state.error}</Alert>}
        {state.success && <Alert tone="ok">{state.success}</Alert>}
        <Field label="Image (optional)" htmlFor="image" hint="PNG, JPG, WEBP or GIF, up to 10 MB." error={errors.image}>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={(e) => {
              const f = e.target.files?.[0];
              setPreview(f ? URL.createObjectURL(f) : null);
            }}
            className="block w-full text-sm text-dim file:mr-3 file:rounded-sm file:border file:border-line file:bg-surface-2 file:px-3 file:py-2 file:font-mono file:text-xs file:tracking-wide file:text-text file:uppercase"
          />
        </Field>
        {preview && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="max-h-48 rounded-sm border border-line" />
        )}
        <Field label="Title" htmlFor="title" hint="Partners see this above the image." error={errors.title}>
          <Input id="title" name="title" required maxLength={200} placeholder="e.g. Weekly results post" />
        </Field>
        <Field label="For" htmlFor="category" error={errors.category}>
          <Select id="category" name="category" defaultValue="post">
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field
          label="Caption (optional)"
          htmlFor="caption"
          hint="Ready to paste: partners get a one-tap Copy button."
          error={errors.caption}
        >
          <textarea
            id="caption"
            name="caption"
            maxLength={5000}
            rows={5}
            className="w-full rounded-sm border border-line bg-bg px-3 py-2 text-text placeholder:text-faint focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none"
          />
        </Field>
        <Button type="submit" disabled={pending}>
          {pending ? "Uploading…" : "Add asset"}
        </Button>
      </Card>
    </form>
  );
}
