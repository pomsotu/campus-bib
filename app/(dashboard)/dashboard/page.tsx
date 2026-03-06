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
  DollarSign,
  ArrowUpRight,
  Plus,
  FileText,
  BarChart3,
  UserPlus,
  Clock,
  CreditCard,
  TrendingUp,
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

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const pipelineStages: { key: LeadStatus; label: string; color: string; bg: string }[] = [
  { key: "new", label: "New", color: "text-blue-400", bg: "bg-blue-500" },
  { key: "qualified", label: "Qualified", color: "text-emerald-400", bg: "bg-emerald-500" },
  { key: "booked", label: "Booked", color: "text-orange-400", bg: "bg-orange-500" },
  { key: "completed", label: "Completed", color: "text-green-400", bg: "bg-green-500" },
  { key: "cold", label: "Cold", color: "text-red-400", bg: "bg-red-500" },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  const { client, loading: clientLoading, error: clientError } = useClient();
  const {
    stats,
    loading: statsLoading,
    error: statsError,
  } = useDashboardStats(client?.id);
  const { leads, loading: leadsLoading } = useLeads(client?.id);
  const { sessions, loading: sessionsLoading } = useSessions(client?.id);

  /* ── Loading ── */
  if (clientLoading || statsLoading) {
    return (
      <div className="space-y-6">
        {/* Welcome skeleton */}
        <div className="space-y-2">
          <div className="h-7 w-64 rounded-lg bg-white/[0.04] animate-pulse" />
          <div className="h-4 w-44 rounded-lg bg-white/[0.03] animate-pulse" />
        </div>
        {/* Stat card skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} className="h-[130px]" />
          ))}
        </div>
        {/* Content skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
            {[...Array(4)].map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
          <div className="lg:col-span-2 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
            {[...Array(3)].map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (clientError || statsError) {
    return (
      <div className="space-y-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
          <p className="text-red-400 text-sm font-medium">
            Something went wrong
          </p>
          <p className="text-red-400/70 text-sm mt-1">
            {clientError ?? statsError}
          </p>
        </div>
      </div>
    );
  }

  /* ── Data ── */
  const recentLeads = leads.slice(0, 5);
  const todaySessions = sessions
    .filter((s) => {
      const sessionDate = new Date(s.scheduled_time);
      const today = new Date();
      return (
        s.status === "scheduled" &&
        sessionDate.toDateString() === today.toDateString()
      );
    })
    .sort(
      (a, b) =>
        new Date(a.scheduled_time).getTime() -
        new Date(b.scheduled_time).getTime()
    );

  const upcomingSessions = sessions
    .filter(
      (s) =>
        s.status === "scheduled" && new Date(s.scheduled_time) > new Date()
    )
    .sort(
      (a, b) =>
        new Date(a.scheduled_time).getTime() -
        new Date(b.scheduled_time).getTime()
    )
    .slice(0, 5);

  const displaySessions =
    todaySessions.length > 0 ? todaySessions : upcomingSessions;
  const scheduleTitle =
    todaySessions.length > 0 ? "Today's Schedule" : "Upcoming Sessions";

  const totalLeads = Object.values(stats.leadBreakdown).reduce(
    (a, b) => a + b,
    0
  );
  const firstName = client?.name?.split(" ")[0] ?? "there";

  const statCards = [
    {
      label: "Leads This Week",
      value: stats.leadsThisWeek,
      icon: Users,
      accent: "orange" as const,
    },
    {
      label: "Upcoming Sessions",
      value: stats.upcomingSessions,
      icon: CalendarDays,
      accent: "teal" as const,
    },
    {
      label: "Completed This Month",
      value: stats.completedThisMonth,
      icon: CheckCircle2,
      accent: "emerald" as const,
    },
    {
      label: "Total Pipeline",
      value: totalLeads,
      icon: TrendingUp,
      accent: "blue" as const,
    },
  ];

  const accentStyles = {
    orange: {
      iconBg: "bg-orange-500/15",
      iconColor: "text-orange-400",
      valueShadow: "drop-shadow-[0_0_12px_rgba(234,88,12,0.3)]",
    },
    teal: {
      iconBg: "bg-teal-500/15",
      iconColor: "text-teal-400",
      valueShadow: "drop-shadow-[0_0_12px_rgba(20,184,166,0.3)]",
    },
    emerald: {
      iconBg: "bg-emerald-500/15",
      iconColor: "text-emerald-400",
      valueShadow: "drop-shadow-[0_0_12px_rgba(16,185,129,0.3)]",
    },
    blue: {
      iconBg: "bg-blue-500/15",
      iconColor: "text-blue-400",
      valueShadow: "drop-shadow-[0_0_12px_rgba(59,130,246,0.3)]",
    },
  };

  /* ── Activity feed items ── */
  interface ActivityItem {
    id: string;
    type: "lead" | "session" | "payment";
    message: string;
    time: string;
  }

  const activityItems: ActivityItem[] = [
    ...recentLeads.slice(0, 3).map((l) => ({
      id: `lead-${l.id}`,
      type: "lead" as const,
      message: `${l.name ?? "Someone"} submitted a new inquiry`,
      time: l.created_at,
    })),
    ...sessions
      .filter((s) => s.status === "completed")
      .slice(0, 2)
      .map((s) => ({
        id: `session-${s.id}`,
        type: "session" as const,
        message: `Session with ${s.lead_name ?? "client"} completed`,
        time: s.updated_at,
      })),
  ]
    .sort(
      (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
    )
    .slice(0, 5);

  const activityIcons = {
    lead: { icon: UserPlus, color: "text-blue-400", bg: "bg-blue-500/15" },
    session: {
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-500/15",
    },
    payment: {
      icon: CreditCard,
      color: "text-orange-400",
      bg: "bg-orange-500/15",
    },
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* ── Welcome Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
            {getGreeting()}, {firstName} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {formatDate(new Date())}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/sessions"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white/[0.04] border border-white/[0.06] text-slate-300 hover:bg-white/[0.06] hover:text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> New Session
          </Link>
          <Link
            href="/leads"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-orange-600 text-white hover:bg-orange-500 transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" /> Add Lead
          </Link>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          const style = accentStyles[card.accent];
          return (
            <div
              key={card.label}
              className="group relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 sm:p-5 hover:bg-white/[0.05] hover:border-white/[0.08] transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${style.iconBg} flex items-center justify-center`}
                >
                  <Icon
                    className={`w-4 h-4 sm:w-[18px] sm:h-[18px] ${style.iconColor}`}
                  />
                </div>
              </div>
              <p
                className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight ${style.valueShadow} transition-all duration-300`}
              >
                {card.value}
              </p>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1 sm:mt-1.5">
                {card.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── Middle Row: Schedule + Pipeline ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-3 bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-400" />
              <h2 className="text-sm font-semibold text-white">
                {scheduleTitle}
              </h2>
            </div>
            <Link
              href="/sessions"
              className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors"
            >
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-4 sm:p-5">
            {sessionsLoading ? (
              [...Array(3)].map((_, i) => <SkeletonRow key={i} />)
            ) : displaySessions.length === 0 ? (
              <EmptyState
                icon={<CalendarDays className="w-6 h-6 text-slate-500" />}
                title="No sessions scheduled"
                description="Your upcoming sessions will appear here"
              />
            ) : (
              <div className="space-y-2.5">
                {displaySessions.map((s) => (
                  <div
                    key={s.id}
                    className="group/item flex items-center gap-3 sm:gap-4 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06] transition-all duration-200"
                  >
                    {/* Time */}
                    <div className="flex-shrink-0 w-16 sm:w-20 text-right">
                      <p className="text-sm font-semibold text-teal-400">
                        {formatTime(s.scheduled_time)}
                      </p>
                    </div>
                    {/* Accent bar */}
                    <div className="w-0.5 h-10 rounded-full bg-teal-500/50 flex-shrink-0" />
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {s.lead_name ?? "Client"}
                      </p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {new Date(s.scheduled_time).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    {/* Badges */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <Badge status={s.status} variant="session" />
                      <Badge status={s.payment_status} variant="payment" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Lead Pipeline */}
        <div className="lg:col-span-2 bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-orange-400" />
              <h2 className="text-sm font-semibold text-white">
                Lead Pipeline
              </h2>
            </div>
            <Link
              href="/leads"
              className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors"
            >
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-4 sm:p-5">
            {totalLeads === 0 ? (
              <EmptyState
                icon={<TrendingUp className="w-6 h-6 text-slate-500" />}
                title="No leads yet"
                description="Your pipeline will populate as leads come in"
              />
            ) : (
              <div className="space-y-3">
                {pipelineStages.map((stage) => {
                  const count =
                    stats.leadBreakdown[
                      stage.key as keyof typeof stats.leadBreakdown
                    ] ?? 0;
                  const pct =
                    totalLeads > 0
                      ? Math.round((count / totalLeads) * 100)
                      : 0;
                  return (
                    <div key={stage.key} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-medium ${stage.color}`}
                        >
                          {stage.label}
                        </span>
                        <span className="text-xs text-slate-500 tabular-nums">
                          {count}{" "}
                          <span className="text-slate-600">({pct}%)</span>
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
                        <div
                          className={`h-full rounded-full ${stage.bg} transition-all duration-700 ease-out`}
                          style={{ width: `${Math.max(pct, 2)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom Row: Recent Leads + Activity ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
        {/* Recent Leads */}
        <div className="lg:col-span-3 bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <h2 className="text-sm font-semibold text-white">
                Recent Leads
              </h2>
            </div>
            <Link
              href="/leads"
              className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors"
            >
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {leadsLoading ? (
              <div className="px-5 sm:px-6 py-3">
                {[...Array(5)].map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </div>
            ) : recentLeads.length === 0 ? (
              <div className="px-5 sm:px-6 py-4">
                <EmptyState
                  icon={<Users className="w-6 h-6 text-slate-500" />}
                  title="No leads yet"
                  description="Leads will appear here as they come in"
                />
              </div>
            ) : (
              recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center gap-3 px-5 sm:px-6 py-3 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-orange-500/20 to-teal-500/20 border border-white/[0.06] flex items-center justify-center text-xs font-bold text-orange-400 uppercase shrink-0">
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
              ))
            )}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-2 bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" />
              <h2 className="text-sm font-semibold text-white">
                Recent Activity
              </h2>
            </div>
          </div>
          <div className="p-4 sm:p-5">
            {activityItems.length === 0 ? (
              <EmptyState
                icon={<FileText className="w-6 h-6 text-slate-500" />}
                title="No activity yet"
                description="Recent events will show up here"
              />
            ) : (
              <div className="space-y-3">
                {activityItems.map((item) => {
                  const cfg = activityIcons[item.type];
                  const Icon = cfg.icon;
                  return (
                    <div
                      key={item.id}
                      className="flex items-start gap-3"
                    >
                      <div
                        className={`mt-0.5 w-7 h-7 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {item.message}
                        </p>
                        <p className="text-[10px] text-slate-600 mt-0.5">
                          {timeAgo(item.time)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Add Session",
            icon: CalendarDays,
            href: "/sessions",
            accent: "teal",
          },
          {
            label: "Add Lead",
            icon: UserPlus,
            href: "/leads",
            accent: "orange",
          },
          {
            label: "Send Invoice",
            icon: DollarSign,
            href: "/sessions",
            accent: "emerald",
          },
          {
            label: "View Reports",
            icon: BarChart3,
            href: "/dashboard",
            accent: "blue",
          },
        ].map((action) => {
          const Icon = action.icon;
          const accMap: Record<string, string> = {
            teal: "text-teal-400 bg-teal-500/10 group-hover:bg-teal-500/15",
            orange:
              "text-orange-400 bg-orange-500/10 group-hover:bg-orange-500/15",
            emerald:
              "text-emerald-400 bg-emerald-500/10 group-hover:bg-emerald-500/15",
            blue: "text-blue-400 bg-blue-500/10 group-hover:bg-blue-500/15",
          };
          return (
            <Link
              key={action.label}
              href={action.href}
              className="group flex flex-col items-center gap-2.5 p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-200"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${accMap[action.accent]}`}
              >
                <Icon className="w-[18px] h-[18px]" />
              </div>
              <span className="text-xs font-medium text-slate-400 group-hover:text-white transition-colors">
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
