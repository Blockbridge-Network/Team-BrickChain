"use client";

import { Building, Coins, DollarSign, TrendingUp } from "lucide-react";

interface InvestmentStatsProps {
  totalProperties: number;
  totalTokens: number;
  monthlyIncome: number;
  annualReturn: number;
}

const InvestmentStats = ({
  totalProperties,
  totalTokens,
  monthlyIncome,
  annualReturn,
}: InvestmentStatsProps) => {
  const formatCurrency = (value: number) =>
    value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

  const stats = [
    {
      title: "Properties Owned",
      value: totalProperties,
      icon: Building,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
    },
    {
      title: "Total Tokens",
      value: totalTokens,
      icon: Coins,
      color: "text-indigo-400",
      bgColor: "bg-indigo-400/10",
    },
    {
      title: "Monthly Income",
      value: formatCurrency(monthlyIncome),
      icon: DollarSign,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
    },
    {
      title: "Annual Return",
      value: `${annualReturn}%`,
      icon: TrendingUp,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl p-6 border border-gray-800">
      <h2 className="text-xl font-bold text-white mb-6">Investment Stats</h2>
      
      <div className="grid grid-cols-1 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="p-4 bg-gray-900/50 rounded-lg border border-gray-800"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`${stat.color}`} size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">{stat.title}</p>
                  <p className="text-xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 space-y-3">
        <button className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-purple-500/20 transition-all">
          Buy More Tokens
        </button>
        <button className="w-full px-4 py-2 border border-gray-700 rounded-lg text-gray-300 font-medium hover:bg-gray-800 transition-all">
          View Transaction History
        </button>
      </div>
    </div>
  );
};

export default InvestmentStats;