"use client";

import { useState } from "react";
import { useClient } from "@/lib/hooks/useClient";
import { useSessions, type SessionWithLead } from "@/lib/hooks/useSessions";
import Badge from "@/components/ui/Badge";
import { SkeletonTable } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import type { SessionStatus } from "@/types/database.types";
import { toast } from "sonner";
import {
  CalendarDays,
  X,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  StickyNote,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const filterTabs: { label: string; value: SessionStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function SessionsPage() {
  const { client, loading: clientLoading, error: clientError } = useClient();
  const [filter, setFilter] = useState<SessionStatus | "all">("all");
  const [selectedSession, setSelectedSession] = useState<SessionWithLead | null>(null);

  const {
    sessions,
    loading,
    error,
    updateSessionStatus,
    refetch,
  } = useSessions(client?.id, filter === "all" ? undefined : filter);

  /* ── Loading ── */
  if (clientLoading || loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-white tracking-tight">Sessions</h1>
        <div className="flex gap-2">
          {filterTabs.map((t) => (
            <div key={t.value} className="skeleton h-9 w-24 rounded-xl" />
          ))}
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
          <SkeletonTable rows={5} />
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (clientError || error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-white tracking-tight">Sessions</h1>
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
          <p className="text-red-400 text-sm font-medium">Failed to load sessions</p>
          <p className="text-red-400/70 text-sm mt-1">{clientError ?? error}</p>
          <button
            onClick={refetch}
            className="mt-3 text-xs text-orange-400 hover:text-orange-300 font-medium cursor-pointer"
          >
            Try again →
          </button>
        </div>
      </div>
    );
  }

  const handleStatusUpdate = async (sessionId: string, newStatus: SessionStatus) => {
    const { error: err } = await updateSessionStatus(sessionId, newStatus);
    if (err) {
      toast.error("Failed to update session", { description: err });
    } else {
      toast.success(
        newStatus === "completed" ? "Session marked as completed" : "Session cancelled"
      );
      refetch();
    }
    setSelectedSession(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-white tracking-tight">Sessions</h1>

      {/* ── Filter Tabs ── */}
      <div className="flex gap-2 flex-wrap">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
              filter === tab.value
                ? "bg-orange-500/15 text-orange-400 border border-orange-500/25 shadow-sm shadow-orange-500/10"
                : "bg-white/[0.03] text-slate-400 border border-white/[0.06] hover:text-white hover:bg-white/[0.06]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Sessions Table ── */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
        {sessions.length === 0 ? (
          <EmptyState
            icon={<CalendarDays className="w-6 h-6 text-slate-500" />}
            title="No sessions found"
            description={filter === "all" ? "Sessions will appear here once created" : `No ${filter} sessions`}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Lead</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Scheduled</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Payment</th>
                  <th className="px-5 py-3.5 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s, i) => (
                  <tr
                    key={s.id}
                    onClick={() => setSelectedSession(s)}
                    className={`border-b border-white/[0.03] cursor-pointer transition-colors hover:bg-white/[0.04] ${
                      i % 2 === 0 ? "" : "bg-white/[0.01]"
                    }`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500/20 to-teal-500/20 border border-white/[0.06] flex items-center justify-center text-xs font-bold text-orange-400 uppercase shrink-0">
                          {(s.lead_name ?? "?").charAt(0)}
                        </div>
                        <span className="font-medium text-white">{s.lead_name ?? "Unknown"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-300">{formatDateTime(s.scheduled_time)}</td>
                    <td className="px-5 py-3.5"><Badge status={s.status} variant="session" /></td>
                    <td className="px-5 py-3.5"><Badge status={s.payment_status} variant="payment" /></td>
                    <td className="px-5 py-3.5 text-right text-white font-medium">
                      {s.payment_amount != null ? `$${s.payment_amount}` : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Detail Modal ── */}
      {selectedSession && (
        <SessionDetailModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          onMarkCompleted={() => handleStatusUpdate(selectedSession.id, "completed")}
          onCancel={() => handleStatusUpdate(selectedSession.id, "cancelled")}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Detail Modal                                                       */
/* ------------------------------------------------------------------ */

function SessionDetailModal({
  session,
  onClose,
  onMarkCompleted,
  onCancel,
}: {
  session: SessionWithLead;
  onClose: () => void;
  onMarkCompleted: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-enter"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-slate-900 border border-white/[0.08] rounded-2xl w-full max-w-lg p-6 space-y-5 modal-enter shadow-2xl shadow-black/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-teal-500/20 border border-white/[0.06] flex items-center justify-center text-sm font-bold text-orange-400 uppercase">
              {(session.lead_name ?? "?").charAt(0)}
            </div>
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight">
                {session.lead_name ?? "Unknown Lead"}
              </h2>
              <p className="text-xs text-slate-500">Session Details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-4">
          <DetailItem icon={<Clock className="w-3.5 h-3.5" />} label="Start" value={formatDateTime(session.scheduled_time)} />
          <DetailItem icon={<Clock className="w-3.5 h-3.5" />} label="End" value={formatDateTime(session.end_time)} />
          <DetailItem icon={<CheckCircle2 className="w-3.5 h-3.5" />} label="Status" value={<Badge status={session.status} variant="session" />} />
          <DetailItem icon={<DollarSign className="w-3.5 h-3.5" />} label="Payment" value={<Badge status={session.payment_status} variant="payment" />} />
          <DetailItem
            icon={<DollarSign className="w-3.5 h-3.5" />}
            label="Amount"
            value={session.payment_amount != null ? `$${session.payment_amount}` : "—"}
          />
          {session.meeting_link && (
            <DetailItem
              icon={<ExternalLink className="w-3.5 h-3.5" />}
              label="Meeting"
              value={
                <a
                  href={session.meeting_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 hover:underline truncate block text-sm"
                >
                  Join link ↗
                </a>
              }
            />
          )}
        </div>

        {session.session_notes && (
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2 text-slate-500">
              <StickyNote className="w-3.5 h-3.5" />
              <span className="text-xs font-medium uppercase tracking-wider">Notes</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{session.session_notes}</p>
          </div>
        )}

        {/* Actions */}
        {session.status === "scheduled" && (
          <div className="flex gap-3 pt-1">
            <button
              onClick={onMarkCompleted}
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-xl transition-all duration-200 text-sm cursor-pointer hover:shadow-lg hover:shadow-emerald-500/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              Mark Completed
            </button>
            <button
              onClick={onCancel}
              className="flex-1 flex items-center justify-center gap-2 bg-white/[0.04] hover:bg-red-500/15 text-slate-400 hover:text-red-400 font-medium py-2.5 rounded-xl transition-all duration-200 text-sm border border-white/[0.06] hover:border-red-500/25 cursor-pointer"
            >
              <XCircle className="w-4 h-4" />
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1 text-slate-500">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="text-sm text-white">{value}</div>
    </div>
  );
}
