"use client";

import { useState, useMemo } from "react";
import { useClient } from "@/lib/hooks/useClient";
import { useLeads } from "@/lib/hooks/useLeads";
import Badge from "@/components/ui/Badge";
import { SkeletonCard } from "@/components/ui/Skeleton";
import type { Lead, LeadStatus } from "@/types/database.types";
import { toast } from "sonner";
import {
  Search,
  Filter,
  UserPlus,
  Phone,
  Globe,
  ChevronDown,
  ChevronUp,
  Tag,
  X,
  MessageSquare,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

function formatDate(iso: string) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const pipelineColumns: {
  status: LeadStatus;
  label: string;
  color: string;
  dotColor: string;
  headerBg: string;
  columnBg: string;
}[] = [
  {
    status: "new",
    label: "New",
    color: "text-blue-400",
    dotColor: "bg-blue-400",
    headerBg: "bg-blue-500/10",
    columnBg: "bg-blue-500/[0.02]",
  },
  {
    status: "qualified",
    label: "Qualified",
    color: "text-emerald-400",
    dotColor: "bg-emerald-400",
    headerBg: "bg-emerald-500/10",
    columnBg: "bg-emerald-500/[0.02]",
  },
  {
    status: "booked",
    label: "Booked",
    color: "text-orange-400",
    dotColor: "bg-orange-400",
    headerBg: "bg-orange-500/10",
    columnBg: "bg-orange-500/[0.02]",
  },
  {
    status: "completed",
    label: "Completed",
    color: "text-teal-400",
    dotColor: "bg-teal-400",
    headerBg: "bg-teal-500/10",
    columnBg: "bg-teal-500/[0.02]",
  },
  {
    status: "cold",
    label: "Cold",
    color: "text-slate-400",
    dotColor: "bg-slate-500",
    headerBg: "bg-slate-500/10",
    columnBg: "bg-slate-500/[0.02]",
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function LeadsPage() {
  const { client, loading: clientLoading } = useClient();
  const {
    leads,
    loading: leadsLoading,
    updateLeadStatus,
    addLead,
  } = useLeads(client?.id);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedLead, setExpandedLead] = useState<string | null>(null);
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  const [dragOverCol, setDragOverCol] = useState<LeadStatus | null>(null);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filterService, setFilterService] = useState<string>("all");

  const uniqueServices = useMemo(
    () => Array.from(new Set(leads.map((l) => l.service_requested).filter(Boolean))),
    [leads]
  );

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || 
        l.name?.toLowerCase().includes(q) ||
        l.email?.toLowerCase().includes(q) ||
        l.service_requested?.toLowerCase().includes(q);
      const matchesService = filterService === "all" || l.service_requested === filterService;
      return matchesSearch && matchesService;
    });
  }, [leads, searchQuery, filterService]);

  const groupedLeads = useMemo(() => {
    const groups: Record<LeadStatus, Lead[]> = {
      new: [],
      qualified: [],
      booked: [],
      completed: [],
      cold: [],
    };
    for (const lead of filteredLeads) {
      groups[lead.status]?.push(lead);
    }
    return groups;
  }, [filteredLeads]);

  const isLoading = clientLoading || leadsLoading;

  const handleStatusChange = async (
    leadId: string,
    newStatus: LeadStatus
  ) => {
    await updateLeadStatus(leadId, newStatus);
  };

  const handleDragStart = (lead: Lead) => {
    setDraggedLead(lead);
  };

  const handleDragOver = (e: React.DragEvent, status: LeadStatus) => {
    e.preventDefault();
    setDragOverCol(status);
  };

  const handleDragLeave = () => {
    setDragOverCol(null);
  };

  const handleDrop = (status: LeadStatus) => {
    if (draggedLead && draggedLead.status !== status) {
      handleStatusChange(draggedLead.id, status);
    }
    setDraggedLead(null);
    setDragOverCol(null);
  };

  return (
    <div className="space-y-5 h-full flex flex-col">
      {/* ── Header Bar ── */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/40 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex rounded-xl overflow-hidden border border-white/[0.06]">
            <button
              onClick={() => setViewMode("kanban")}
              className={`px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                viewMode === "kanban"
                  ? "bg-white/[0.06] text-white"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Board
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                viewMode === "list"
                  ? "bg-white/[0.06] text-white"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              List
            </button>
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm transition-all cursor-pointer ${showFilters ? 'text-orange-400 border-orange-500/30' : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'}`}>
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white font-medium rounded-xl text-sm transition-all shadow-lg shadow-orange-500/20 cursor-pointer">
            <UserPlus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* ── Filters Row ── */}
      {showFilters && (
        <div className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl animate-in fade-in slide-in-from-top-2">
          <label className="text-xs font-medium text-slate-400">Service:</label>
          <select
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
            className="px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30 appearance-none"
          >
            <option value="all" className="bg-slate-900">All Services</option>
            {uniqueServices.map((s) => (
              <option key={s as string} value={s as string} className="bg-slate-900">{s as string}</option>
            ))}
          </select>
          {filterService !== "all" && (
            <button
              onClick={() => setFilterService("all")}
              className="text-xs text-slate-500 hover:text-white transition-colors cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* ── Stats Summary ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs text-slate-500">
          {filteredLeads.length} leads
          {searchQuery && ` matching "${searchQuery}"`}
        </span>
        <span className="text-slate-700">·</span>
        {pipelineColumns.map((col) => (
          <span key={col.status} className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${col.dotColor}`} />
            <span className="text-xs text-slate-600">
              {groupedLeads[col.status].length}
            </span>
          </span>
        ))}
      </div>

      {/* ── Board / List ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 flex-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-3">
              <SkeletonCard className="h-10" />
              <SkeletonCard className="h-32" />
              <SkeletonCard className="h-32" />
            </div>
          ))}
        </div>
      ) : viewMode === "kanban" ? (
        /* ── Kanban Board ── */
        <div className="flex-1 overflow-x-auto pb-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 min-w-0">
            {pipelineColumns.map((col) => {
              const columnLeads = groupedLeads[col.status];
              const isDragOver = dragOverCol === col.status;
              return (
                <div
                  key={col.status}
                  className={`rounded-2xl border ${
                    isDragOver
                      ? "border-white/[0.15] ring-1 ring-white/[0.08]"
                      : "border-white/[0.06]"
                  } ${col.columnBg} min-h-[250px] flex flex-col transition-all`}
                  onDragOver={(e) => handleDragOver(e, col.status)}
                  onDragLeave={handleDragLeave}
                  onDrop={() => handleDrop(col.status)}
                >
                  {/* Column header */}
                  <div
                    className={`flex items-center justify-between px-3.5 py-2.5 ${col.headerBg} rounded-t-2xl border-b border-white/[0.06]`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${col.dotColor}`}
                      />
                      <span
                        className={`text-xs font-semibold ${col.color}`}
                      >
                        {col.label}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium bg-white/[0.06] px-1.5 py-0.5 rounded-full tabular-nums">
                      {columnLeads.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <div className="p-2 flex-1 space-y-2 overflow-y-auto max-h-[calc(100vh-340px)]">
                    {columnLeads.length === 0 ? (
                      <div className="flex items-center justify-center py-8 text-center">
                        <p className="text-[11px] text-slate-600">
                          No leads
                        </p>
                      </div>
                    ) : (
                      columnLeads.map((lead) => (
                        <LeadCard
                          key={lead.id}
                          lead={lead}
                          expanded={expandedLead === lead.id}
                          onToggle={() =>
                            setExpandedLead(
                              expandedLead === lead.id ? null : lead.id
                            )
                          }
                          onStatusChange={(s) =>
                            handleStatusChange(lead.id, s)
                          }
                          onDragStart={() => handleDragStart(lead)}
                        />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ── List View ── */
        <div className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
          {/* Table header */}
          <div className="hidden sm:grid sm:grid-cols-[1fr_1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-white/[0.06] text-xs font-medium text-slate-500">
            <span>Name</span>
            <span>Contact</span>
            <span>Service</span>
            <span>Status</span>
            <span>Added</span>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {filteredLeads.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-sm text-slate-600">No leads found</p>
              </div>
            ) : (
              filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex flex-col sm:grid sm:grid-cols-[1fr_1fr_auto_auto_auto] gap-2 sm:gap-4 sm:items-center px-5 py-3 hover:bg-white/[0.02] transition-colors"
                >
                  {/* Name */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500/20 to-teal-500/20 border border-white/[0.06] flex items-center justify-center text-[10px] font-bold text-orange-400 uppercase shrink-0">
                      {(lead.name ?? "?").charAt(0)}
                    </div>
                    <p className="text-sm font-medium text-white truncate">
                      {lead.name ?? "Unnamed"}
                    </p>
                  </div>
                  {/* Contact */}
                  <p className="text-xs text-slate-500 truncate">
                    {lead.email ?? "No email"}
                  </p>
                  {/* Service */}
                  <span className="text-[10px] text-slate-400 bg-white/[0.04] px-2 py-0.5 rounded-full truncate max-w-[120px]">
                    {lead.service_requested ?? "—"}
                  </span>
                  {/* Status */}
                  <Badge status={lead.status} variant="lead" />
                  {/* Added */}
                  <span className="text-[10px] text-slate-600 tabular-nums">
                    {formatDate(lead.created_at)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <AddLeadModal
          onClose={() => setIsAddModalOpen(false)}
          onSave={async (data: Partial<Lead>) => {
            const res = await addLead(data);
            if (res.error) {
              toast.error("Failed to add lead", { description: res.error });
            } else {
              toast.success("Lead added successfully");
              setIsAddModalOpen(false);
            }
          }}
        />
      )}
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
  onDragStart,
}: {
  lead: Lead;
  expanded: boolean;
  onToggle: () => void;
  onStatusChange: (status: LeadStatus) => void;
  onDragStart: () => void;
}) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 hover:bg-white/[0.05] hover:border-white/[0.1] transition-all cursor-grab active:cursor-grabbing group"
    >
      {/* Top row */}
      <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500/20 to-teal-500/20 border border-white/[0.06] flex items-center justify-center text-[10px] font-bold text-orange-400 uppercase shrink-0">
          {(lead.name ?? "?").charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-white truncate">
            {lead.name ?? "Unnamed"}
          </p>
          <p className="text-[10px] text-slate-500 truncate">
            {lead.email ?? "No email"}
          </p>
        </div>
        <button
          onClick={onToggle}
          className="text-slate-600 hover:text-slate-400 cursor-pointer p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {expanded ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
        </button>
      </div>

      {/* Tags row */}
      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
        {lead.service_requested && (
          <span className="inline-flex items-center gap-1 text-[9px] font-medium text-slate-400 bg-white/[0.04] px-1.5 py-0.5 rounded-full">
            <Tag className="w-2 h-2" />
            {lead.service_requested}
          </span>
        )}
        {lead.source && (
          <span className="inline-flex items-center gap-1 text-[9px] font-medium text-slate-500 bg-white/[0.03] px-1.5 py-0.5 rounded-full">
            <Globe className="w-2 h-2" />
            {lead.source}
          </span>
        )}
        <span className="text-[9px] text-slate-600 ml-auto">
          {formatDate(lead.created_at)}
        </span>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="mt-2.5 pt-2.5 border-t border-white/[0.06] space-y-2">
          {lead.phone && (
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <Phone className="w-3 h-3 text-slate-500" />
              <span>{lead.phone}</span>
            </div>
          )}
          {lead.notes && (
            <div className="flex items-start gap-2 text-[11px] text-slate-500">
              <MessageSquare className="w-3 h-3 text-slate-600 mt-0.5 shrink-0" />
              <p className="line-clamp-2">{lead.notes}</p>
            </div>
          )}

          {/* Status change buttons */}
          <div className="flex flex-wrap gap-1 mt-1">
            {pipelineColumns
              .filter((col) => col.status !== lead.status)
              .map((col) => (
                <button
                  key={col.status}
                  onClick={() => onStatusChange(col.status)}
                  className={`text-[9px] font-medium px-1.5 py-0.5 rounded-md border border-white/[0.06] hover:bg-white/[0.05] transition-colors cursor-pointer ${col.color}`}
                >
                  → {col.label}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Add Lead Modal                                                     */
/* ------------------------------------------------------------------ */

function AddLeadModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (data: Partial<Lead>) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [source, setSource] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setLoading(true);
    await onSave({
      name,
      email,
      phone: phone || null,
      service_requested: service || null,
      source: source || null,
      notes: notes || null,
      status: "new",
    });
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-900 border border-white/[0.08] rounded-2xl w-full max-w-md p-6 shadow-2xl shadow-black/50 z-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white tracking-tight">Add New Lead</h2>
          <button onClick={onClose} className="p-2 -mr-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors cursor-pointer">
             <span className="w-4 h-4 block text-center leading-none">×</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Name *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Email *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Phone</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Source</label>
              <input type="text" value={source} onChange={(e) => setSource(e.target.value)} placeholder="e.g. Website, Referral" className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Service Requested</label>
            <input type="text" value={service} onChange={(e) => setService(e.target.value)} className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500/30 resize-none" />
          </div>

          <div className="pt-2 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-colors cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={loading || !name || !email} className="flex-1 py-2.5 px-4 rounded-xl text-sm font-medium text-white bg-orange-600 hover:bg-orange-500 shadow-lg shadow-orange-500/20 disabled:opacity-50 transition-colors cursor-pointer flex items-center justify-center gap-2">
              {loading ? <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : "Add Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
