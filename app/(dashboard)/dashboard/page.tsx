"use client";

import { useClient } from "@/lib/hooks/useClient";
import { useDashboardStats } from "@/lib/hooks/useDashboardStats";
import { useLeads } from "@/lib/hooks/useLeads";
import { useSessions } from "@/lib/hooks/useSessions";
import Badge from "@/components/ui/Badge";
import { SkeletonCard, SkeletonRow } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import {
  Users,
  CalendarDays,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import type { LeadStatus } from "@/types/database.types";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  const { client, loading: clientLoading, error: clientError } = useClient();
  const { stats, loading: statsLoading, error: statsError } = useDashboardStats(client?.id);
  const { leads, loading: leadsLoading } = useLeads(client?.id);
  const { sessions, loading: sessionsLoading } = useSessions(client?.id);

  /* ── Loading ── */
  if (clientLoading || statsLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-white tracking-tight">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} className="h-[120px]" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
            {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
            {[...Array(3)].map((_, i) => <SkeletonRow key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (clientError || statsError) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-white tracking-tight">Dashboard</h1>
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
          <p className="text-red-400 text-sm font-medium">Something went wrong</p>
          <p className="text-red-400/70 text-sm mt-1">{clientError ?? statsError}</p>
        </div>
      </div>
    );
  }

  /* ── Data ── */
  const recentLeads = leads.slice(0, 5);
  const upcomingSessions = sessions
    .filter((s) => s.status === "scheduled" && new Date(s.scheduled_time) > new Date())
    .sort((a, b) => new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime())
    .slice(0, 3);

  const breakdownEntries = Object.entries(stats.leadBreakdown) as [LeadStatus, number][];

  const statCards = [
    {
      label: "Leads This Week",
      value: stats.leadsThisWeek,
      icon: Users,
      gradient: "from-orange-600 to-orange-500",
      shadow: "shadow-orange-500/20",
    },
    {
      label: "Upcoming Sessions",
      value: stats.upcomingSessions,
      icon: CalendarDays,
      gradient: "from-teal-600 to-teal-500",
      shadow: "shadow-teal-500/20",
    },
    {
      label: "Completed This Month",
      value: stats.completedThisMonth,
      icon: CheckCircle2,
      gradient: "from-emerald-600 to-emerald-500",
      shadow: "shadow-emerald-500/20",
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-white tracking-tight">Dashboard</h1>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} p-5 shadow-lg ${card.shadow} hover:scale-[1.02] transition-transform duration-200 cursor-default`}
            >
              {/* Decorative circle */}
              <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="w-4 h-4 text-white/80" />
                  <p className="text-sm text-white/80 font-medium">{card.label}</p>
                </div>
                <p className="text-4xl font-bold text-white tracking-tight">{card.value}</p>
              </div>
            </div>
          );
        })}

        {/* Lead Breakdown Card */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:bg-white/[0.05] transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-slate-400" />
            <p className="text-sm text-slate-400 font-medium">Lead Breakdown</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {breakdownEntries.map(([status, count]) => (
              <Badge key={status} status={`${status} (${count})`} variant="lead" />
            ))}
          </div>
        </div>
      </div>

      {/* ── Two-column: Recent Leads + Upcoming Sessions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
            <h2 className="text-base font-semibold text-white tracking-tight">Recent Leads</h2>
            <Link
              href="/leads"
              className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors"
            >
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="px-6 py-2">
            {leadsLoading ? (
              [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
            ) : recentLeads.length === 0 ? (
              <EmptyState
                icon={<Users className="w-6 h-6 text-slate-500" />}
                title="No leads yet"
                description="Leads will appear here as they come in"
              />
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center gap-3 py-3">
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500/20 to-teal-500/20 border border-white/[0.06] flex items-center justify-center text-xs font-bold text-orange-400 uppercase shrink-0">
                      {(lead.name ?? "?").charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white truncate">
                        {lead.name ?? "Unnamed"}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {lead.email ?? "No email"} · {timeAgo(lead.created_at)}
                      </p>
                    </div>
                    <Badge status={lead.status} variant="lead" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
            <h2 className="text-base font-semibold text-white tracking-tight">Upcoming Sessions</h2>
            <Link
              href="/sessions"
              className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors"
            >
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="px-6 py-2">
            {sessionsLoading ? (
              [...Array(3)].map((_, i) => <SkeletonRow key={i} />)
            ) : upcomingSessions.length === 0 ? (
              <EmptyState
                icon={<CalendarDays className="w-6 h-6 text-slate-500" />}
                title="No upcoming sessions"
                description="Your next scheduled sessions will appear here"
              />
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {upcomingSessions.map((s) => (
                  <div key={s.id} className="flex items-center justify-between py-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white truncate">
                        {s.lead_name ?? "Unknown Lead"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatDateTime(s.scheduled_time)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge status={s.status} variant="session" />
                      <Badge status={s.payment_status} variant="payment" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
