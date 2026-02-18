"use client";

import { useMemo } from "react";
import { createClient } from "@/lib/supabase";

/**
 * Returns a memoised Supabase browser client for use inside Client Components.
 */
export function useSupabase() {
  const supabase = useMemo(() => createClient(), []);
  return supabase;
}
