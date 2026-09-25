import { createBrowserClient } from "@supabase/ssr";
import { supabasePublishableKey, supabaseUrl } from "./env";

/**
 * Browser Supabase client, acting as the signed-in user (RLS applies).
 * Used only for uploading images straight to Storage, so large files
 * don't pass through a server action.
 */
export function createClient() {
  return createBrowserClient(supabaseUrl(), supabasePublishableKey());
}
