"use client";

import Link from "next/link";

export default function TokenInfoPage() {
  // Mocked token data for now
  const token = {
    name: "BrickChain Token",
    symbol: "BCT",
    address: "0x1234...abcd",
    totalSupply: "1,000,000,000 BCT",
    decimals: 18,
    description:
      "BCT is the utility and governance token of the BrickChain platform, enabling real estate investment, platform rewards, and on-chain governance.",
    utilities: [
      "Fractional property investment",
      "Platform fee discounts",
      "Governance voting",
      "Staking for rewards",
      "Access to exclusive property listings",
    ],
    etherscanUrl: "https://etherscan.io/token/0x1234...abcd",
  };

  return (
    <main className="min-h-screen pt-20 pb-12 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-white mb-2">{token.name} <span className="text-purple-400">({token.symbol})</span></h1>
          <p className="text-gray-400 mb-4">{token.description}</p>

          <div className="mb-6">
            <div className="flex flex-wrap gap-6">
              <div>
                <span className="text-xs text-gray-400">Token Address</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-purple-300 text-sm">{token.address}</span>
                  <Link href={token.etherscanUrl} target="_blank" className="text-blue-400 text-xs underline">View on Etherscan</Link>
                </div>
              </div>
              <div>
                <span className="text-xs text-gray-400">Total Supply</span>
                <div className="text-white font-mono text-sm">{token.totalSupply}</div>
              </div>
              <div>
                <span className="text-xs text-gray-400">Decimals</span>
                <div className="text-white font-mono text-sm">{token.decimals}</div>
              </div>
            </div>
          </div>

          <hr className="my-6 border-gray-800" />

          <h2 className="text-xl font-bold text-white mb-2">Token Utilities</h2>
          <ul className="list-disc list-inside text-gray-300 mb-6">
            {token.utilities.map((util, idx) => (
              <li key={idx}>{util}</li>
            ))}
          </ul>

          <h2 className="text-xl font-bold text-white mb-2">Token Economics</h2>
          <p className="text-gray-400 mb-4">BCT is designed to incentivize platform participation, reward long-term holders, and enable decentralized governance. Tokenomics details will be published in the official whitepaper.</p>

          <div className="mt-8">
            <Link href="/docs/bct-whitepaper.pdf" target="_blank" className="inline-block px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition">Read Whitepaper</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
