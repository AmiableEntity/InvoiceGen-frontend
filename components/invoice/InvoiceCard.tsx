"use client";

import Link from "next/link";
import { Copy, ExternalLink, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";
import { formatDate, formatAmount, getInvoiceShareUrl } from "@/lib/utils";
import type { Invoice } from "@/types";

interface Props {
  invoice: Invoice;
  onDelete?: (id: string) => void;
}

export function InvoiceCard({ invoice, onDelete }: Props) {
  const shareUrl = getInvoiceShareUrl(invoice.id);

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
  };

  return (
    <Card className="group hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          {/* Left: invoice info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-muted-foreground">
                {invoice.invoiceNumber}
              </span>
              <InvoiceStatusBadge status={invoice.status} />
            </div>
            <h3 className="font-semibold truncate">{invoice.title}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              To: {invoice.clientName}
            </p>
          </div>

          {/* Right: amount */}
          <div className="text-right shrink-0">
            <p className="font-bold text-lg">
              {formatAmount(invoice.total, invoice.currency)}
            </p>
            <p className="text-xs text-muted-foreground">
              Due {formatDate(invoice.dueDate)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t">
          <Link href={`/invoice/${invoice.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <ExternalLink className="mr-2 h-3.5 w-3.5" />
              View
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={copyLink} title="Copy shareable link">
            <Copy className="h-3.5 w-3.5" />
          </Button>
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(invoice.id)}
              className="text-destructive hover:text-destructive"
              title="Delete invoice"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
