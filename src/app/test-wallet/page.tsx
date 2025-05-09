'use client';

import { ConnectWallet } from '@/components/connect-wallet';
import { useAccount } from 'wagmi';

export default function TestWalletPage() {
  const { address, isConnected } = useAccount();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Wallet Connection Test</h1>
        
        <div className="mb-6">
          <ConnectWallet />
        </div>

        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h2 className="font-semibold mb-2">Connection Status:</h2>
          <p className="text-sm">
            {isConnected ? (
              <>
                <span className="text-green-600">Connected</span>
                <br />
                <span className="text-gray-600 break-all">Address: {address}</span>
              </>
            ) : (
              <span className="text-red-600">Not Connected</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
} 