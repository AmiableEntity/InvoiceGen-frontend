import { cn, getStatusColor } from "@/lib/utils";
import type { InvoiceStatus } from "@/types";

interface Props {
  status: InvoiceStatus;
}

const statusLabels: Record<InvoiceStatus, string> = {
  DRAFT: "Draft",
  PENDING: "Pending",
  PAID: "Paid",
  OVERDUE: "Overdue",
  CANCELLED: "Cancelled",
};

export function InvoiceStatusBadge({ status }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        getStatusColor(status)
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
