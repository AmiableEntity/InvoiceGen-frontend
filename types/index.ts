// ─── Invoice Types ────────────────────────────────────────────────────────────

export type InvoiceStatus = "DRAFT" | "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";

export type PaymentCurrency = "XLM" | "USDC";

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  title: string;
  description?: string;
  status: InvoiceStatus;
  currency: PaymentCurrency;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  // Parties
  freelancerName: string;
  freelancerEmail: string;
  freelancerWallet: string;
  clientName: string;
  clientEmail: string;
  clientWallet?: string;
  // Stellar
  stellarTxHash?: string;
  contractInvoiceId?: string;
  shareableLink?: string;
}

// ─── User Types ───────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  walletAddress?: string;
  createdAt: string;
}

// ─── Wallet Types ─────────────────────────────────────────────────────────────

export interface WalletState {
  isConnected: boolean;
  publicKey: string | null;
  network: "testnet" | "mainnet" | null;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export interface DashboardStats {
  totalInvoices: number;
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  totalRevenue: number;
  recentInvoices: Invoice[];
}
