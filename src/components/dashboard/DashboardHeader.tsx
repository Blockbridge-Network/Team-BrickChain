'use client';

import { UserDropdown } from '@/components/ui/UserDropdown';
import WalletConnection from '@/components/wallet/WalletConnection';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardHeader() {
  const { user } = useAuth();

  return (
    <nav className="sticky top-0 z-40 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        {/* Logo/Home Link */}
        <div className="mr-8">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="font-bold text-xl">BrickEarn</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 flex items-center space-x-4">
          {user?.role === 'PROPERTY_OWNER' ? (
            <>
              <Link href="/dashboard/owner" className="text-muted-foreground hover:text-foreground">
                Dashboard
              </Link>
              <Link href="/dashboard/properties" className="text-muted-foreground hover:text-foreground">
                My Properties
              </Link>
              <Link href="/dashboard/list" className="text-muted-foreground hover:text-foreground">
                List Property
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard/investor" className="text-muted-foreground hover:text-foreground">
                Dashboard
              </Link>
              <Link href="/dashboard/investments" className="text-muted-foreground hover:text-foreground">
                My Investments
              </Link>
              <Link href="/properties" className="text-muted-foreground hover:text-foreground">
                Browse Properties
              </Link>
            </>
          )}
        </div>

        {/* Right Side - Wallet & User */}
        <div className="flex items-center space-x-4">
          <WalletConnection />
          <UserDropdown />
        </div>
      </div>
    </nav>
  );
}
