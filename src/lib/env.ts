import { z } from "zod";

const PublicSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
});

const SupabasePublicSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

const SupabaseServiceSchema = SupabasePublicSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

const TossServerSchema = z.object({
  TOSS_SECRET_KEY: z.string().min(1),
});

export function getPublicEnv() {
  const parsed = PublicSchema.safeParse(process.env);
  return parsed.success ? parsed.data : {};
}

export function getSupabasePublicEnv() {
  const parsed = SupabasePublicSchema.safeParse(process.env);
  if (!parsed.success) return null;
  return parsed.data;
}

export function requireSupabaseServiceEnv() {
  const parsed = SupabaseServiceSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("\n");
    throw new Error(`Invalid Supabase env:\n${issues}`);
  }
  return parsed.data;
}

export function requireTossServerEnv() {
  const parsed = TossServerSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("\n");
    throw new Error(`Invalid Toss env:\n${issues}`);
  }
  return parsed.data;
}

