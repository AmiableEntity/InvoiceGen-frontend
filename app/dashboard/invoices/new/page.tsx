"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CreateInvoiceForm } from "@/components/invoice/CreateInvoiceForm";
import { toast } from "sonner";

export default function NewInvoicePage() {
  const router = useRouter();

  const handleSuccess = () => {
    toast.success("Invoice created successfully!");
    router.push("/dashboard/invoices");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/invoices">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Create Invoice</h1>
          <p className="text-sm text-muted-foreground">Fill in the details below</p>
        </div>
      </div>

      <CreateInvoiceForm onSuccess={handleSuccess} />
    </div>
  );
}
