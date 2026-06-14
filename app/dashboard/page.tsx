"use client";

import Link from "next/link";
import { Plus, TrendingUp, FileText, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InvoiceCard } from "@/components/invoice/InvoiceCard";
import { useInvoices } from "@/hooks/useInvoices";
import { mockDashboardStats } from "@/lib/mockData";
import { formatAmount } from "@/lib/utils";

// Stat card component
function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${color}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { invoices, isLoading, deleteInvoice } = useInvoices();
  const stats = mockDashboardStats;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your invoices and track payments
          </p>
        </div>
        <Link href="/dashboard/invoices/new">
          <Button variant="stellar">
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={formatAmount(stats.totalRevenue, "USDC")}
          icon={TrendingUp}
          color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
        />
        <StatCard
          title="Total Invoices"
          value={stats.totalInvoices}
          icon={FileText}
          color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        />
        <StatCard
          title="Pending"
          value={stats.totalPending}
          icon={Clock}
          color="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
        />
        <StatCard
          title="Overdue"
          value={stats.totalOverdue}
          icon={AlertTriangle}
          color="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
        />
      </div>

      {/* Recent Invoices */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Invoices</h2>
          <Link href="/dashboard/invoices">
            <Button variant="ghost" size="sm">
              View all
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 rounded-2xl shimmer" />
            ))}
          </div>
        ) : invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border rounded-2xl bg-muted/20">
            <FileText className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <p className="font-semibold text-muted-foreground">No invoices yet</p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Create your first invoice to get started.
            </p>
            <Link href="/dashboard/invoices/new">
              <Button variant="stellar" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                New Invoice
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {invoices.slice(0, 6).map((invoice) => (
              <InvoiceCard key={invoice.id} invoice={invoice} onDelete={deleteInvoice} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
