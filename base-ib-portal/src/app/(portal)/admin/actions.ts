"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { isBroker } from "@/lib/brokers";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Broker } from "@/lib/types";

export type FormState = {
  error?: string;
  fieldErrors?: Partial<Record<string, string>>;
  success?: string;
};

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

type PartnerFields = {
  fullName: string;
  broker: Broker;
  ibAccountId: string;
  ratePerLot: number;
};

function parsePartnerFields(formData: FormData):
  | { ok: true; data: PartnerFields }
  | { ok: false; fieldErrors: Record<string, string> } {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const broker = formData.get("broker");
  const ibAccountId = String(formData.get("ib_account_id") ?? "").trim();
  const rateRaw = String(formData.get("rate_per_lot") ?? "").trim();
  const ratePerLot = Number(rateRaw);

  const fieldErrors: Record<string, string> = {};
  if (!fullName) fieldErrors.full_name = "Name is required.";
  if (!isBroker(broker)) fieldErrors.broker = "Choose PU Prime or Vantage.";
  if (!ibAccountId) fieldErrors.ib_account_id = "IB account ID is required.";
  else if (!/^[A-Za-z0-9_-]{1,64}$/.test(ibAccountId))
    fieldErrors.ib_account_id = "Letters, numbers, - and _ only.";
  if (!rateRaw || !Number.isFinite(ratePerLot) || ratePerLot < 0 || ratePerLot > 1000)
    fieldErrors.rate_per_lot = "Enter a rate between 0 and 1000.";
  else if (!/^\d+(\.\d{1,2})?$/.test(rateRaw))
    fieldErrors.rate_per_lot = "Use at most 2 decimal places.";

  if (Object.keys(fieldErrors).length) return { ok: false, fieldErrors };
  return { ok: true, data: { fullName, broker: broker as Broker, ibAccountId, ratePerLot } };
}

const DUPLICATE_ACCOUNT = "That IB account ID is already registered for this broker.";

// ---------------------------------------------------------------------------
// Create
// ---------------------------------------------------------------------------

export async function createSubIb(_prev: FormState, formData: FormData): Promise<FormState> {
  const { user: adminUser } = await requireAdmin();

  const parsed = parsePartnerFields(formData);
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const mode = formData.get("access_mode") === "password" ? "password" : "invite";
  const tempPassword = String(formData.get("temp_password") ?? "");

  const fieldErrors = parsed.ok ? {} : { ...parsed.fieldErrors };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fieldErrors.email = "Enter a valid email.";
  if (mode === "password" && tempPassword.length < 8)
    fieldErrors.temp_password = "At least 8 characters.";
  if (!parsed.ok || Object.keys(fieldErrors).length) return { fieldErrors };

  const { fullName, broker, ibAccountId, ratePerLot } = parsed.data;
  const supabase = await createClient();

  // Check for a duplicate account before creating a login we'd have to undo.
  const { data: existing } = await supabase
    .from("sub_ibs")
    .select("id")
    .eq("broker", broker)
    .eq("ib_account_id", ibAccountId)
    .maybeSingle();
  if (existing) return { fieldErrors: { ib_account_id: DUPLICATE_ACCOUNT } };

  // 1. Create the login (needs the secret key).
  const admin = createAdminClient();
  const { data: created, error: authError } =
    mode === "invite"
      ? await admin.auth.admin.inviteUserByEmail(email, { data: { full_name: fullName } })
      : await admin.auth.admin.createUser({
          email,
          password: tempPassword,
          email_confirm: true,
          user_metadata: { full_name: fullName },
          app_metadata: { must_change_password: true },
        });

  if (authError || !created.user) {
    if (authError?.code === "email_exists" || /already.*registered/i.test(authError?.message ?? ""))
      return { fieldErrors: { email: "A user with this email already exists." } };
    return { error: `Couldn't create the login: ${authError?.message ?? "unknown error"}` };
  }

  // 2. Create the partner record as the admin user (goes through RLS).
  const { data: row, error: insertError } = await supabase
    .from("sub_ibs")
    .insert({
      user_id: created.user.id,
      broker,
      ib_account_id: ibAccountId,
      rate_per_lot: ratePerLot,
      created_by: adminUser.id,
    })
    .select("id")
    .single();

  if (insertError || !row) {
    // Roll back the login so we don't leave an orphan account behind.
    await admin.auth.admin.deleteUser(created.user.id);
    if (insertError?.code === "23505") return { fieldErrors: { ib_account_id: DUPLICATE_ACCOUNT } };
    return { error: `Couldn't save the partner: ${insertError?.message ?? "unknown error"}` };
  }

  revalidatePath("/admin");
  redirect(`/admin/sub-ibs/${row.id}?created=${mode}`);
}

// ---------------------------------------------------------------------------
// Update
// ---------------------------------------------------------------------------

export async function updateSubIb(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireAdmin();
  const parsed = parsePartnerFields(formData);
  if (!parsed.ok) return { fieldErrors: parsed.fieldErrors };
  const { fullName, broker, ibAccountId, ratePerLot } = parsed.data;

  const supabase = await createClient();
  const { data: row, error } = await supabase
    .from("sub_ibs")
    .update({ broker, ib_account_id: ibAccountId, rate_per_lot: ratePerLot })
    .eq("id", id)
    .select("user_id")
    .single();

  if (error || !row) {
    if (error?.code === "23505") return { fieldErrors: { ib_account_id: DUPLICATE_ACCOUNT } };
    return { error: `Couldn't save: ${error?.message ?? "partner not found"}` };
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ full_name: fullName })
    .eq("id", row.user_id);
  if (profileError) return { error: `Couldn't save name: ${profileError.message}` };

  revalidatePath("/admin");
  revalidatePath(`/admin/sub-ibs/${id}`);
  return { success: "Changes saved." };
}

// ---------------------------------------------------------------------------
// Status / access
// ---------------------------------------------------------------------------

async function getPartnerUser(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("sub_ibs")
    .select("user_id, profile:profiles!sub_ibs_user_id_fkey(email, role)")
    .eq("id", id)
    .single<{ user_id: string; profile: { email: string; role: string } | null }>();
  return { supabase, partner: data };
}

export async function setSubIbStatus(
  id: string,
  status: "active" | "inactive",
): Promise<FormState> {
  await requireAdmin();
  const { supabase, partner } = await getPartnerUser(id);
  if (!partner) return { error: "Partner not found." };

  const { error } = await supabase.from("sub_ibs").update({ status }).eq("id", id);
  if (error) return { error: error.message };

  // Inactive partners can't sign in: ban the login (reversible).
  const admin = createAdminClient();
  const { error: banError } = await admin.auth.admin.updateUserById(partner.user_id, {
    ban_duration: status === "inactive" ? "876000h" : "none",
  });
  if (banError) return { error: `Status saved, but login access wasn't updated: ${banError.message}` };

  revalidatePath("/admin");
  revalidatePath(`/admin/sub-ibs/${id}`);
  return { success: status === "inactive" ? "Partner deactivated." : "Partner reactivated." };
}

export async function sendPasswordReset(id: string): Promise<FormState> {
  await requireAdmin();
  const { supabase, partner } = await getPartnerUser(id);
  if (!partner?.profile) return { error: "Partner not found." };

  const { error } = await supabase.auth.resetPasswordForEmail(partner.profile.email);
  if (error) return { error: error.message };
  return { success: `Reset link sent to ${partner.profile.email}.` };
}

export async function deleteSubIb(id: string): Promise<FormState> {
  await requireAdmin();
  const { partner } = await getPartnerUser(id);
  if (!partner) return { error: "Partner not found." };
  if (partner.profile?.role === "admin") return { error: "Admins can't be deleted from here." };

  // Deleting the auth user cascades to profiles and sub_ibs.
  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(partner.user_id);
  if (error) return { error: error.message };

  revalidatePath("/admin");
  redirect("/admin");
}
