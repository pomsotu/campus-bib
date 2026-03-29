"use client";

import { useState } from "react";
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp,
  LucideIcon
} from "lucide-react";
import { useClient } from "@/lib/hooks/useClient";
import { useInvoices } from "@/lib/hooks/useInvoices";
import CreateInvoiceModal from "@/components/modals/CreateInvoiceModal";
import EmptyState from "@/components/ui/EmptyState";
import { SkeletonRow } from "@/components/ui/Skeleton";
import type { InvoiceStatus, Invoice } from "@/types/database.types";

export default function InvoicesPage() {
  const { client } = useClient();
  const { invoices, loading, stats, refetch, updateInvoiceStatus } = useInvoices(client?.id);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statusColors: Record<InvoiceStatus, string> = {
    paid: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    pending: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    overdue: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  };

  const statusIcons: Record<InvoiceStatus, LucideIcon> = {
    paid: CheckCircle2,
    pending: Clock,
    overdue: AlertCircle,
  };

  const filteredInvoices = invoices.filter((inv: Invoice) =>
    inv.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-in fade-in duration-500">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-semibold text-white tracking-tight flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-400 opacity-80" />
            Invoices
          </h1>
          <p className="text-slate-400 mt-1">Manage your billing and payments.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-b from-blue-500 to-blue-600 border border-blue-400/30 text-white hover:from-blue-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 shadow-[0_4px_20px_rgba(59,130,246,0.3)] hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          Create Invoice
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: "Total Revenue", value: `$${stats.totalRevenue.toFixed(2)}`, icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Outstanding", value: `$${stats.outstanding.toFixed(2)}`, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10" },
          { label: "Overdue", value: `$${stats.overdue.toFixed(2)}`, icon: AlertCircle, color: "text-rose-400", bg: "bg-rose-500/10" },
        ].map((stat, i) => (
          <div key={i} className="bg-white/[0.015] backdrop-blur-md border border-white/[0.05] rounded-3xl p-6 shadow-xl relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center ${stat.bg}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{loading ? "..." : stat.value}</p>
          </div>
        ))}
      </div>

      {/* Table section */}
      <div className="bg-white/[0.015] backdrop-blur-md border border-white/[0.05] rounded-3xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-white/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search invoices or clients..."
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-400 hover:text-white bg-white/[0.03] border border-white/[0.08] rounded-xl transition-all">
              <Filter className="w-4 h-4" /> Filter
            </button>
            <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-400 hover:text-white bg-white/[0.03] border border-white/[0.08] rounded-xl transition-all">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
             <div className="p-6 space-y-4">
                {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
             </div>
          ) : filteredInvoices.length === 0 ? (
             <div className="p-12">
               <EmptyState 
                 icon={<FileText className="w-8 h-8 opacity-30 text-blue-400" />} 
                 title={searchTerm ? "No results found" : "No invoices yet"} 
                 description={searchTerm ? "Try a different search term." : "Create your first invoice to get paid."} 
               />
             </div>
          ) : (
            <table className="w-full border-collapse relative">
              <thead>
                <tr className="border-b border-white/[0.04] bg-white/[0.01]">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Invoice ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {filteredInvoices.map((inv: Invoice) => {
                  const StatusIcon = statusIcons[inv.status as InvoiceStatus] ?? Clock;
                  return (
                    <tr key={inv.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="text-sm font-mono font-medium text-slate-300">{inv.invoice_number}</span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white uppercase shrink-0">
                            {inv.client_name.charAt(0)}
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-white block">{inv.client_name}</span>
                            {inv.client_email && (
                              <span className="text-xs text-slate-500">{inv.client_email}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="text-sm font-bold text-white">${Number(inv.amount).toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider ${statusColors[inv.status as InvoiceStatus] || statusColors.pending}`}>
                          <StatusIcon className="w-3 h-3" />
                          {inv.status}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="text-sm text-slate-400 font-medium">
                          {new Date(inv.due_date).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2 relative group/menu">
                          <button className="p-2 text-slate-500 hover:text-white bg-transparent hover:bg-white/[0.05] rounded-xl transition-colors peer">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                          
                          {/* Basic drop menu on hover for status updates */}
                          <div className="absolute right-0 top-full mt-1 w-36 bg-slate-800 border border-white/[0.08] rounded-xl shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-20 py-1">
                            {inv.status !== "paid" && (
                              <button 
                                onClick={() => updateInvoiceStatus(inv.id, "paid")}
                                className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-emerald-400 hover:bg-white/[0.04] flex items-center gap-2"
                              >
                                <CheckCircle2 className="w-4 h-4" /> Mark Paid
                              </button>
                            )}
                            {inv.status === "paid" && (
                               <button 
                                onClick={() => updateInvoiceStatus(inv.id, "pending")}
                                className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:text-amber-400 hover:bg-white/[0.04] flex items-center gap-2"
                              >
                                <Clock className="w-4 h-4" /> Mark Pending
                              </button>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <CreateInvoiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        clientId={client?.id}
        onSuccess={() => {
           refetch();
        }}
      />
    </div>
  );
}
