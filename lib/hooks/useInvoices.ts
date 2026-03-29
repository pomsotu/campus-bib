"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase";
import type { Invoice, InvoiceStatus } from "@/types/database.types";

export function useInvoices(
  clientId: string | undefined,
  statusFilter?: InvoiceStatus
) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchInvoices = useCallback(async () => {
    if (!clientId) return;
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("invoices")
        .select("*")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });

      if (statusFilter) {
        query = query.eq("status", statusFilter);
      }

      const { data, error: dbError } = await query;
      if (dbError) throw dbError;

      setInvoices((data as Invoice[]) ?? []);
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? (err as { message: string }).message
          : "Failed to fetch invoices";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [clientId, statusFilter, supabase]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const updateInvoiceStatus = useCallback(
    async (invoiceId: string, newStatus: InvoiceStatus) => {
      try {
        const updates: Partial<Invoice> = {
          status: newStatus,
          updated_at: new Date().toISOString(),
        };

        if (newStatus === "paid") {
          updates.paid_at = new Date().toISOString();
        } else if (newStatus === "pending") {
          updates.paid_at = null;
        }

        const { error: dbError } = await supabase
          .from("invoices")
          .update(updates)
          .eq("id", invoiceId);

        if (dbError) throw dbError;

        // Optimistic update
        setInvoices((prev) =>
          prev.map((inv) =>
            inv.id === invoiceId ? { ...inv, ...updates } : inv
          )
        );

        return { error: null };
      } catch (err: unknown) {
        const message =
          err && typeof err === "object" && "message" in err
            ? (err as { message: string }).message
            : "Failed to update invoice";
        return { error: message };
      }
    },
    [supabase]
  );

  const addInvoice = useCallback(
    async (invoiceData: Partial<Invoice>) => {
      if (!clientId) return { error: "No client ID" };
      try {
        // Generate a simple invoice number e.g. INV-1704289321
        const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
        
        const { data, error: dbError } = await supabase
          .from("invoices")
          .insert([
            {
              ...invoiceData,
              client_id: clientId,
              invoice_number: invoiceNumber,
              status: invoiceData.status || "pending",
            },
          ])
          .select()
          .single();

        if (dbError) throw dbError;

        if (data) {
          setInvoices((prev) => [data as Invoice, ...prev]);
        }
        return { data, error: null };
      } catch (err: unknown) {
        const message =
          err && typeof err === "object" && "message" in err
            ? (err as { message: string }).message
            : "Failed to create invoice";
        return { error: message, data: null };
      }
    },
    [clientId, supabase]
  );

  const stats = useMemo(() => {
    let totalRevenue = 0;
    let outstanding = 0;
    let overdue = 0;

    invoices.forEach((inv) => {
      const amount = Number(inv.amount);
      if (inv.status === "paid") {
        totalRevenue += amount;
      } else if (inv.status === "pending") {
        outstanding += amount;
      } else if (inv.status === "overdue") {
        overdue += amount;
        outstanding += amount; // overdue is also outstanding technically, but let's keep them separate for the UI boxes or combined as needed. Usually, 'outstanding' = pending + overdue. To match the plan: 'overdue' is separate.
      }
    });

    return { totalRevenue, outstanding, overdue };
  }, [invoices]);

  return { invoices, loading, error, stats, refetch: fetchInvoices, updateInvoiceStatus, addInvoice };
}
