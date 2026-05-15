"use client";

import { useState, useEffect, useCallback } from "react";
import type { WalletState } from "@/types";

// Freighter API types (simplified)
interface FreighterAPI {
  isConnected: () => Promise<boolean>;
  getPublicKey: () => Promise<string>;
  getNetwork: () => Promise<string>;
  signTransaction: (xdr: string, opts?: { network?: string }) => Promise<string>;
}

declare global {
  interface Window {
    freighter?: FreighterAPI;
  }
}

/**
 * Hook for managing Freighter wallet connection state.
 * Freighter is a browser extension wallet for Stellar.
 */
export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    publicKey: null,
    network: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if Freighter is installed
  const isFreighterInstalled = typeof window !== "undefined" && !!window.freighter;

  // Restore wallet state from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem("stellar_public_key");
    if (savedKey) {
      setWallet({ isConnected: true, publicKey: savedKey, network: "testnet" });
    }
  }, []);

  /** Connect to Freighter wallet */
  const connect = useCallback(async () => {
    if (!isFreighterInstalled) {
      setError("Freighter wallet is not installed. Please install it from freighter.app");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const connected = await window.freighter!.isConnected();
      if (!connected) {
        setError("Please unlock your Freighter wallet and try again.");
        return;
      }

      const publicKey = await window.freighter!.getPublicKey();
      const network = await window.freighter!.getNetwork();

      const normalizedNetwork = network.toLowerCase().includes("test") ? "testnet" : "mainnet";

      setWallet({ isConnected: true, publicKey, network: normalizedNetwork });
      localStorage.setItem("stellar_public_key", publicKey);
    } catch (err) {
      setError("Failed to connect wallet. Please try again.");
      console.error("Wallet connect error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isFreighterInstalled]);

  /** Disconnect wallet */
  const disconnect = useCallback(() => {
    setWallet({ isConnected: false, publicKey: null, network: null });
    localStorage.removeItem("stellar_public_key");
    localStorage.removeItem("auth_token");
  }, []);

  /**
   * Sign a Stellar transaction XDR using Freighter.
   * Returns the signed XDR string.
   */
  const signTransaction = useCallback(
    async (xdr: string): Promise<string | null> => {
      if (!isFreighterInstalled || !wallet.isConnected) {
        setError("Wallet not connected");
        return null;
      }

      try {
        const signedXdr = await window.freighter!.signTransaction(xdr, {
          network: wallet.network === "mainnet" ? "PUBLIC" : "TESTNET",
        });
        return signedXdr;
      } catch (err) {
        setError("Transaction signing was rejected.");
        console.error("Sign transaction error:", err);
        return null;
      }
    },
    [isFreighterInstalled, wallet]
  );

  return {
    wallet,
    isLoading,
    error,
    isFreighterInstalled,
    connect,
    disconnect,
    signTransaction,
  };
}
