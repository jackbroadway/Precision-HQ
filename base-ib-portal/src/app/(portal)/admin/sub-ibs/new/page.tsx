import type { Metadata } from "next";
import { PageHeader } from "@/components/ui";
import { NewSubIbForm } from "./new-sub-ib-form";

export const metadata: Metadata = { title: "Add sub-IB" };

export default function NewSubIbPage() {
  return (
    <div className="max-w-2xl">
      <PageHeader eyebrow="Admin · Partners" title="Add sub-IB" />
      <NewSubIbForm />
    </div>
  );
}
