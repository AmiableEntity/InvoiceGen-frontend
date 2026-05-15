"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Zap, Copy, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InvoiceStatusBadge } from "@/components/invoice/InvoiceStatusBadge";
import { PayInvoiceButton } from "@/components/invoice/PayInvoiceButton";
import { WalletButton } from "@/components/wallet/WalletButton";
import { invoiceApi } from "@/lib/api";
import { mockInvoices } from "@/lib/mockData";
import { formatDate, formatAmount, truncateAddress } from "@/lib/utils";
import type { Invoice } from "@/types";

export default function InvoicePublicPage() {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await invoiceApi.getById(id);
        setInvoice(res.data.data);
      } catch {
        // Fall back to mock data for demo
        const mock = mockInvoices.find((inv) => inv.id === id) ?? mockInvoices[0];
        setInvoice(mock);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <p className="text-xl font-semibold">Invoice not found</p>
          <Link href="/" className="text-primary text-sm underline mt-2 block">
            Go home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      {/* Top bar */}
      <div className="max-w-2xl mx-auto flex items-center justify-between mb-6">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-stellar-blue to-stellar-purple flex items-center justify-center">
            <Zap className="h-3.5 w-3.5 text-white" />
          </div>
          StellarInvoice
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={copyLink}>
            {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy Link"}
          </Button>
          <WalletButton />
        </div>
      </div>

      {/* Invoice Card */}
      <Card className="max-w-2xl mx-auto shadow-lg">
        <CardContent className="p-8 space-y-8">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-mono text-muted-foreground">{invoice.invoiceNumber}</p>
              <h1 className="text-2xl font-bold mt-1">{invoice.title}</h1>
              {invoice.description && (
                <p className="text-muted-foreground text-sm mt-1">{invoice.description}</p>
              )}
            </div>
            <InvoiceStatusBadge status={invoice.status} />
          </div>

          {/* Parties */}
          <div className="grid sm:grid-cols-2 gap-6 p-4 rounded-xl bg-muted/50">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                From
              </p>
              <p className="font-semibold">{invoice.freelancerName}</p>
              <p className="text-sm text-muted-foreground">{invoice.freelancerEmail}</p>
              <p className="text-xs font-mono text-muted-foreground mt-1">
                {truncateAddress(invoice.freelancerWallet, 8)}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                To
              </p>
              <p className="font-semibold">{invoice.clientName}</p>
              <p className="text-sm text-muted-foreground">{invoice.clientEmail}</p>
            </div>
          </div>

          {/* Dates */}
          <div className="flex gap-6 text-sm">
            <div>
              <p className="text-muted-foreground">Created</p>
              <p className="font-medium">{formatDate(invoice.createdAt)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Due Date</p>
              <p className="font-medium">{formatDate(invoice.dueDate)}</p>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <div className="grid grid-cols-12 text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 px-1">
              <span className="col-span-6">Description</span>
              <span className="col-span-2 text-center">Qty</span>
              <span className="col-span-2 text-right">Price</span>
              <span className="col-span-2 text-right">Total</span>
            </div>
            <div className="space-y-2">
              {invoice.items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 text-sm py-2 border-b last:border-0"
                >
                  <span className="col-span-6">{item.description}</span>
                  <span className="col-span-2 text-center text-muted-foreground">{item.quantity}</span>
                  <span className="col-span-2 text-right text-muted-foreground">
                    ${item.unitPrice.toFixed(2)}
                  </span>
                  <span className="col-span-2 text-right font-medium">
                    ${item.total.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-end mt-4">
              <div className="space-y-1 min-w-[200px]">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${invoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>{formatAmount(invoice.total, invoice.currency)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment section */}
          {invoice.status !== "PAID" && (
            <div className="border-t pt-6">
              <p className="text-sm text-muted-foreground mb-4 text-center">
                Connect your Freighter wallet to pay this invoice on the Stellar network.
              </p>
              <PayInvoiceButton
                invoice={invoice}
                onPaymentSuccess={() => setInvoice({ ...invoice, status: "PAID" })}
              />
            </div>
          )}

          {/* Paid confirmation */}
          {invoice.status === "PAID" && invoice.stellarTxHash && (
            <div className="border-t pt-6 text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">This invoice has been paid</span>
              </div>
              <a
                href={`https://stellar.expert/explorer/testnet/tx/${invoice.stellarTxHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary underline"
              >
                View transaction on Stellar Explorer
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground mt-6">
        Powered by{" "}
        <a href="https://stellar.org" target="_blank" rel="noopener noreferrer" className="underline">
          Stellar Network
        </a>
      </p>
    </div>
  );
}
