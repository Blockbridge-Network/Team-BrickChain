'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAddress } from 'thirdweb/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import WalletConnection from '@/components/wallet/WalletConnection';
import { useAuth } from '@/hooks/useAuth';

export default function ConnectWalletPage() {
  const router = useRouter();
  const address = useAddress();
  const { user, updateWallet } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const linkWallet = async () => {
      if (address && !user?.walletAddress) {
        setLoading(true);
        try {
          await updateWallet(address);
          router.push('/kyc');
        } catch (error) {
          console.error('Failed to link wallet:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    linkWallet();
  }, [address, user?.walletAddress, updateWallet, router]);

  return (
    <main className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Connect Your Wallet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center text-gray-400">
              <p className="mb-4">
                Connect your Web3 wallet to start investing in tokenized real estate.
                Your wallet will be used to:
              </p>
              <ul className="text-left list-disc list-inside space-y-2 mb-8">
                <li>Hold your property tokens securely</li>
                <li>Receive rental income and appreciation gains</li>
                <li>Participate in property governance</li>
                <li>Trade tokens on the marketplace</li>
              </ul>
            </div>

            <div className="p-6 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-lg">
              <WalletConnection />
            </div>

            {address && loading && (
              <div className="text-center text-sm text-gray-400">
                Linking your wallet... Please wait.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}