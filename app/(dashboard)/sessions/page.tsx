"use client";

import { useState, useMemo } from "react";
import { useClient } from "@/lib/hooks/useClient";
import { useSessions, type SessionWithLead } from "@/lib/hooks/useSessions";
import { useLeads } from "@/lib/hooks/useLeads";
import Badge from "@/components/ui/Badge";
import { SkeletonCard, SkeletonRow } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import type { SessionStatus, Session } from "@/types/database.types";
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
  User,
  Mail,
  Plus,
  ChevronRight,
  Video,
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

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getDuration(start: string, end: string): string {
  const diff = new Date(end).getTime() - new Date(start).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  const remMins = mins % 60;
  return remMins > 0 ? `${hrs}h ${remMins}m` : `${hrs}h`;
}

const statusAccent: Record<
  string,
  { bar: string; bg: string }
> = {
  scheduled: { bar: "bg-teal-500", bg: "border-l-teal-500" },
  completed: { bar: "bg-emerald-500", bg: "border-l-emerald-500" },
  cancelled: { bar: "bg-red-500", bg: "border-l-red-500" },
  "no-show": { bar: "bg-amber-500", bg: "border-l-amber-500" },
  rescheduled: { bar: "bg-blue-500", bg: "border-l-blue-500" },
};

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
  const [selectedSession, setSelectedSession] =
    useState<SessionWithLead | null>(null);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const {
    sessions,
    loading,
    error,
    updateSessionStatus,
    addSession,
    refetch,
  } = useSessions(client?.id, filter === "all" ? undefined : filter);

  const { leads } = useLeads(client?.id);

  // Count by status for tab badges
  const {
    sessions: allSessions,
  } = useSessions(client?.id);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: 0 };
    for (const s of allSessions) {
      counts[s.status] = (counts[s.status] ?? 0) + 1;
      counts.all++;
    }
    return counts;
  }, [allSessions]);

  /* ── Loading ── */
  if (clientLoading || loading) {
    return (
      <div className="space-y-5">
        <div className="flex gap-2">
          {filterTabs.map((t) => (
            <div
              key={t.value}
              className="h-9 w-24 rounded-xl bg-white/[0.03] animate-pulse"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3 space-y-3">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} className="h-20" />
            ))}
          </div>
          <div className="lg:col-span-2">
            <SkeletonCard className="h-[400px]" />
          </div>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (clientError || error) {
    return (
      <div className="space-y-5">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
          <p className="text-red-400 text-sm font-medium">
            Failed to load sessions
          </p>
          <p className="text-red-400/70 text-sm mt-1">
            {clientError ?? error}
          </p>
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

  const handleStatusUpdate = async (
    sessionId: string,
    newStatus: SessionStatus
  ) => {
    const { error: err } = await updateSessionStatus(sessionId, newStatus);
    if (err) {
      toast.error("Failed to update session", { description: err });
    } else {
      toast.success(
        newStatus === "completed"
          ? "Session marked as completed"
          : "Session cancelled"
      );
      refetch();
    }
    setSelectedSession(null);
    setMobileDetailOpen(false);
  };

  const handleSelectSession = (s: SessionWithLead) => {
    setSelectedSession(s);
    setMobileDetailOpen(true);
  };

  return (
    <div className="space-y-5">
      {/* ── Top Bar ── */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        {/* Filter Tabs */}
        <div className="flex gap-1.5 flex-wrap">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                filter === tab.value
                  ? "bg-orange-500/15 text-orange-400 border border-orange-500/25"
                  : "bg-white/[0.03] text-slate-400 border border-white/[0.06] hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              {tab.label}
              {statusCounts[tab.value] > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0 rounded-full ${
                    filter === tab.value
                      ? "bg-orange-500/20 text-orange-400"
                      : "bg-white/[0.06] text-slate-500"
                  }`}
                >
                  {statusCounts[tab.value]}
                </span>
              )}
            </button>
          ))}
        </div>

        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-medium rounded-xl text-sm transition-all shadow-lg shadow-orange-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Session</span>
        </button>
      </div>

      {/* ── Split View ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Session List */}
        <div
          className={`lg:col-span-3 space-y-2 ${
            mobileDetailOpen ? "hidden lg:block" : ""
          }`}
        >
          {sessions.length === 0 ? (
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl">
              <EmptyState
                icon={
                  <CalendarDays className="w-6 h-6 text-slate-500" />
                }
                title="No sessions found"
                description={
                  filter === "all"
                    ? "Sessions will appear here once created"
                    : `No ${filter} sessions`
                }
              />
            </div>
          ) : (
            sessions.map((s) => {
              const accent =
                statusAccent[s.status] ?? statusAccent.scheduled;
              const isSelected = selectedSession?.id === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => handleSelectSession(s)}
                  className={`w-full text-left flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl border-l-[3px] ${accent.bg} transition-all duration-200 cursor-pointer group ${
                    isSelected
                      ? "bg-white/[0.06] border border-white/[0.1] border-l-[3px]"
                      : "bg-white/[0.03] border border-white/[0.06] border-l-[3px] hover:bg-white/[0.05]"
                  }`}
                >
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500/20 to-teal-500/20 border border-white/[0.06] flex items-center justify-center text-xs font-bold text-orange-400 uppercase shrink-0">
                    {(s.lead_name ?? "?").charAt(0)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white truncate">
                        {s.lead_name ?? "Unknown"}
                      </p>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {formatDateTime(s.scheduled_time)} ·{" "}
                      {getDuration(s.scheduled_time, s.end_time)}
                    </p>
                  </div>

                  {/* Right side badges */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge status={s.status} variant="session" />
                    <Badge status={s.payment_status} variant="payment" />
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors hidden sm:block" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Detail Panel */}
        <div
          className={`lg:col-span-2 ${
            !mobileDetailOpen && !selectedSession ? "hidden lg:block" : ""
          } ${mobileDetailOpen ? "" : "hidden lg:block"}`}
        >
          {selectedSession ? (
            <SessionDetail
              session={selectedSession}
              onClose={() => {
                setSelectedSession(null);
                setMobileDetailOpen(false);
              }}
              onMarkCompleted={() =>
                handleStatusUpdate(selectedSession.id, "completed")
              }
              onCancel={() =>
                handleStatusUpdate(selectedSession.id, "cancelled")
              }
            />
          ) : (
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <CalendarDays className="w-8 h-8 text-slate-700 mx-auto mb-3" />
                <p className="text-sm text-slate-500">
                  Select a session to view details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {isAddModalOpen && (
        <AddSessionModal
          leads={leads}
          onClose={() => setIsAddModalOpen(false)}
          onSave={async (data) => {
            const res = await addSession(data);
            if (res.error) {
              toast.error("Failed to add session", { description: res.error });
            } else {
              toast.success("Session added successfully");
              setIsAddModalOpen(false);
              refetch();
            }
          }}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Session Detail Panel                                               */
/* ------------------------------------------------------------------ */

function SessionDetail({
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
    <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden sticky top-20">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-teal-500/20 border border-white/[0.06] flex items-center justify-center text-sm font-bold text-orange-400 uppercase">
            {(session.lead_name ?? "?").charAt(0)}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              {session.lead_name ?? "Unknown"}
            </h3>
            <p className="text-[11px] text-slate-500">Session Details</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer lg:hidden"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Status + Badges */}
      <div className="px-5 py-3 flex items-center gap-2 border-b border-white/[0.04]">
        <Badge status={session.status} variant="session" />
        <Badge status={session.payment_status} variant="payment" />
        {session.payment_amount != null && (
          <span className="text-sm font-semibold text-white ml-auto">
            ${session.payment_amount}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="p-5 space-y-4">
        {/* Schedule */}
        <div className="space-y-2.5">
          <DetailItem
            icon={<Clock className="w-3.5 h-3.5" />}
            label="Date & Time"
            value={formatDateTime(session.scheduled_time)}
          />
          <DetailItem
            icon={<Clock className="w-3.5 h-3.5" />}
            label="Duration"
            value={getDuration(session.scheduled_time, session.end_time)}
          />
          <DetailItem
            icon={<Clock className="w-3.5 h-3.5" />}
            label="Ends at"
            value={formatTime(session.end_time)}
          />
        </div>

        {/* Meeting link */}
        {session.meeting_link && (
          <a
            href={session.meeting_link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 hover:bg-teal-500/15 transition-colors"
          >
            <Video className="w-4 h-4" />
            <span className="text-xs font-medium">Join Meeting</span>
            <ExternalLink className="w-3 h-3 ml-auto" />
          </a>
        )}

        {/* Payment Info */}
        <div className="space-y-2.5 pt-2 border-t border-white/[0.04]">
          <DetailItem
            icon={<DollarSign className="w-3.5 h-3.5" />}
            label="Payment"
            value={
              <Badge status={session.payment_status} variant="payment" />
            }
          />
          {session.payment_amount != null && (
            <DetailItem
              icon={<DollarSign className="w-3.5 h-3.5" />}
              label="Amount"
              value={`$${session.payment_amount}`}
            />
          )}
          {session.invoice_sent_at && (
            <DetailItem
              icon={<Mail className="w-3.5 h-3.5" />}
              label="Invoice sent"
              value={formatDateTime(session.invoice_sent_at)}
            />
          )}
        </div>

        {/* Notes */}
        {session.session_notes && (
          <div className="pt-2 border-t border-white/[0.04]">
            <div className="flex items-center gap-1.5 mb-2 text-slate-500">
              <StickyNote className="w-3 h-3" />
              <span className="text-[10px] font-medium uppercase tracking-wider">
                Notes
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {session.session_notes}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      {session.status === "scheduled" && (
        <div className="px-5 pb-5 flex gap-2">
          <button
            onClick={onMarkCompleted}
            className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-xl transition-all text-xs cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Complete
          </button>
          <button
            onClick={onCancel}
            className="flex-1 flex items-center justify-center gap-1.5 bg-white/[0.04] hover:bg-red-500/15 text-slate-400 hover:text-red-400 font-medium py-2.5 rounded-xl transition-all text-xs border border-white/[0.06] hover:border-red-500/25 cursor-pointer"
          >
            <XCircle className="w-3.5 h-3.5" />
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Detail Item                                                        */
/* ------------------------------------------------------------------ */

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
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5 text-slate-500">
        {icon}
        <span className="text-[11px] font-medium">{label}</span>
      </div>
      <div className="text-xs text-white">{value}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Add Session Modal                                                  */
/* ------------------------------------------------------------------ */

function AddSessionModal({
  leads,
  onClose,
  onSave,
}: {
  leads: any[];
  onClose: () => void;
  onSave: (data: Partial<Session>) => Promise<void>;
}) {
  const [leadId, setLeadId] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [duration, setDuration] = useState("30");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadId || !scheduledTime) return;
    setLoading(true);
    const end_time = new Date(new Date(scheduledTime).getTime() + parseInt(duration) * 60000).toISOString();
    await onSave({
      lead_id: leadId,
      scheduled_time: new Date(scheduledTime).toISOString(),
      end_time,
      status: "scheduled",
    });
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-900 border border-white/[0.08] rounded-2xl w-full max-w-md p-6 shadow-2xl shadow-black/50 z-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white tracking-tight">Add New Session</h2>
          <button onClick={onClose} className="p-2 -mr-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Lead</label>
            <select
              value={leadId}
              onChange={(e) => setLeadId(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/40 appearance-none"
            >
              <option value="" disabled className="bg-slate-900">Select a lead...</option>
              {leads.map((l) => (
                <option key={l.id} value={l.id} className="bg-slate-900">
                  {l.name || l.email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Date & Time</label>
            <input
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/40"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Duration (minutes)</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/40 appearance-none"
            >
              <option value="15" className="bg-slate-900">15 minutes</option>
              <option value="30" className="bg-slate-900">30 minutes</option>
              <option value="45" className="bg-slate-900">45 minutes</option>
              <option value="60" className="bg-slate-900">1 hour</option>
              <option value="90" className="bg-slate-900">1.5 hours</option>
              <option value="120" className="bg-slate-900">2 hours</option>
            </select>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !leadId || !scheduledTime}
              className="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium text-white bg-orange-600 hover:bg-orange-500 shadow-lg shadow-orange-500/20 disabled:opacity-50 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : "Schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
