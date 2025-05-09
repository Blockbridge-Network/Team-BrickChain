"use client";

import { LineChart, TrendingUp, DollarSign, PieChart } from "lucide-react";

interface PortfolioValueProps {
  totalValue: number;
  totalInvested: number;
  monthlyIncome: number;
  annualReturn: number;
}

const PortfolioValue = ({
  totalValue,
  totalInvested,
  monthlyIncome,
  annualReturn,
}: PortfolioValueProps) => {
  const formatCurrency = (value: number) =>
    value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

  const calculateGrowth = () => {
    const growth = ((totalValue - totalInvested) / totalInvested) * 100;
    return growth.toFixed(2);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl p-6 border border-gray-800">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        {/* Total Portfolio Value */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <LineChart className="text-purple-400" size={20} />
            <h2 className="text-lg font-medium text-gray-400">
              Total Portfolio Value
            </h2>
          </div>
          <p className="text-3xl font-bold text-white mb-2">
            {formatCurrency(totalValue)}
          </p>
          <div className="flex items-center gap-2">
            <span className={`text-sm ${Number(calculateGrowth()) >= 0 ? "text-green-400" : "text-red-400"}`}>
              {calculateGrowth()}%
            </span>
            <span className="text-sm text-gray-400">
              from {formatCurrency(totalInvested)}
            </span>
          </div>
        </div>

        {/* Value Distribution */}
        <div className="flex-1 border-l border-gray-800 pl-6">
          <div className="space-y-4">
            {/* Monthly Income */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="text-green-400" size={16} />
                <span className="text-sm text-gray-400">Monthly Income</span>
              </div>
              <p className="text-xl font-bold text-white">
                {formatCurrency(monthlyIncome)}
              </p>
            </div>

            {/* Annual Return */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="text-blue-400" size={16} />
                <span className="text-sm text-gray-400">Annual Return</span>
              </div>
              <p className="text-xl font-bold text-white">{annualReturn}%</p>
            </div>

            {/* Portfolio Distribution */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <PieChart className="text-indigo-400" size={16} />
                <span className="text-sm text-gray-400">Distribution</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                  style={{ width: `${(totalInvested / totalValue) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">Initial Investment</span>
                <span className="text-xs text-gray-500">Growth</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioValue;