"use client";

import { useState } from "react";
import { useClient } from "@/lib/hooks/useClient";
import { useLeads } from "@/lib/hooks/useLeads";
import type { Lead, LeadStatus } from "@/types/database.types";

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

const pipelineColumns: { status: LeadStatus; label: string; color: string }[] = [
  { status: "new", label: "New", color: "blue" },
  { status: "qualified", label: "Qualified", color: "amber" },
  { status: "booked", label: "Booked", color: "indigo" },
  { status: "completed", label: "Completed", color: "emerald" },
  { status: "cold", label: "Cold", color: "slate" },
];

const statusOptions: LeadStatus[] = ["new", "qualified", "booked", "completed", "cold"];

const dotColors: Record<string, string> = {
  blue: "bg-blue-400",
  amber: "bg-amber-400",
  indigo: "bg-indigo-400",
  emerald: "bg-emerald-400",
  slate: "bg-slate-400",
};

const headerBgColors: Record<string, string> = {
  blue: "bg-blue-500/10",
  amber: "bg-amber-500/10",
  indigo: "bg-indigo-500/10",
  emerald: "bg-emerald-500/10",
  slate: "bg-slate-500/10",
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function LeadsPage() {
  const { client, loading: clientLoading, error: clientError } = useClient();
  const { leads, loading, error, updateLeadStatus, refetch } = useLeads(client?.id);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // ── Loading ──
  if (clientLoading || loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Leads</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 animate-pulse">
              <div className="h-4 w-20 bg-white/10 rounded mb-4" />
              <div className="h-24 bg-white/5 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Error ──
  if (clientError || error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-white">Leads</h1>
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-red-400">
          {clientError ?? error}
        </div>
      </div>
    );
  }

  // Group leads by status
  const grouped: Record<LeadStatus, Lead[]> = {
    new: [],
    qualified: [],
    booked: [],
    completed: [],
    cold: [],
  };
  for (const lead of leads) {
    if (grouped[lead.status]) {
      grouped[lead.status].push(lead);
    }
  }

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    await updateLeadStatus(leadId, newStatus);
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Leads</h1>
        <p className="text-sm text-slate-400">{leads.length} total leads</p>
      </div>

      {/* ── Pipeline Columns ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
        {pipelineColumns.map((col) => (
          <div
            key={col.status}
            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
          >
            {/* Column header */}
            <div
              className={`px-4 py-3 flex items-center justify-between ${headerBgColors[col.color]}`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${dotColors[col.color]}`} />
                <span className="text-sm font-medium text-white">{col.label}</span>
              </div>
              <span className="text-xs text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">
                {grouped[col.status].length}
              </span>
            </div>

            {/* Cards */}
            <div className="p-2 space-y-2 min-h-[80px]">
              {grouped[col.status].length === 0 ? (
                <p className="text-xs text-slate-600 text-center py-4">No leads</p>
              ) : (
                grouped[col.status].map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    expanded={expandedId === lead.id}
                    onToggle={() =>
                      setExpandedId((prev) => (prev === lead.id ? null : lead.id))
                    }
                    onStatusChange={(s) => handleStatusChange(lead.id, s)}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Lead Card                                                          */
/* ------------------------------------------------------------------ */

function LeadCard({
  lead,
  expanded,
  onToggle,
  onStatusChange,
}: {
  lead: Lead;
  expanded: boolean;
  onToggle: () => void;
  onStatusChange: (status: LeadStatus) => void;
}) {
  return (
    <div
      className="bg-white/5 border border-white/10 rounded-xl p-3 cursor-pointer hover:bg-white/10 transition-colors"
      onClick={onToggle}
    >
      <p className="text-sm font-medium text-white truncate">
        {lead.name ?? "Unnamed"}
      </p>
      <p className="text-xs text-slate-500 truncate mt-0.5">
        {lead.email ?? "No email"}
      </p>

      {expanded && (
        <div
          className="mt-3 pt-3 border-t border-white/10 space-y-2 text-xs"
          onClick={(e) => e.stopPropagation()}
        >
          {lead.service_requested && (
            <div>
              <span className="text-slate-500">Service: </span>
              <span className="text-slate-300">{lead.service_requested}</span>
            </div>
          )}
          {lead.budget_range && (
            <div>
              <span className="text-slate-500">Budget: </span>
              <span className="text-slate-300">{lead.budget_range}</span>
            </div>
          )}
          {lead.source && (
            <div>
              <span className="text-slate-500">Source: </span>
              <span className="text-slate-300">{lead.source}</span>
            </div>
          )}
          <div>
            <span className="text-slate-500">Created: </span>
            <span className="text-slate-300">{formatDate(lead.created_at)}</span>
          </div>
          {lead.notes && (
            <div>
              <span className="text-slate-500">Notes: </span>
              <span className="text-slate-300">{lead.notes}</span>
            </div>
          )}

          {/* Status dropdown */}
          <div className="pt-1">
            <label className="text-slate-500 block mb-1">Move to:</label>
            <select
              value={lead.status}
              onChange={(e) => onStatusChange(e.target.value as LeadStatus)}
              className="w-full bg-slate-800 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
