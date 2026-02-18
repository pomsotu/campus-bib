"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase";

export interface DashboardStats {
  leadsThisWeek: number;
  upcomingSessions: number;
  completedThisMonth: number;
  leadBreakdown: {
    new: number;
    qualified: number;
    booked: number;
    completed: number;
    cold: number;
  };
}

const emptyStats: DashboardStats = {
  leadsThisWeek: 0,
  upcomingSessions: 0,
  completedThisMonth: 0,
  leadBreakdown: { new: 0, qualified: 0, booked: 0, completed: 0, cold: 0 },
};

export function useDashboardStats(clientId: string | undefined) {
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchStats = useCallback(async () => {
    if (!clientId) return;
    setLoading(true);
    setError(null);

    try {
      const now = new Date();

      // ── Leads this week ──
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);

      const { count: leadsThisWeek, error: e1 } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("client_id", clientId)
        .gte("created_at", weekAgo.toISOString());
      if (e1) throw e1;

      // ── Upcoming sessions ──
      const { count: upcomingSessions, error: e2 } = await supabase
        .from("sessions")
        .select("*", { count: "exact", head: true })
        .eq("client_id", clientId)
        .eq("status", "scheduled")
        .gte("scheduled_time", now.toISOString());
      if (e2) throw e2;

      // ── Completed this month ──
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const { count: completedThisMonth, error: e3 } = await supabase
        .from("sessions")
        .select("*", { count: "exact", head: true })
        .eq("client_id", clientId)
        .eq("status", "completed")
        .gte("scheduled_time", monthStart.toISOString());
      if (e3) throw e3;

      // ── Lead status breakdown ──
      const { data: allLeads, error: e4 } = await supabase
        .from("leads")
        .select("status")
        .eq("client_id", clientId);
      if (e4) throw e4;

      const breakdown = { new: 0, qualified: 0, booked: 0, completed: 0, cold: 0 };
      for (const lead of allLeads ?? []) {
        const s = lead.status as keyof typeof breakdown;
        if (s in breakdown) breakdown[s]++;
      }

      setStats({
        leadsThisWeek: leadsThisWeek ?? 0,
        upcomingSessions: upcomingSessions ?? 0,
        completedThisMonth: completedThisMonth ?? 0,
        leadBreakdown: breakdown,
      });
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? (err as { message: string }).message
          : "Failed to fetch stats";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [clientId, supabase]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}
