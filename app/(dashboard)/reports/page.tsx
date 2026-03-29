"use client";

import { useClient } from "@/lib/hooks/useClient";
import { useDashboardStats } from "@/lib/hooks/useDashboardStats";
import { useLeads } from "@/lib/hooks/useLeads";
import { useSessions } from "@/lib/hooks/useSessions";
import { SkeletonCard } from "@/components/ui/Skeleton";
import {
  Users,
  CalendarDays,
  CheckCircle2,
  TrendingUp,
  ArrowLeft,
  BarChart3,
  CreditCard,
  Clock,
} from "lucide-react";
import Link from "next/link";
import type { LeadStatus } from "@/types/database.types";

/* ── Helpers ────────────────────────────────────────────────────── */

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

const pipelineStages: {
  key: LeadStatus;
  label: string;
  color: string;
  bg: string;
  ring: string;
}[] = [
  { key: "new", label: "New", color: "text-blue-400", bg: "bg-blue-500", ring: "ring-blue-500/30" },
  { key: "qualified", label: "Qualified", color: "text-emerald-400", bg: "bg-emerald-500", ring: "ring-emerald-500/30" },
  { key: "booked", label: "Booked", color: "text-orange-400", bg: "bg-orange-500", ring: "ring-orange-500/30" },
  { key: "completed", label: "Completed", color: "text-green-400", bg: "bg-green-500", ring: "ring-green-500/30" },
  { key: "cold", label: "Cold", color: "text-red-400", bg: "bg-red-500", ring: "ring-red-500/30" },
];

/* ── Mini bar chart for month-over-month ─────────────────────────── */
function MonthBar({
  label,
  value,
  maxValue,
}: {
  label: string;
  value: number;
  maxValue: number;
}) {
  const pct = maxValue > 0 ? Math.round((value / maxValue) * 100) : 0;
  return (
    <div className="flex flex-col items-center gap-1.5 flex-1">
      <span className="text-xs font-semibold text-white tabular-nums">{value}</span>
      <div className="w-full rounded-full bg-white/[0.06] overflow-hidden" style={{ height: 80 }}>
        <div
          className="w-full rounded-full bg-orange-500 transition-all duration-700 ease-out"
          style={{ height: `${Math.max(pct, 4)}%`, marginTop: `${100 - Math.max(pct, 4)}%` }}
        />
      </div>
      <span className="text-[10px] text-slate-500 font-medium">{label}</span>
    </div>
  );
}

/* ── Payment status badge ────────────────────────────────────────── */
function PaymentChip({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div className={`flex items-center justify-between py-2.5 px-3 rounded-xl bg-white/[0.02] border border-white/[0.05]`}>
      <span className={`text-xs font-medium ${color}`}>{label}</span>
      <span className="text-sm font-bold text-white tabular-nums">{count}</span>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────── */

export default function ReportsPage() {
  const { client, loading: clientLoading } = useClient();
  const { stats, loading: statsLoading } = useDashboardStats(client?.id);
  const { leads, loading: leadsLoading } = useLeads(client?.id);
  const { sessions, loading: sessionsLoading } = useSessions(client?.id);

  const isLoading = clientLoading || statsLoading || leadsLoading || sessionsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-7 w-48 rounded-lg bg-white/[0.04] animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} className="h-[120px]" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonCard className="h-[260px]" />
          <SkeletonCard className="h-[260px]" />
        </div>
      </div>
    );
  }

  const totalLeads = Object.values(stats.leadBreakdown).reduce((a, b) => a + b, 0);

  /* ── Sessions by month (last 6 months) ── */
  const now = new Date();
  const monthBuckets = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      label: d.toLocaleDateString("en-US", { month: "short" }),
      year: d.getFullYear(),
      month: d.getMonth(),
      count: 0,
    };
  });

  for (const session of sessions) {
    if (session.status === "completed") {
      const sd = new Date(session.scheduled_time);
      const bucket = monthBuckets.find(
        (b) => b.month === sd.getMonth() && b.year === sd.getFullYear()
      );
      if (bucket) bucket.count++;
    }
  }

  const maxSessionCount = Math.max(...monthBuckets.map((b) => b.count), 1);

  /* ── Payment breakdown ── */
  const paymentCounts = { pending: 0, paid: 0, overdue: 0, waived: 0 };
  for (const s of sessions) {
    const ps = s.payment_status as keyof typeof paymentCounts | undefined;
    if (ps && ps in paymentCounts) paymentCounts[ps]++;
  }

  /* ── Conversion rate (leads → completed) ── */
  const conversionRate =
    totalLeads > 0
      ? Math.round((stats.leadBreakdown.completed / totalLeads) * 100)
      : 0;

  const kpiCards = [
    { label: "Total Leads", value: totalLeads, icon: Users, accent: "blue" as const },
    {
      label: "Completed Leads",
      value: stats.leadBreakdown.completed,
      icon: CheckCircle2,
      accent: "emerald" as const,
    },
    {
      label: "Conversion Rate",
      value: `${conversionRate}%`,
      icon: TrendingUp,
      accent: "orange" as const,
    },
    {
      label: "Sessions Completed\nThis Month",
      value: stats.completedThisMonth,
      icon: CalendarDays,
      accent: "teal" as const,
    },
  ];

  const accentStyles = {
    orange: { iconBg: "bg-orange-500/15", iconColor: "text-orange-400", glow: "drop-shadow-[0_0_12px_rgba(234,88,12,0.3)]" },
    teal: { iconBg: "bg-teal-500/15", iconColor: "text-teal-400", glow: "drop-shadow-[0_0_12px_rgba(20,184,166,0.3)]" },
    emerald: { iconBg: "bg-emerald-500/15", iconColor: "text-emerald-400", glow: "drop-shadow-[0_0_12px_rgba(16,185,129,0.3)]" },
    blue: { iconBg: "bg-blue-500/15", iconColor: "text-blue-400", glow: "drop-shadow-[0_0_12px_rgba(59,130,246,0.3)]" },
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center hover:bg-white/[0.07] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-slate-400" />
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-white tracking-tight">Reports</h1>
          <p className="text-xs text-slate-500 mt-0.5">{formatDate(now)}</p>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          const style = accentStyles[card.accent];
          return (
            <div
              key={card.label}
              className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 sm:p-5 hover:bg-white/[0.05] transition-all duration-300"
            >
              <div className="mb-3 sm:mb-4">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${style.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 sm:w-[18px] sm:h-[18px] ${style.iconColor}`} />
                </div>
              </div>
              <p className={`text-2xl sm:text-3xl font-bold text-white tracking-tight ${style.glow}`}>
                {card.value}
              </p>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1 sm:mt-1.5 leading-snug">
                {card.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── Two-column row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
        {/* Lead Funnel — full breakdown */}
        <div className="lg:col-span-3 bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 sm:px-6 py-4 border-b border-white/[0.06]">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-white">Lead Funnel</h2>
          </div>
          <div className="p-5 space-y-3">
            {totalLeads === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No lead data yet</p>
            ) : (
              pipelineStages.map((stage) => {
                const count = stats.leadBreakdown[stage.key as keyof typeof stats.leadBreakdown] ?? 0;
                const pct = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
                return (
                  <div key={stage.key} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${stage.bg}`} />
                        <span className={`text-xs font-medium ${stage.color}`}>{stage.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white tabular-nums">{count}</span>
                        <span className="text-[10px] text-slate-600 tabular-nums w-8 text-right">({pct}%)</span>
                      </div>
                    </div>
                    <div className="h-2.5 rounded-full bg-white/[0.04] overflow-hidden">
                      <div
                        className={`h-full rounded-full ${stage.bg} transition-all duration-700 ease-out`}
                        style={{ width: `${Math.max(pct, 2)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Payment Breakdown */}
        <div className="lg:col-span-2 bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 sm:px-6 py-4 border-b border-white/[0.06]">
            <CreditCard className="w-4 h-4 text-orange-400" />
            <h2 className="text-sm font-semibold text-white">Payment Status</h2>
          </div>
          <div className="p-4 sm:p-5 space-y-2">
            <PaymentChip label="Paid" count={paymentCounts.paid} color="text-emerald-400" />
            <PaymentChip label="Pending" count={paymentCounts.pending} color="text-orange-400" />
            <PaymentChip label="Overdue" count={paymentCounts.overdue} color="text-red-400" />
            <PaymentChip label="Waived" count={paymentCounts.waived} color="text-slate-400" />
          </div>
        </div>
      </div>

      {/* ── Sessions by Month chart ── */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-5 sm:px-6 py-4 border-b border-white/[0.06]">
          <BarChart3 className="w-4 h-4 text-teal-400" />
          <h2 className="text-sm font-semibold text-white">Completed Sessions — Last 6 Months</h2>
        </div>
        <div className="p-5 sm:p-6">
          <div className="flex items-end gap-3 sm:gap-4 h-[100px]">
            {monthBuckets.map((b) => (
              <MonthBar key={`${b.year}-${b.month}`} label={b.label} value={b.count} maxValue={maxSessionCount} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Quick Stats Summary row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "Total Leads", value: totalLeads, icon: Users, color: "text-blue-400", bg: "bg-blue-500/15" },
          { label: "Upcoming Sessions", value: stats.upcomingSessions, icon: Clock, color: "text-teal-400", bg: "bg-teal-500/15" },
          { label: "Total Sessions", value: sessions.length, icon: CalendarDays, color: "text-orange-400", bg: "bg-orange-500/15" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4 flex items-center gap-3"
            >
              <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div>
                <p className="text-lg font-bold text-white">{item.value}</p>
                <p className="text-[11px] text-slate-500 font-medium">{item.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
