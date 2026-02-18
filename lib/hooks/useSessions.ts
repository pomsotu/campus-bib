"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import type { Session, SessionStatus } from "@/types/database.types";

export interface SessionWithLead extends Session {
  lead_name: string | null;
}

export function useSessions(
  clientId: string | undefined,
  statusFilter?: SessionStatus
) {
  const [sessions, setSessions] = useState<SessionWithLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchSessions = useCallback(async () => {
    if (!clientId) return;
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("sessions")
        .select("*, leads(name)")
        .eq("client_id", clientId)
        .order("scheduled_time", { ascending: false });

      if (statusFilter) {
        query = query.eq("status", statusFilter);
      }

      const { data, error: dbError } = await query;
      if (dbError) throw dbError;

      const mapped: SessionWithLead[] = (data ?? []).map((row: Record<string, unknown>) => {
        const leads = row.leads as { name: string } | null;
        const { leads: _leads, ...rest } = row;
        return {
          ...rest,
          lead_name: leads?.name ?? null,
        } as SessionWithLead;
      });

      setSessions(mapped);
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? (err as { message: string }).message
          : "Failed to fetch sessions";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [clientId, statusFilter, supabase]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const updateSessionStatus = useCallback(
    async (sessionId: string, newStatus: SessionStatus) => {
      try {
        const { error: dbError } = await supabase
          .from("sessions")
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq("id", sessionId);

        if (dbError) throw dbError;

        // Optimistic update
        setSessions((prev) =>
          prev.map((s) =>
            s.id === sessionId ? { ...s, status: newStatus } : s
          )
        );

        return { error: null };
      } catch (err: unknown) {
        const message =
          err && typeof err === "object" && "message" in err
            ? (err as { message: string }).message
            : "Failed to update session";
        return { error: message };
      }
    },
    [supabase]
  );

  return { sessions, loading, error, refetch: fetchSessions, updateSessionStatus };
}
