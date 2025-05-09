"use client";

import Link from "next/link";

const resources = [
  {
    title: "What is Tokenized Real Estate?",
    description: "A beginner-friendly guide to understanding real estate tokenization and its benefits.",
    url: "https://www.investopedia.com/terms/t/tokenization.asp",
    type: "article",
  },
  {
    title: "How Fractional Ownership Works",
    description: "Learn how fractional property investment democratizes access to real estate.",
    url: "https://www.forbes.com/sites/forbesbusinesscouncil/2022/07/19/fractional-ownership-in-real-estate/",
    type: "article",
  },
  {
    title: "Blockchain Basics",
    description: "Understand the fundamentals of blockchain technology powering BrickChain.",
    url: "https://www.ibm.com/topics/what-is-blockchain",
    type: "article",
  },
  {
    title: "Smart Contracts Explained",
    description: "A simple explanation of smart contracts and their role in decentralized platforms.",
    url: "https://ethereum.org/en/developers/docs/smart-contracts/",
    type: "article",
  },
  {
    title: "BrickChain Whitepaper (PDF)",
    description: "In-depth technical and economic details of the BrickChain platform.",
    url: "/docs/bct-whitepaper.pdf",
    type: "pdf",
  },
];

export default function EducationalResourcesPage() {
  return (
    <main className="min-h-screen pt-20 pb-12 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-white mb-2">Educational Resources</h1>
          <p className="text-gray-400 mb-6">Learn more about tokenized real estate, blockchain, and the BrickChain platform.</p>

          <div className="space-y-6">
            {resources.map((res, idx) => (
              <div key={idx} className="bg-gray-800 rounded-lg p-5 border border-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-white mb-1">{res.title}</h2>
                  <p className="text-gray-400 text-sm mb-2">{res.description}</p>
                  <span className="inline-block text-xs px-2 py-1 rounded bg-purple-700 text-white uppercase tracking-wide">{res.type}</span>
                </div>
                <Link href={res.url} target="_blank" className="mt-2 md:mt-0 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm text-center min-w-[120px]">Read</Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
