"use client";

import { useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import Image from "next/image";
import Link from "next/link";
import { getCurrentUser } from "@/lib/user";

type PropertyStats = {
  totalProperties: number;
  totalValue: string;
  activeInvestors: number;
  monthlyRevenue: string;
};

const MOCK_PROPERTY_DATA = [
  {
    id: "1",
    title: "Luxury Apartment Complex",
    location: "Miami, FL",
    tokensSold: 75,
    totalInvestors: 150,
    monthlyRevenue: "$25,000",
    status: "Active",
    image: "/Houses/House1.jpg"
  },
  // Add more mock properties as needed
];

export default function OwnerDashboard() {
  const account = useActiveAccount();
  const user = getCurrentUser();
  const [activeTab, setActiveTab] = useState<"overview" | "properties" | "investors" | "analytics">("overview");
  
  const stats: PropertyStats = {
    totalProperties: MOCK_PROPERTY_DATA.length,
    totalValue: "$5.2M",
    activeInvestors: 150,
    monthlyRevenue: "$25,000"
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Property Owner Dashboard</h1>
          <p className="text-gray-400">Manage your properties and view performance metrics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Properties", value: stats.totalProperties },
            { label: "Total Value", value: stats.totalValue },
            { label: "Active Investors", value: stats.activeInvestors },
            { label: "Monthly Revenue", value: stats.monthlyRevenue },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
              <p className="text-sm text-gray-400">{stat.label}</p>
              <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-800 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "overview", label: "Overview" },
              { id: "properties", label: "Properties" },
              { id: "investors", label: "Investors" },
              { id: "analytics", label: "Analytics" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-purple-500 text-purple-500"
                    : "border-transparent text-gray-400 hover:text-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_PROPERTY_DATA.map((property) => (
            <div key={property.id} className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800">
              <div className="relative h-48">
                <Image
                  src={property.image}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-sm text-white">{property.tokensSold}% Sold</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white">{property.title}</h3>
                <p className="text-gray-400 mt-1">{property.location}</p>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Investors</p>
                    <p className="text-lg font-bold text-white">{property.totalInvestors}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Monthly Revenue</p>
                    <p className="text-lg font-bold text-white">{property.monthlyRevenue}</p>
                  </div>
                </div>
                <div className="mt-6 flex justify-between">
                  <Link
                    href={`/property/${property.id}`}
                    className="text-purple-400 hover:text-purple-300"
                  >
                    View Details
                  </Link>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    property.status === "Active" ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
                  }`}>
                    {property.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {/* Add Property Card */}
          <Link href="/list" className="block">
            <div className="h-full bg-gray-900/50 rounded-xl border border-gray-800 border-dashed p-6 flex flex-col items-center justify-center text-center hover:bg-gray-800/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                <span className="text-2xl text-purple-400">+</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">List New Property</h3>
              <p className="text-gray-400">Add a new property to your portfolio</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
