"use client";

import { useState } from "react";

export default function TransactionsPage() {
  // Mocked transaction data for demonstration
  const transactions = [
    {
      id: "tx1",
      date: "2025-05-01",
      type: "Buy",
      property: "Luxury Condo, New York",
      amount: "+$10,000",
      tokens: "+1000 BCT",
      status: "Completed",
    },
    {
      id: "tx2",
      date: "2025-04-15",
      type: "Sell",
      property: "Beachfront Villa, Miami",
      amount: "-$5,000",
      tokens: "-500 BCT",
      status: "Completed",
    },
    {
      id: "tx3",
      date: "2025-03-20",
      type: "Reward",
      property: "Luxury Condo, New York",
      amount: "+$200",
      tokens: "+20 BCT",
      status: "Completed",
    },
  ];

  const [filter, setFilter] = useState<string>("all");
  const filteredTxs = filter === "all" ? transactions : transactions.filter(tx => tx.type === filter);
  const types = ["all", ...Array.from(new Set(transactions.map(tx => tx.type)))];

  return (
    <main className="min-h-screen pt-20 pb-12 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-white mb-2">Transaction History</h1>
          <p className="text-gray-400 mb-6">View your recent property investment and token transactions.</p>

          {/* Filter bar */}
          <div className="mb-4 flex flex-wrap gap-2">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-3 py-1 rounded text-xs font-semibold transition ${filter === type ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-300 hover:bg-purple-800/40"}`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-400">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-400">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-400">Property</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-400">Amount</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-400">Tokens</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredTxs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-500 py-8">No transactions found.</td>
                  </tr>
                ) : (
                  filteredTxs.map((tx) => (
                    <tr key={tx.id}>
                      <td className="px-4 py-2 text-sm text-gray-300 whitespace-nowrap">{tx.date}</td>
                      <td className="px-4 py-2 text-sm text-purple-400 whitespace-nowrap">{tx.type}</td>
                      <td className="px-4 py-2 text-sm text-white whitespace-nowrap">{tx.property}</td>
                      <td className={`px-4 py-2 text-sm font-mono ${tx.amount.startsWith("+") ? "text-green-400" : "text-red-400"}`}>{tx.amount}</td>
                      <td className={`px-4 py-2 text-sm font-mono ${tx.tokens.startsWith("+") ? "text-green-400" : "text-red-400"}`}>{tx.tokens}</td>
                      <td className="px-4 py-2 text-sm text-gray-400 whitespace-nowrap">{tx.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
