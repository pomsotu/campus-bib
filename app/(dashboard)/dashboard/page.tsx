"use client";

import { useClient } from "@/lib/hooks/useClient";
import { useDashboardStats } from "@/lib/hooks/useDashboardStats";
import { useLeads } from "@/lib/hooks/useLeads";
import { useSessions } from "@/lib/hooks/useSessions";
import type { LeadStatus } from "@/types/database.types";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const statusColors: Record<string, string> = {
  new: "bg-blue-500/20 text-blue-400",
  qualified: "bg-amber-500/20 text-amber-400",
  booked: "bg-indigo-500/20 text-indigo-400",
  completed: "bg-emerald-500/20 text-emerald-400",
  cold: "bg-slate-500/20 text-slate-400",
  scheduled: "bg-blue-500/20 text-blue-400",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
        statusColors[status] ?? "bg-slate-500/20 text-slate-400"
      }`}
    >
      {status}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  const { client, loading: clientLoading, error: clientError } = useClient();
  const { stats, loading: statsLoading, error: statsError } = useDashboardStats(client?.id);
  const { leads, loading: leadsLoading } = useLeads(client?.id);
  const { sessions, loading: sessionsLoading } = useSessions(client?.id);

  // ── Loading state ──
  if (clientLoading || statsLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse">
              <div className="h-4 w-24 bg-white/10 rounded mb-3" />
              <div className="h-8 w-16 bg-white/10 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Error state ──
  if (clientError || statsError) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-red-400">
          {clientError ?? statsError}
        </div>
      </div>
    );
  }

  // ── Recent data ──
  const recentLeads = leads.slice(0, 5);
  const upcomingSessions = sessions
    .filter((s) => s.status === "scheduled" && new Date(s.scheduled_time) > new Date())
    .sort((a, b) => new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime())
    .slice(0, 3);

  // ── Breakdown entries ──
  const breakdownEntries = Object.entries(stats.leadBreakdown) as [LeadStatus, number][];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Leads This Week"
          value={stats.leadsThisWeek}
          icon={
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
          color="blue"
        />
        <StatCard
          label="Upcoming Sessions"
          value={stats.upcomingSessions}
          icon={
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
          color="indigo"
        />
        <StatCard
          label="Completed This Month"
          value={stats.completedThisMonth}
          icon={
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="emerald"
        />
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <p className="text-sm text-slate-400 mb-3">Lead Breakdown</p>
          <div className="flex flex-wrap gap-2">
            {breakdownEntries.map(([status, count]) => (
              <span
                key={status}
                className={`text-xs px-2 py-1 rounded-lg font-medium ${statusColors[status]}`}
              >
                {status}: {count}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Two-column grid: Recent Leads + Upcoming Sessions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Leads</h2>
          {leadsLoading ? (
            <p className="text-slate-500 text-sm">Loading…</p>
          ) : recentLeads.length === 0 ? (
            <p className="text-slate-500 text-sm">No leads yet.</p>
          ) : (
            <div className="space-y-3">
              {recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {lead.name ?? "Unnamed"}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {lead.email ?? "No email"} · {formatDate(lead.created_at)}
                    </p>
                  </div>
                  <StatusBadge status={lead.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Upcoming Sessions</h2>
          {sessionsLoading ? (
            <p className="text-slate-500 text-sm">Loading…</p>
          ) : upcomingSessions.length === 0 ? (
            <p className="text-slate-500 text-sm">No upcoming sessions.</p>
          ) : (
            <div className="space-y-3">
              {upcomingSessions.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {s.lead_name ?? "Unknown Lead"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatDateTime(s.scheduled_time)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={s.status} />
                    <StatusBadge status={s.payment_status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stat Card sub-component                                            */
/* ------------------------------------------------------------------ */

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-3">
        <div
          className={`w-8 h-8 rounded-lg bg-${color}-600/20 flex items-center justify-center`}
        >
          {icon}
        </div>
        <p className="text-sm text-slate-400">{label}</p>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}
