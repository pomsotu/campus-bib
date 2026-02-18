"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import type { Lead, LeadStatus } from "@/types/database.types";

export function useLeads(
  clientId: string | undefined,
  statusFilter?: LeadStatus
) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchLeads = useCallback(async () => {
    if (!clientId) return;
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("leads")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });

      if (statusFilter) {
        query = query.eq("status", statusFilter);
      }

      const { data, error: dbError } = await query;
      if (dbError) throw dbError;

      setLeads((data as Lead[]) ?? []);
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? (err as { message: string }).message
          : "Failed to fetch leads";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [clientId, statusFilter, supabase]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const updateLeadStatus = useCallback(
    async (leadId: string, newStatus: LeadStatus) => {
      try {
        const { error: dbError } = await supabase
          .from("leads")
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq("id", leadId);

        if (dbError) throw dbError;

        // Optimistic update
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
        );

        return { error: null };
      } catch (err: unknown) {
        const message =
          err && typeof err === "object" && "message" in err
            ? (err as { message: string }).message
            : "Failed to update lead";
        return { error: message };
      }
    },
    [supabase]
  );

  return { leads, loading, error, refetch: fetchLeads, updateLeadStatus };
}
