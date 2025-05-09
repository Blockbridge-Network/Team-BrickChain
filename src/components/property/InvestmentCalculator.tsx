"use client";

import { useState } from "react";
import { CircleDollarSign, PieChart } from "lucide-react";

interface InvestmentCalculatorProps {
  pricePerToken: string;
  tokenSupply: number;
  tokensLeft: number;
}

const InvestmentCalculator = ({
  pricePerToken,
  tokenSupply,
  tokensLeft,
}: InvestmentCalculatorProps) => {
  const [tokenAmount, setTokenAmount] = useState(1);
  const [investmentPeriod, setInvestmentPeriod] = useState(1); // years
  const tokenPrice = parseFloat(pricePerToken.replace(/[^0-9.]/g, ""));
  const maxTokens = Math.min(100, tokensLeft);

  // Return rates
  const annualReturnRate = 0.085; // 8.5%
  const monthlyRentalYield = 0.006; // 0.6% monthly

  const calculateInvestment = () => 
    (tokenAmount * tokenPrice).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

  const calculateOwnership = () => 
    ((tokenAmount / tokenSupply) * 100).toFixed(2);

  const calculateProjectedReturns = () => {
    const initialInvestment = tokenAmount * tokenPrice;
    
    // Calculate appreciation
    const appreciatedValue = initialInvestment * Math.pow(1 + annualReturnRate, investmentPeriod);
    const totalAppreciation = appreciatedValue - initialInvestment;
    
    // Calculate rental income
    const monthlyRental = initialInvestment * monthlyRentalYield;
    const totalRental = monthlyRental * 12 * investmentPeriod;
    
    // Total returns
    const totalReturns = totalAppreciation + totalRental;
    
    return {
      appreciation: totalAppreciation.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      }),
      rental: totalRental.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      }),
      total: totalReturns.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      }),
      monthlyIncome: monthlyRental.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      }),
      roi: ((totalReturns / initialInvestment) * 100).toFixed(2),
      annualRoi: ((totalReturns / initialInvestment / investmentPeriod) * 100).toFixed(2)
    };
  };

  const projectedReturns = calculateProjectedReturns();

  return (
    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl p-6 border border-gray-800">
      <h2 className="text-xl font-bold text-white mb-6">Investment Calculator</h2>

      {/* Token Amount Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Number of Tokens
        </label>
        <div className="flex gap-4">
          <input
            type="number"
            min="1"
            max={maxTokens}
            value={tokenAmount}
            onChange={(e) => setTokenAmount(Math.min(maxTokens, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-full bg-gray-900 border border-gray-800 text-white rounded-lg p-2.5 focus:ring-1 focus:ring-purple-500"
          />
          <button
            onClick={() => setTokenAmount(maxTokens)}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Max
          </button>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          {tokensLeft.toLocaleString()} tokens available
        </p>
      </div>

      {/* Investment Period Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Investment Period (Years)
        </label>
        <select
          value={investmentPeriod}
          onChange={(e) => setInvestmentPeriod(parseInt(e.target.value))}
          className="w-full bg-gray-900 border border-gray-800 text-white rounded-lg p-2.5 focus:ring-1 focus:ring-purple-500"
        >
          {[1, 2, 3, 4, 5, 10].map((year) => (
            <option key={year} value={year}>
              {year} {year === 1 ? "Year" : "Years"}
            </option>
          ))}
        </select>
      </div>

      {/* Investment Summary */}
      <div className="space-y-4">
        <div className="flex justify-between items-center py-3 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <CircleDollarSign size={16} className="text-purple-400" />
            <span className="text-gray-400">Initial Investment</span>
          </div>
          <span className="text-white font-medium">{calculateInvestment()}</span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <PieChart size={16} className="text-indigo-400" />
            <span className="text-gray-400">Ownership Percentage</span>
          </div>
          <span className="text-white font-medium">{calculateOwnership()}%</span>
        </div>
      </div>

      {/* Projected Returns */}
      <div className="mt-6 p-4 bg-gray-900/50 rounded-lg">
        <h3 className="text-lg font-medium text-white mb-4">
          Projected Returns ({investmentPeriod} {investmentPeriod === 1 ? "Year" : "Years"})
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Property Appreciation</span>
            <span className="text-green-400">{projectedReturns.appreciation}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Total Rental Income</span>
            <span className="text-green-400">{projectedReturns.rental}</span>
          </div>
          <div className="text-sm text-gray-500 pl-4">
            Est. Monthly Income: {projectedReturns.monthlyIncome}
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-gray-800">
            <span className="text-gray-400">Total Projected Returns</span>
            <span className="text-green-400 font-medium">{projectedReturns.total}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Total ROI</span>
            <span className="text-green-400 font-medium">{projectedReturns.roi}%</span>
          </div>
          <div className="text-sm text-gray-500 pl-4">
            Average Annual ROI: {projectedReturns.annualRoi}%
          </div>
        </div>
      </div>

      {/* Purchase Button */}
      <button className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-purple-500/20 transition-all">
        Purchase {tokenAmount} Token{tokenAmount !== 1 ? "s" : ""}
      </button>
    </div>
  );
};

export default InvestmentCalculator;
