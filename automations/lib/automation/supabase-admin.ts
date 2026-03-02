/**
 * Server-side Supabase client using the service role key.
 * This bypasses RLS — used ONLY in API routes and cron jobs, never in client components.
 *
 * The service role key has full access to all data across all clients,
 * which is exactly what our multi-tenant cron jobs need (e.g., querying
 * sessions for ALL clients to send reminders).
 */

import { createClient } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable");
}

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);
