import "server-only";
import { createClient } from "@supabase/supabase-js";
import { supabaseSecretKey, supabaseUrl } from "./env";

/**
 * Privileged client using the secret (service role) key. BYPASSES RLS.
 * Only use for auth admin operations (create / ban / delete users), and only
 * after `requireAdmin()` has confirmed the caller is an admin.
 */
export function createAdminClient() {
  return createClient(supabaseUrl(), supabaseSecretKey(), {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
