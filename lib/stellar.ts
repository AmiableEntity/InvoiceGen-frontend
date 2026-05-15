import {
  Networks,
  TransactionBuilder,
  Asset,
  Operation,
  Memo,
  BASE_FEE,
  Horizon,
} from "@stellar/stellar-sdk";
import type { PaymentCurrency } from "@/types";

// ─── Network Config ───────────────────────────────────────────────────────────

const NETWORK = process.env.NEXT_PUBLIC_STELLAR_NETWORK ?? "testnet";
const HORIZON_URL =
  process.env.NEXT_PUBLIC_HORIZON_URL ?? "https://horizon-testnet.stellar.org";

export const server = new Horizon.Server(HORIZON_URL);
export const networkPassphrase =
  NETWORK === "mainnet" ? Networks.PUBLIC : Networks.TESTNET;

// USDC asset on testnet (replace with mainnet issuer for production)
export const USDC_ASSET = new Asset(
  "USDC",
  NETWORK === "mainnet"
    ? "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN" // mainnet Circle USDC
    : "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5"  // testnet USDC
);

// ─── Build Payment Transaction ────────────────────────────────────────────────

/**
 * Builds an unsigned Stellar payment transaction.
 * The transaction is returned as XDR so Freighter can sign it.
 */
export async function buildPaymentTransaction(params: {
  senderPublicKey: string;
  recipientPublicKey: string;
  amount: string;
  currency: PaymentCurrency;
  invoiceId: string;
}): Promise<string> {
  const { senderPublicKey, recipientPublicKey, amount, currency, invoiceId } = params;

  // Load sender account from Horizon
  const account = await server.loadAccount(senderPublicKey);

  const asset = currency === "USDC" ? USDC_ASSET : Asset.native();

  const transaction = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase,
  })
    .addOperation(
      Operation.payment({
        destination: recipientPublicKey,
        asset,
        amount,
      })
    )
    // Attach invoice ID as memo so we can verify on-chain
    .addMemo(Memo.text(`INV:${invoiceId.slice(0, 20)}`))
    .setTimeout(300) // 5 minute window
    .build();

  return transaction.toXDR();
}

// ─── Verify Transaction ───────────────────────────────────────────────────────

/**
 * Verifies a Stellar transaction hash and checks it matches the expected payment.
 */
export async function verifyTransaction(params: {
  txHash: string;
  expectedRecipient: string;
  expectedAmount: string;
  currency: PaymentCurrency;
}): Promise<{ valid: boolean; error?: string }> {
  try {
    const tx = await server.transactions().transaction(params.txHash).call();

    // Check the transaction was successful
    if (!tx.successful) {
      return { valid: false, error: "Transaction was not successful" };
    }

    // Load operations for this transaction
    const ops = await server.operations().forTransaction(params.txHash).call();
    const paymentOp = ops.records.find(
      (op: { type: string }) => op.type === "payment"
    ) as {
      type: string;
      to: string;
      amount: string;
      asset_type: string;
      asset_code?: string;
    } | undefined;

    if (!paymentOp) {
      return { valid: false, error: "No payment operation found" };
    }

    // Verify recipient
    if (paymentOp.to !== params.expectedRecipient) {
      return { valid: false, error: "Payment recipient does not match" };
    }

    // Verify amount (allow small rounding tolerance)
    const paidAmount = parseFloat(paymentOp.amount);
    const expectedAmount = parseFloat(params.expectedAmount);
    if (Math.abs(paidAmount - expectedAmount) > 0.0001) {
      return { valid: false, error: "Payment amount does not match" };
    }

    // Verify currency
    if (params.currency === "XLM" && paymentOp.asset_type !== "native") {
      return { valid: false, error: "Expected XLM payment" };
    }
    if (params.currency === "USDC" && paymentOp.asset_code !== "USDC") {
      return { valid: false, error: "Expected USDC payment" };
    }

    return { valid: true };
  } catch (err) {
    return { valid: false, error: "Failed to fetch transaction from Horizon" };
  }
}

// ─── Get Account Balance ──────────────────────────────────────────────────────

export async function getAccountBalances(
  publicKey: string
): Promise<{ xlm: string; usdc: string }> {
  try {
    const account = await server.loadAccount(publicKey);
    let xlm = "0";
    let usdc = "0";

    for (const balance of account.balances) {
      if (balance.asset_type === "native") {
        xlm = parseFloat(balance.balance).toFixed(2);
      } else if (
        balance.asset_type !== "native" &&
        "asset_code" in balance &&
        balance.asset_code === "USDC"
      ) {
        usdc = parseFloat(balance.balance).toFixed(2);
      }
    }

    return { xlm, usdc };
  } catch {
    return { xlm: "0", usdc: "0" };
  }
}
