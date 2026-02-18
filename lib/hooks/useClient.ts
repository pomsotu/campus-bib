"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import type { Client } from "@/types/database.types";

/**
 * Resolves the authenticated Supabase user → clients table row.
 * All other data hooks depend on the `client.id` this returns.
 */
export function useClient() {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setError("Not authenticated");
          setLoading(false);
          return;
        }

        const { data, error: dbError } = await supabase
          .from("clients")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (dbError) {
          setError(dbError.message);
        } else {
          setClient(data as Client);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, []);

  return { client, loading, error };
}
