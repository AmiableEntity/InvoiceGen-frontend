"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { invoiceApi } from "@/lib/api";
import { generateInvoiceNumber } from "@/lib/utils";
import { useWallet } from "@/hooks/useWallet";

// ─── Validation Schema ────────────────────────────────────────────────────────

const itemSchema = z.object({
  description: z.string().min(1, "Description required"),
  quantity: z.coerce.number().min(1, "Min 1"),
  unitPrice: z.coerce.number().min(0.01, "Min 0.01"),
});

const invoiceSchema = z.object({
  title: z.string().min(1, "Title required"),
  clientName: z.string().min(1, "Client name required"),
  clientEmail: z.string().email("Valid email required"),
  currency: z.enum(["XLM", "USDC"]),
  dueDate: z.string().min(1, "Due date required"),
  items: z.array(itemSchema).min(1, "Add at least one item"),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

interface Props {
  onSuccess?: () => void;
}

export function CreateInvoiceForm({ onSuccess }: Props) {
  const { wallet } = useWallet();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      currency: "USDC",
      items: [{ description: "", quantity: 1, unitPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const items = watch("items");

  // Calculate totals
  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    0
  );

  const onSubmit = async (data: InvoiceFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        ...data,
        invoiceNumber: generateInvoiceNumber(),
        freelancerWallet: wallet.publicKey ?? "",
        items: data.items.map((item, i) => ({
          id: `item_${i}`,
          ...item,
          total: item.quantity * item.unitPrice,
        })),
        subtotal,
        tax: 0,
        total: subtotal,
        status: "PENDING" as const,
      };

      await invoiceApi.create(payload);
      onSuccess?.();
    } catch (err) {
      setSubmitError("Failed to create invoice. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Invoice Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="title">Invoice Title</Label>
            <Input id="title" placeholder="e.g. Website Redesign Project" {...register("title")} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="clientName">Client Name</Label>
            <Input id="clientName" placeholder="Client or company name" {...register("clientName")} />
            {errors.clientName && (
              <p className="text-xs text-destructive">{errors.clientName.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="clientEmail">Client Email</Label>
            <Input id="clientEmail" type="email" placeholder="client@example.com" {...register("clientEmail")} />
            {errors.clientEmail && (
              <p className="text-xs text-destructive">{errors.clientEmail.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="currency">Payment Currency</Label>
            <select
              id="currency"
              {...register("currency")}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="USDC">USDC (Stable)</option>
              <option value="XLM">XLM (Stellar Lumens)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input id="dueDate" type="date" {...register("dueDate")} />
            {errors.dueDate && (
              <p className="text-xs text-destructive">{errors.dueDate.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Line Items */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Line Items</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ description: "", quantity: 1, unitPrice: 0 })}
          >
            <Plus className="mr-1 h-3.5 w-3.5" />
            Add Item
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Header row */}
          <div className="hidden sm:grid grid-cols-12 gap-2 text-xs font-medium text-muted-foreground px-1">
            <span className="col-span-6">Description</span>
            <span className="col-span-2 text-center">Qty</span>
            <span className="col-span-2 text-right">Unit Price</span>
            <span className="col-span-2 text-right">Total</span>
          </div>

          {fields.map((field, index) => {
            const qty = Number(items[index]?.quantity) || 0;
            const price = Number(items[index]?.unitPrice) || 0;
            const lineTotal = qty * price;

            return (
              <div key={field.id} className="grid grid-cols-12 gap-2 items-start">
                <div className="col-span-12 sm:col-span-6">
                  <Input
                    placeholder="Item description"
                    {...register(`items.${index}.description`)}
                  />
                  {errors.items?.[index]?.description && (
                    <p className="text-xs text-destructive mt-0.5">
                      {errors.items[index]?.description?.message}
                    </p>
                  )}
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <Input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    {...register(`items.${index}.quantity`)}
                  />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Price"
                    {...register(`items.${index}.unitPrice`)}
                  />
                </div>
                <div className="col-span-3 sm:col-span-2 flex items-center justify-end gap-1">
                  <span className="text-sm font-medium">${lineTotal.toFixed(2)}</span>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Totals */}
          <div className="border-t pt-3 flex justify-end">
            <div className="space-y-1 text-sm min-w-[200px]">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t pt-1">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {submitError && (
        <p className="text-sm text-destructive text-center">{submitError}</p>
      )}

      <Button type="submit" variant="stellar" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Invoice...
          </>
        ) : (
          "Create Invoice"
        )}
      </Button>
    </form>
  );
}
