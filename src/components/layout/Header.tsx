// src/layout/Header.tsx
"use client";

import Link from "next/link";
import { ConnectButton } from "thirdweb/react";
import NotificationsCenter from "../../components/layout/NotificationsCenter";
import ThemeToggle from "../../components/ui/ThemeToggle";
import { lightTheme } from "thirdweb/react";
import { ethereum } from "thirdweb/chains";
import { client, wallets } from "../../lib/thirdweb";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useActiveAccount } from "thirdweb/react";
import { usePathname } from "next/navigation";
// Remove unused import

declare global {
  interface Window {
    ethereum?: any;
  }
}

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/resources", label: "Resources" },
];
const privateLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/fractionalization", label: "Fractionalization" },
  { href: "/transactions", label: "Transactions" },
  { href: "/token", label: "Token" },
  { href: "/profile", label: "Profile" },
];

const Header = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  // Use the official hook from thirdweb/react
  const account = useActiveAccount();

  // Responsive sidebar toggle
  const handleSidebarToggle = () => setSidebarOpen((v) => !v);

  return (
    <>
      {/* Topbar for mobile and desktop */}
      <header className="fixed top-0 left-0 w-full h-16 z-40 bg-[#0a1128] border-b border-gray-800 flex items-center justify-between px-4 transition-all duration-300 md:pl-60">
        <div className="flex items-center gap-2">
          <button
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={handleSidebarToggle}
            aria-label="Open sidebar"
            style={{ marginLeft: '160px' }}
          >
            <Menu size={24} />
          </button>
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-indigo-500 rounded-md flex items-center justify-center">
              <div className="w-4 h-4 bg-[#0a1128] rounded-sm"></div>
            </div>
            <span className="text-xl font-bold text-white hidden sm:inline">BrickChain</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {account && <NotificationsCenter />}
          <div className="ml-2">
            {/* ConnectButton always visible, but label changes */}
            <ConnectButton
              client={client}
              wallets={wallets}
              connectButton={{ label: account ? "Switch Wallet" : "Connect Wallet" }}
            />
          </div>
        </div>
      </header>

      {/* Sidebar for desktop and mobile */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 bg-[#0a1128] border-r border-gray-800 flex flex-col transition-all duration-300
        ${sidebarOpen ? "translate-x-0 w-60" : "-translate-x-full w-0"}
        md:translate-x-0 md:w-60 md:block`}
        style={{ width: sidebarOpen ? 240 : 0, minWidth: sidebarOpen ? 240 : 0 }}
      >
        <div className="flex items-center justify-end h-16 px-4 border-b border-gray-800">
          <button
            className="ml-2 p-2 text-gray-400 hover:text-white"
            onClick={handleSidebarToggle}
            aria-label="Toggle sidebar"
          >
            <X size={24} />
          </button>
        </div>
        <nav className={`flex-1 flex flex-col gap-1 mt-4 px-2 items-stretch`}> 
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-purple-800/30 hover:text-white transition ${pathname === link.href ? "bg-purple-900 text-white font-bold" : ""}`}
              title={link.label}
            >
              <span className="truncate">{link.label}</span>
            </Link>
          ))}
          {account && privateLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-purple-800/30 hover:text-white transition ${pathname === link.href ? "bg-purple-900 text-white font-bold" : ""}`}
              title={link.label}
            >
              <span className="truncate">{link.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Spacer for content below header */}
      <div className="h-16 md:pl-60" />
    </>
  );
};

export default Header;

// Remove custom useActiveAccount. Use the one from thirdweb/react in the main component.


