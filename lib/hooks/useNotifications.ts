"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type NotificationType =
  | "new_lead"
  | "upcoming_session"
  | "overdue_payment"
  | "no_show";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  href: string; // page to navigate to
}

/* ------------------------------------------------------------------ */
/*  localStorage helpers                                               */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "campusbib_read_notifications";

function getReadIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function persistReadIds(ids: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useNotifications(clientId: string | undefined) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Load read state from localStorage on mount
  useEffect(() => {
    setReadIds(getReadIds());
  }, []);

  const fetchNotifications = useCallback(async () => {
    if (!clientId) return;
    setLoading(true);

    try {
      const now = new Date();
      const items: Notification[] = [];

      // ── 1. New leads (created in last 48h, status = 'new') ──
      const twoDaysAgo = new Date(now);
      twoDaysAgo.setHours(twoDaysAgo.getHours() - 48);

      const { data: newLeads } = await supabase
        .from("leads")
        .select("id, name, created_at")
        .eq("client_id", clientId)
        .eq("status", "new")
        .gte("created_at", twoDaysAgo.toISOString())
        .order("created_at", { ascending: false })
        .limit(10);

      for (const lead of newLeads ?? []) {
        items.push({
          id: `lead_${lead.id}`,
          type: "new_lead",
          title: "New Lead",
          message: `${lead.name || "Someone"} submitted a new inquiry`,
          timestamp: lead.created_at,
          href: "/leads",
        });
      }

      // ── 2. Upcoming sessions (scheduled, within next 24h) ──
      const tomorrow = new Date(now);
      tomorrow.setHours(tomorrow.getHours() + 24);

      const { data: upcomingSessions } = await supabase
        .from("sessions")
        .select("id, scheduled_time, leads(name)")
        .eq("client_id", clientId)
        .eq("status", "scheduled")
        .gte("scheduled_time", now.toISOString())
        .lte("scheduled_time", tomorrow.toISOString())
        .order("scheduled_time", { ascending: true })
        .limit(10);

      for (const session of upcomingSessions ?? []) {
        const leadData = session.leads as unknown as { name: string } | null;
        const name = leadData?.name || "a client";
        items.push({
          id: `session_${session.id}`,
          type: "upcoming_session",
          title: "Upcoming Session",
          message: `Session with ${name} is coming up`,
          timestamp: session.scheduled_time,
          href: "/sessions",
        });
      }

      // ── 3. Overdue payments ──
      const { data: overdueSessions } = await supabase
        .from("sessions")
        .select("id, scheduled_time, payment_amount, leads(name)")
        .eq("client_id", clientId)
        .eq("payment_status", "overdue")
        .order("scheduled_time", { ascending: false })
        .limit(10);

      for (const session of overdueSessions ?? []) {
        const leadData = session.leads as unknown as { name: string } | null;
        const name = leadData?.name || "a client";
        const amount = session.payment_amount
          ? `$${session.payment_amount}`
          : "Payment";
        items.push({
          id: `payment_${session.id}`,
          type: "overdue_payment",
          title: "Overdue Payment",
          message: `${amount} from ${name} is overdue`,
          timestamp: session.scheduled_time,
          href: "/sessions",
        });
      }

      // ── 4. No-shows (last 48h) ──
      const { data: noShows } = await supabase
        .from("sessions")
        .select("id, scheduled_time, leads(name)")
        .eq("client_id", clientId)
        .eq("status", "no-show")
        .gte("scheduled_time", twoDaysAgo.toISOString())
        .order("scheduled_time", { ascending: false })
        .limit(5);

      for (const session of noShows ?? []) {
        const leadData = session.leads as unknown as { name: string } | null;
        const name = leadData?.name || "A client";
        items.push({
          id: `noshow_${session.id}`,
          type: "no_show",
          title: "No-Show",
          message: `${name} didn't show up for their session`,
          timestamp: session.scheduled_time,
          href: "/sessions",
        });
      }

      // Sort by timestamp descending (newest first)
      items.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setNotifications(items);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [clientId, supabase]);

  useEffect(() => {
    fetchNotifications();
    // Refetch every 60 seconds
    const interval = setInterval(fetchNotifications, 60_000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // ── Derived state ──

  const unreadCount = useMemo(
    () => notifications.filter((n) => !readIds.has(n.id)).length,
    [notifications, readIds]
  );

  const markAsRead = useCallback(
    (id: string) => {
      setReadIds((prev) => {
        const next = new Set(prev);
        next.add(id);
        persistReadIds(next);
        return next;
      });
    },
    []
  );

  const markAllRead = useCallback(() => {
    setReadIds((prev) => {
      const next = new Set(prev);
      for (const n of notifications) next.add(n.id);
      persistReadIds(next);
      return next;
    });
  }, [notifications]);

  return {
    notifications,
    unreadCount,
    readIds,
    markAsRead,
    markAllRead,
    loading,
    refetch: fetchNotifications,
  };
}
