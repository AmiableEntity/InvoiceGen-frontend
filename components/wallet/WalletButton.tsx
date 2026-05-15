"use client";

import { Wallet, LogOut, ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";
import { truncateAddress } from "@/lib/utils";

/**
 * Wallet connect/disconnect button.
 * Shows truncated public key when connected.
 */
export function WalletButton() {
  const { wallet, isLoading, error, isFreighterInstalled, connect, disconnect } = useWallet();

  // Freighter not installed — link to install page
  if (!isFreighterInstalled) {
    return (
      <a
        href="https://www.freighter.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <AlertCircle className="h-4 w-4" />
        Install Freighter
        <ExternalLink className="h-3 w-3" />
      </a>
    );
  }

  // Connected state
  if (wallet.isConnected && wallet.publicKey) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="font-mono text-xs">{truncateAddress(wallet.publicKey)}</span>
          <span className="text-xs text-muted-foreground capitalize">{wallet.network}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={disconnect} title="Disconnect wallet">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  // Disconnected state
  return (
    <div className="flex flex-col items-end gap-1">
      <Button variant="stellar" size="sm" onClick={connect} disabled={isLoading}>
        <Wallet className="mr-2 h-4 w-4" />
        {isLoading ? "Connecting..." : "Connect Wallet"}
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
