"use client";

import Link from "next/link";

import { useState } from "react";

export default function FractionalizationPage() {
  // Mocked data for demonstration
  const properties = [
    {
      id: "1",
      title: "Luxury Condo, New York",
      tokensOwned: 1200,
      totalTokens: 10000,
      ownershipPercent: 12,
      value: "$120,000",
    },
    {
      id: "2",
      title: "Beachfront Villa, Miami",
      tokensOwned: 500,
      totalTokens: 5000,
      ownershipPercent: 10,
      value: "$50,000",
    },
  ];

  const [selected, setSelected] = useState<string | null>(null);
  const selectedProperty = properties.find((p) => p.id === selected);

  return (
    <main className="min-h-screen pt-20 pb-12 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-white mb-2">Fractional Ownership</h1>
          <p className="text-gray-400 mb-6">Manage your fractional property holdings and view your ownership breakdown.</p>

          <div className="space-y-6">
            {properties.map((property) => (
              <div
                key={property.id}
                className={`bg-gray-800 rounded-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-gray-700 transition-all duration-200 ${selected === property.id ? "ring-2 ring-purple-500" : "hover:border-purple-500/50"}`}
                onClick={() => setSelected(property.id)}
                style={{ cursor: "pointer" }}
              >
                <div>
                  <h2 className="text-xl font-bold text-white">{property.title}</h2>
                  <div className="text-gray-400 text-sm mt-1">{property.tokensOwned} / {property.totalTokens} tokens</div>
                  <div className="text-purple-400 text-xs mt-1">{property.ownershipPercent}% ownership</div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-gray-400 text-sm">Current Value</span>
                  <span className="text-white font-mono text-lg">{property.value}</span>
                  <Link href={`/property/${property.id}`} className="mt-2 px-4 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs">View Property</Link>
                </div>
              </div>
            ))}
          </div>

          {/* Details panel for selected property */}
          {selectedProperty && (
            <div className="mt-8 bg-gray-800 rounded-lg p-6 border border-purple-700">
              <h3 className="text-lg font-bold text-purple-400 mb-2">Ownership Details</h3>
              <div className="text-gray-300 mb-2">You own <span className="font-bold text-white">{selectedProperty.tokensOwned}</span> out of <span className="font-bold text-white">{selectedProperty.totalTokens}</span> tokens.</div>
              <div className="text-gray-400 text-sm mb-4">This represents <span className="text-purple-300 font-semibold">{selectedProperty.ownershipPercent}%</span> of the property.</div>
              <button
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm mr-2"
                onClick={() => alert("Transfer tokens (not implemented)")}
              >
                Transfer Tokens
              </button>
              <button
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm"
                onClick={() => setSelected(null)}
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
