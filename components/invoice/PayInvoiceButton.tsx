"use client";

import { useState } from "react";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";
import { buildPaymentTransaction } from "@/lib/stellar";
import { invoiceApi } from "@/lib/api";
import type { Invoice } from "@/types";

interface Props {
  invoice: Invoice;
  onPaymentSuccess?: () => void;
}

type PaymentState = "idle" | "building" | "signing" | "submitting" | "verifying" | "success" | "error";

/**
 * Handles the full Stellar payment flow:
 * 1. Build unsigned transaction
 * 2. Sign with Freighter
 * 3. Submit to Horizon
 * 4. Verify with backend
 */
export function PayInvoiceButton({ invoice, onPaymentSuccess }: Props) {
  const { wallet, signTransaction } = useWallet();
  const [state, setState] = useState<PaymentState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handlePay = async () => {
    if (!wallet.isConnected || !wallet.publicKey) {
      setErrorMsg("Please connect your Freighter wallet first.");
      return;
    }

    setErrorMsg(null);

    try {
      // Step 1: Build the transaction XDR
      setState("building");
      const xdr = await buildPaymentTransaction({
        senderPublicKey: wallet.publicKey,
        recipientPublicKey: invoice.freelancerWallet,
        amount: invoice.total.toString(),
        currency: invoice.currency,
        invoiceId: invoice.id,
      });

      // Step 2: Sign with Freighter
      setState("signing");
      const signedXdr = await signTransaction(xdr);
      if (!signedXdr) {
        setState("error");
        setErrorMsg("Transaction signing was cancelled.");
        return;
      }

      // Step 3: Submit to Stellar Horizon
      setState("submitting");
      const { server } = await import("@/lib/stellar");
      const { TransactionBuilder } = await import("@stellar/stellar-sdk");
      const tx = TransactionBuilder.fromXDR(signedXdr, "TESTNET");
      const result = await server.submitTransaction(tx);
      const hash = result.hash;
      setTxHash(hash);

      // Step 4: Verify with backend
      setState("verifying");
      await invoiceApi.verifyPayment(invoice.id, hash);

      setState("success");
      onPaymentSuccess?.();
    } catch (err: unknown) {
      setState("error");
      const message = err instanceof Error ? err.message : "Payment failed. Please try again.";
      setErrorMsg(message);
    }
  };

  if (state === "success") {
    return (
      <div className="flex flex-col items-center gap-2 py-4">
        <CheckCircle className="h-10 w-10 text-green-500" />
        <p className="font-semibold text-green-600 dark:text-green-400">Payment Successful!</p>
        {txHash && (
          <a
            href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary underline"
          >
            View on Stellar Explorer
          </a>
        )}
      </div>
    );
  }

  const stateLabels: Record<PaymentState, string> = {
    idle: `Pay ${invoice.total} ${invoice.currency}`,
    building: "Building transaction...",
    signing: "Sign in Freighter...",
    submitting: "Submitting to Stellar...",
    verifying: "Verifying payment...",
    success: "Paid!",
    error: `Pay ${invoice.total} ${invoice.currency}`,
  };

  const isLoading = ["building", "signing", "submitting", "verifying"].includes(state);

  return (
    <div className="space-y-2">
      <Button
        variant="stellar"
        size="xl"
        className="w-full"
        onClick={handlePay}
        disabled={isLoading || invoice.status === "PAID"}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {stateLabels[state]}
      </Button>
      {errorMsg && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {errorMsg}
        </div>
      )}
    </div>
  );
}
