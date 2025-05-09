import { useEffect } from 'react';
import { useAddress } from 'thirdweb/react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';

export function useWalletRequirement(redirectUrl = '/profile') {
  const router = useRouter();
  const address = useAddress();
  const { user } = useAuth();

  useEffect(() => {
    const checkWallet = async () => {
      if (!address) {
        router.push(redirectUrl);
      }
    };

    checkWallet();
  }, [address, router, redirectUrl]);

  return {
    isLoading: !user,
    error: !address ? 'Wallet not connected' : null
  };
}
