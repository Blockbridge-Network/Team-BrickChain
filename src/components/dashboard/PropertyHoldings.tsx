"use client";

import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";

interface Property {
  id: string;
  title: string;
  tokensOwned: number;
  totalTokens: number;
  valueAtPurchase: number;
  currentValue: number;
  monthlyIncome: number;
  annualReturn: number;
}

interface PropertyHoldingsProps {
  properties: Property[];
}

const PropertyHoldings = ({ properties }: PropertyHoldingsProps) => {
  const formatCurrency = (value: number) =>
    value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

  const calculateGrowth = (current: number, initial: number) => {
    const growth = ((current - initial) / initial) * 100;
    return growth.toFixed(2);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl p-6 border border-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Property Holdings</h2>
        <Link
          href="/marketplace"
          className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
        >
          View Marketplace
        </Link>
      </div>

      <div className="space-y-4">
        {properties.map((property) => {
          const growth = Number(
            calculateGrowth(property.currentValue, property.valueAtPurchase)
          );
          const isPositive = growth >= 0;

          return (
            <div
              key={property.id}
              className="p-4 bg-gray-900/50 rounded-lg border border-gray-800 hover:border-purple-500/50 transition-all"
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                {/* Property Info */}
                <div className="flex-1">
                  <Link
                    href={`/property/${property.id}`}
                    className="text-lg font-medium text-white hover:text-purple-400 transition-colors"
                  >
                    {property.title}
                  </Link>
                  <div className="flex items-center gap-4 mt-2">
                    <div>
                      <p className="text-sm text-gray-400">Tokens Owned</p>
                      <p className="text-white">
                        {property.tokensOwned} / {property.totalTokens}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Ownership</p>
                      <p className="text-white">
                        {((property.tokensOwned / property.totalTokens) * 100).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Value Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-medium text-white">
                      {formatCurrency(property.currentValue)}
                    </p>
                    <span
                      className={`flex items-center text-sm ${
                        isPositive ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {isPositive ? (
                        <ArrowUpRight size={16} />
                      ) : (
                        <ArrowDownRight size={16} />
                      )}
                      {Math.abs(growth)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <div>
                      <p className="text-sm text-gray-400">Monthly Income</p>
                      <p className="text-white">{formatCurrency(property.monthlyIncome)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Annual Return</p>
                      <div className="flex items-center gap-1">
                        <TrendingUp size={14} className="text-blue-400" />
                        <p className="text-white">{property.annualReturn}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                    style={{
                      width: `${(property.tokensOwned / property.totalTokens) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PropertyHoldings;