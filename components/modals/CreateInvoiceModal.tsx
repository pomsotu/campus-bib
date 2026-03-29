"use client";

import { useEffect, useState, FormEvent } from "react";
import { X, Check, User, CalendarDays, DollarSign, AlignLeft } from "lucide-react";
import { useLeads } from "@/lib/hooks/useLeads";
import { useInvoices } from "@/lib/hooks/useInvoices";
import type { Lead } from "@/types/database.types";

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string | undefined;
  onSuccess: () => void;
}

export default function CreateInvoiceModal({
  isOpen,
  onClose,
  clientId,
  onSuccess,
}: CreateInvoiceModalProps) {
  const { leads, loading: leadsLoading } = useLeads(clientId);
  const { addInvoice } = useInvoices(clientId);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [leadId, setLeadId] = useState("");

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleLeadChange = (id: string) => {
    setLeadId(id);
    if (id) {
      const selectedLead = leads.find((l) => l.id === id);
      if (selectedLead) {
        setClientName(selectedLead.name ?? "");
        setClientEmail(selectedLead.email ?? "");
      }
    }
  };

  if (!isOpen) return null;

  async function handleSubmit(e: FormEvent) {
    if (!description.trim()) {
      e.preventDefault();
      // Wait, in the schema description is just TEXT, not strictly NOT NULL.
      // Actually description is just text. Let's make it optional.
    }
    
    e.preventDefault();
    if (!clientName.trim() || !amount.trim() || !dueDate.trim()) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    const floatAmount = parseFloat(amount);
    if (isNaN(floatAmount) || floatAmount <= 0) {
      setErrorMsg("Please enter a valid positive amount.");
      setIsSubmitting(false);
      return;
    }

    const { error } = await addInvoice({
      client_name: clientName,
      client_email: clientEmail || null,
      amount: floatAmount,
      due_date: dueDate,
      description: description || null,
      lead_id: leadId || null,
      status: "pending",
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMsg(error);
    } else {
      // Reset form
      setClientName("");
      setClientEmail("");
      setAmount("");
      setDueDate("");
      setDescription("");
      setLeadId("");
      
      onSuccess();
      onClose();
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-slate-900 border-l border-white/[0.08] shadow-2xl z-50 overflow-y-auto animate-in slide-in-from-right duration-300">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.08] bg-slate-900/50 sticky top-0 backdrop-blur-md z-10">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Create Invoice
              </h2>
              <p className="text-sm text-slate-400">Bill a client for your services</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/[0.05] rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-6">
            {errorMsg && (
              <div className="p-3 text-sm font-medium text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                {errorMsg}
              </div>
            )}

            {/* Optional Lead Link */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <User className="w-4 h-4 opacity-50" />
                Link to Lead (Optional)
              </label>
              <select
                value={leadId}
                onChange={(e) => handleLeadChange(e.target.value)}
                className="w-full bg-slate-950 border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
                disabled={leadsLoading}
              >
                <option value="">-- Select an existing lead --</option>
                {leads.map((l: Lead) => (
                  <option key={l.id} value={l.id}>
                    {l.name || "Unnamed"} ({l.status})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <User className="w-4 h-4 opacity-50" />
                  Client Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-slate-950 border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  Client Email
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 opacity-50" />
                  Amount *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-white/[0.08] rounded-xl pl-8 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 opacity-50" />
                  Due Date *
                </label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  style={{ colorScheme: "dark" }}
                  className="w-full bg-slate-950 border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100"
                />
              </div>

              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <AlignLeft className="w-4 h-4 opacity-50" />
                  Description / Line Items
                </label>
                <textarea
                  placeholder="Web design services, 10 hours at $50/hr..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors resize-none"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-white/[0.08]">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-300 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-b from-blue-500 to-blue-600 border border-blue-400/30 text-white hover:from-blue-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4" /> Save Invoice
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}
