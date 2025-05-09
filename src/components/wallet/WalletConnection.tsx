"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { truncateAddress } from "@/lib/utils";
import { useConnectModal, useDisconnect, useActiveWallet, useWalletInfo } from "thirdweb/react";
import { client, wallets } from "@/lib/thirdweb";

export default function WalletConnection() {
  const { user, updateWallet } = useAuth();
  const { connect, isConnecting } = useConnectModal();
  const { disconnect } = useDisconnect();
  const activeWallet = useActiveWallet();
  const { data: walletInfo } = useWalletInfo(activeWallet?.id);
  const [error, setError] = useState<string | null>(null);

  // Handle wallet connection
  const connectWallet = async () => {
    try {
      setError(null);
      await connect({ 
        client,
        wallets
      });      if (walletInfo?.id) {
        await updateWallet(walletInfo.id);
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet");
      console.error("Wallet connection error:", err);
    }
  };

  // Handle wallet disconnection
  const disconnectWallet = async () => {
    try {
      if (activeWallet && user?.walletAddress) {
        disconnect(activeWallet);
        await updateWallet("");
      }
    } catch (err: any) {
      console.error("Wallet disconnection error:", err);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      
      {user?.walletAddress ? (
        <Button
          variant="outline"
          onClick={disconnectWallet}
          className="flex items-center gap-2"
        >
          <span>{truncateAddress(user.walletAddress || "")}</span>
          <span>Disconnect</span>
        </Button>
      ) : (
        <Button
          onClick={connectWallet}
          disabled={isConnecting}
          className="flex items-center gap-2"
        >
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      )}
    </div>
  );
}
