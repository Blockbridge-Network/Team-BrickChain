"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import WalletConnection from "@/components/profile/WalletConnection";
import ProfileInfo from "../../components/profile/ProfileInfo";
const SecuritySettings = dynamic(() => import("@/components/profile/SecuritySettings"), { ssr: false });
const Settings = dynamic(() => import("@/components/profile/Settings"), { ssr: false });

const tabs = [
  { id: "profile", label: "Profile Information" },
  { id: "wallet", label: "Wallet & Connections" },
  { id: "security", label: "Security & Privacy" },
  { id: "settings", label: "Settings & Preferences" },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <main className="min-h-screen pt-20 pb-12 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="pb-5 border-b border-gray-800">
            <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
            <p className="mt-2 text-sm text-gray-400">
              Manage your account settings and preferences.
            </p>
          </div>

          {/* Tabs */}
          <div className="mt-6">
            <nav className="flex space-x-4" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === tab.id
                      ? "bg-purple-500/10 text-purple-400"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="mt-8">
            {activeTab === "profile" && <ProfileInfo />}
            {activeTab === "wallet" && <WalletConnection />}
            {activeTab === "security" && <SecuritySettings />}
            {activeTab === "settings" && <Settings />}
          </div>
        </div>
      </div>
    </main>
  );
}