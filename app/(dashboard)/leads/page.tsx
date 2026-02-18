"use client";

import { useState } from "react";
import { useClient } from "@/lib/hooks/useClient";
import { useLeads } from "@/lib/hooks/useLeads";
import Badge from "@/components/ui/Badge";
import { SkeletonCard } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import type { Lead, LeadStatus } from "@/types/database.types";
import { toast } from "sonner";
import {
  Users,
  Search,
  Calendar,
  Mail,
  Briefcase,
  Wallet,
  MessageSquare,
  Globe,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const pipelineColumns: { status: LeadStatus; label: string; gradient: string; dot: string }[] = [
  { status: "new",       label: "New",       gradient: "from-blue-500/20 to-blue-600/10",   dot: "bg-blue-400" },
  { status: "qualified", label: "Qualified", gradient: "from-amber-500/20 to-amber-600/10", dot: "bg-amber-400" },
  { status: "booked",    label: "Booked",    gradient: "from-indigo-500/20 to-indigo-600/10", dot: "bg-indigo-400" },
  { status: "completed", label: "Completed", gradient: "from-emerald-500/20 to-emerald-600/10", dot: "bg-emerald-400" },
  { status: "cold",      label: "Cold",      gradient: "from-slate-500/20 to-slate-600/10", dot: "bg-slate-400" },
];

const statusOptions: LeadStatus[] = ["new", "qualified", "booked", "completed", "cold"];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function LeadsPage() {
  const { client, loading: clientLoading, error: clientError } = useClient();
  const { leads, loading, error, updateLeadStatus, refetch } = useLeads(client?.id);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  /* ── Loading ── */
  if (clientLoading || loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-white tracking-tight">Leads</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <SkeletonCard key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (clientError || error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-white tracking-tight">Leads</h1>
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
          <p className="text-red-400 text-sm font-medium">Failed to load leads</p>
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

  /* ── Filter by search ── */
  const filtered = searchQuery
    ? leads.filter(
        (l) =>
          l.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.email?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : leads;

  /* ── Group leads by status ── */
  const grouped: Record<LeadStatus, Lead[]> = {
    new: [], qualified: [], booked: [], completed: [], cold: [],
  };
  for (const lead of filtered) {
    if (grouped[lead.status]) grouped[lead.status].push(lead);
  }

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    const { error: err } = await updateLeadStatus(leadId, newStatus);
    if (err) {
      toast.error("Failed to update lead", { description: err });
    } else {
      toast.success(`Lead moved to ${newStatus}`);
      refetch();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Leads</h1>
          <p className="text-sm text-slate-500">{leads.length} total leads</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search leads…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/30 transition-all"
          />
        </div>
      </div>

      {/* ── Pipeline Columns ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
        {pipelineColumns.map((col) => (
          <div
            key={col.status}
            className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden"
          >
            {/* Column header */}
            <div className={`px-4 py-3 bg-gradient-to-r ${col.gradient}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                  <span className="text-sm font-semibold text-white">{col.label}</span>
                </div>
                <span className="text-[11px] text-slate-400 bg-white/[0.06] px-2 py-0.5 rounded-full font-medium">
                  {grouped[col.status].length}
                </span>
              </div>
            </div>

            {/* Cards */}
            <div className="p-2 space-y-2 min-h-[100px]">
              {grouped[col.status].length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Users className="w-5 h-5 text-slate-600 mb-2" />
                  <p className="text-xs text-slate-600">No leads</p>
                </div>
              ) : (
                grouped[col.status].map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    expanded={expandedId === lead.id}
                    onToggle={() => setExpandedId((prev) => (prev === lead.id ? null : lead.id))}
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
      className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 cursor-pointer hover:bg-white/[0.06] hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5 transition-all duration-200"
      onClick={onToggle}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500/20 to-teal-500/20 border border-white/[0.06] flex items-center justify-center text-[11px] font-bold text-orange-400 uppercase shrink-0">
            {(lead.name ?? "?").charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{lead.name ?? "Unnamed"}</p>
            <p className="text-[11px] text-slate-500 truncate">{lead.email ?? "No email"}</p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-1" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-1" />
        )}
      </div>

      {expanded && (
        <div
          className="mt-3 pt-3 border-t border-white/[0.06] space-y-2.5 expand-enter"
          onClick={(e) => e.stopPropagation()}
        >
          {lead.service_requested && (
            <DetailRow icon={<Briefcase className="w-3 h-3" />} label="Service" value={lead.service_requested} />
          )}
          {lead.budget_range && (
            <DetailRow icon={<Wallet className="w-3 h-3" />} label="Budget" value={lead.budget_range} />
          )}
          {lead.source && (
            <DetailRow icon={<Globe className="w-3 h-3" />} label="Source" value={lead.source} />
          )}
          <DetailRow icon={<Calendar className="w-3 h-3" />} label="Created" value={formatDate(lead.created_at)} />
          {lead.email && (
            <DetailRow icon={<Mail className="w-3 h-3" />} label="Email" value={lead.email} />
          )}
          {lead.notes && (
            <DetailRow icon={<MessageSquare className="w-3 h-3" />} label="Notes" value={lead.notes} />
          )}

          {/* Status dropdown */}
          <div className="pt-1">
            <label className="text-[11px] text-slate-500 font-medium block mb-1.5">Move to:</label>
            <select
              value={lead.status}
              onChange={(e) => onStatusChange(e.target.value as LeadStatus)}
              className="w-full bg-slate-800 border border-white/[0.08] rounded-lg px-2.5 py-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-orange-500/50 cursor-pointer appearance-none"
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

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2 text-xs">
      <div className="text-slate-500 mt-0.5 shrink-0">{icon}</div>
      <div>
        <span className="text-slate-500">{label}: </span>
        <span className="text-slate-300">{value}</span>
      </div>
    </div>
  );
}
