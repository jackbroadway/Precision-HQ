import { requireAdmin } from "@/lib/auth";

// Every page under /admin is admin-only. (RLS enforces the same rule in the DB.)
export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  await requireAdmin();
  return children;
}
