"use client";

import { useState, useEffect, useCallback } from "react";
import { invoiceApi } from "@/lib/api";
import { mockInvoices } from "@/lib/mockData";
import type { Invoice } from "@/types";

const USE_MOCK = process.env.NEXT_PUBLIC_API_URL === undefined;

/**
 * Hook for fetching and managing invoices.
 * Falls back to mock data if API is not configured.
 */
export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (USE_MOCK) {
        // Simulate network delay for realistic UX
        await new Promise((r) => setTimeout(r, 600));
        setInvoices(mockInvoices);
        return;
      }

      const res = await invoiceApi.getAll();
      setInvoices(res.data.data);
    } catch (err) {
      setError("Failed to load invoices. Using demo data.");
      setInvoices(mockInvoices);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const deleteInvoice = useCallback(async (id: string) => {
    try {
      if (!USE_MOCK) await invoiceApi.delete(id);
      setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    } catch {
      setError("Failed to delete invoice.");
    }
  }, []);

  return { invoices, isLoading, error, refetch: fetchInvoices, deleteInvoice };
}
