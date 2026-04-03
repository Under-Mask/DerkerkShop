import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicEnv, requireSupabaseServiceEnv } from "@/lib/env";

export function createSupabaseAdmin() {
  const env = requireSupabaseServiceEnv();
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

export function createSupabaseAnonServer() {
  const env = getSupabasePublicEnv();
  if (!env) return null;
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
}

