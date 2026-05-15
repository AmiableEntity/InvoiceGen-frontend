import axios from "axios";
import type { Invoice, DashboardStats, ApiResponse, PaginatedResponse } from "@/types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// Attach auth token from localStorage on every request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Invoice API ──────────────────────────────────────────────────────────────

export const invoiceApi = {
  /** Fetch all invoices for the authenticated user */
  getAll: (page = 1, limit = 10) =>
    api.get<PaginatedResponse<Invoice>>(`/invoices?page=${page}&limit=${limit}`),

  /** Fetch a single invoice by ID (public — no auth needed) */
  getById: (id: string) =>
    api.get<ApiResponse<Invoice>>(`/invoices/${id}`),

  /** Create a new invoice */
  create: (data: Partial<Invoice>) =>
    api.post<ApiResponse<Invoice>>("/invoices", data),

  /** Update an existing invoice */
  update: (id: string, data: Partial<Invoice>) =>
    api.put<ApiResponse<Invoice>>(`/invoices/${id}`, data),

  /** Delete an invoice */
  delete: (id: string) =>
    api.delete<ApiResponse<null>>(`/invoices/${id}`),

  /** Verify payment for an invoice using a Stellar tx hash */
  verifyPayment: (id: string, txHash: string) =>
    api.post<ApiResponse<Invoice>>(`/invoices/${id}/verify-payment`, { txHash }),
};

// ─── Dashboard API ────────────────────────────────────────────────────────────

export const dashboardApi = {
  getStats: () =>
    api.get<ApiResponse<DashboardStats>>("/dashboard/stats"),
};

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const authApi = {
  /** Register or login with a Stellar wallet address */
  connectWallet: (walletAddress: string, signature?: string) =>
    api.post<ApiResponse<{ token: string; user: { id: string; walletAddress: string } }>>(
      "/auth/wallet",
      { walletAddress, signature }
    ),
};

export default api;
