'use client';

import { useEffect } from 'react';
import { useWallet, useAddress, useDisconnect } from 'thirdweb/react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { truncateAddress } from '@/lib/utils';

export default function WalletConnection() {
  const wallet = useWallet();
  const address = useAddress();
  const { disconnect } = useDisconnect();
  const { user, updateWallet } = useAuth();

  useEffect(() => {
    if (address && user && address !== user.walletAddress) {
      updateWallet(address).catch(console.error);
    }
  }, [address, user, updateWallet]);

  const handleConnect = async () => {
    try {
      await wallet?.connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      if (user?.walletAddress) {
        await updateWallet('');
      }
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  if (!address) {
    return (
      <Button 
        onClick={handleConnect}
        size="lg"
        className="w-full md:w-auto"
      >
        Connect Wallet
      </Button>
    );
  }

  return (
    <div className="flex gap-2 items-center">
      <span className="text-sm px-3 py-1 rounded-full bg-purple-500/10 text-purple-500">
        {truncateAddress(address)}
      </span>
      <Button 
        onClick={handleDisconnect}
        variant="outline"
        size="sm"
      >
        Disconnect
      </Button>
    </div>
  );
}
