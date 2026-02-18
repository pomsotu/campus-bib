"use client";

import { useState } from "react";
import { useClient } from "@/lib/hooks/useClient";
import { useSessions, type SessionWithLead } from "@/lib/hooks/useSessions";
import type { SessionStatus } from "@/types/database.types";

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

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-500/20 text-blue-400",
  completed: "bg-emerald-500/20 text-emerald-400",
  cancelled: "bg-red-500/20 text-red-400",
  "no-show": "bg-orange-500/20 text-orange-400",
  rescheduled: "bg-amber-500/20 text-amber-400",
  pending: "bg-amber-500/20 text-amber-400",
  paid: "bg-emerald-500/20 text-emerald-400",
  overdue: "bg-red-500/20 text-red-400",
};

function Badge({ text }: { text: string }) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
        statusColors[text] ?? "bg-slate-500/20 text-slate-400"
      }`}
    >
      {text}
    </span>
  );
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

  // ── Loading ──
  if (clientLoading || loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Sessions</h1>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse">
          <div className="h-4 w-48 bg-white/10 rounded mb-4" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-white/5 rounded-xl mb-2" />
          ))}
        </div>
      </div>
    );
  }

  // ── Error ──
  if (clientError || error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Sessions</h1>
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-red-400">
          {clientError ?? error}
        </div>
      </div>
    );
  }

  const handleStatusUpdate = async (sessionId: string, newStatus: SessionStatus) => {
    await updateSessionStatus(sessionId, newStatus);
    setSelectedSession(null);
    refetch();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Sessions</h1>

      {/* ── Filter Tabs ── */}
      <div className="flex gap-2 flex-wrap">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
              filter === tab.value
                ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                : "bg-white/5 text-slate-400 border border-white/10 hover:text-white hover:bg-white/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Sessions Table ── */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        {sessions.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No sessions found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-slate-400">
                  <th className="px-4 py-3 font-medium">Lead</th>
                  <th className="px-4 py-3 font-medium">Scheduled</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Payment</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sessions.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => setSelectedSession(s)}
                  >
                    <td className="px-4 py-3 text-white font-medium">
                      {s.lead_name ?? "Unknown"}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {formatDateTime(s.scheduled_time)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge text={s.status} />
                    </td>
                    <td className="px-4 py-3">
                      <Badge text={s.payment_status} />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSession(s);
                        }}
                      >
                        View
                      </button>
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Session Details</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <Detail label="Lead" value={session.lead_name ?? "Unknown"} />
          <Detail label="Status" value={<Badge text={session.status} />} />
          <Detail label="Scheduled" value={formatDateTime(session.scheduled_time)} />
          <Detail label="End Time" value={formatDateTime(session.end_time)} />
          <Detail label="Payment" value={<Badge text={session.payment_status} />} />
          <Detail
            label="Amount"
            value={session.payment_amount != null ? `$${session.payment_amount}` : "—"}
          />
          {session.meeting_link && (
            <Detail
              label="Meeting"
              value={
                <a
                  href={session.meeting_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:underline truncate block"
                >
                  Join link
                </a>
              }
            />
          )}
          {session.session_notes && (
            <div className="col-span-2">
              <Detail label="Notes" value={session.session_notes} />
            </div>
          )}
        </div>

        {/* Actions */}
        {session.status === "scheduled" && (
          <div className="flex gap-3 pt-2">
            <button
              onClick={onMarkCompleted}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-xl transition-colors text-sm cursor-pointer"
            >
              Mark Completed
            </button>
            <button
              onClick={onCancel}
              className="flex-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-medium py-2.5 rounded-xl transition-colors text-sm border border-red-500/20 cursor-pointer"
            >
              Cancel Session
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-slate-500 text-xs mb-0.5">{label}</p>
      <div className="text-white">{value}</div>
    </div>
  );
}
