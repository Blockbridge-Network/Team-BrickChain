"use client";

import { useState } from 'react';
import { TokenizationForm as TokenizationFormType } from '@/lib/types/listing';

interface TokenizationFormProps {
  data: TokenizationFormType;
  onUpdate: (data: Partial<TokenizationFormType>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function TokenizationForm({
  data,
  onUpdate,
  onNext,
  onPrevious,
}: TokenizationFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const calculatePricePerToken = (totalPrice: string, totalTokens: number) => {
    if (!totalPrice || !totalTokens) return '';
    const price = parseFloat(totalPrice.replace(/[^0-9.]/g, ''));
    return (price / totalTokens).toFixed(2);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!data.totalTokens) {
      newErrors.totalTokens = 'Token supply is required';
    }
    if (!data.pricePerToken) {
      newErrors.pricePerToken = 'Price per token is required';
    }
    if (!data.minInvestment) {
      newErrors.minInvestment = 'Minimum investment is required';
    }
    if (!data.tradingDelay) {
      newErrors.tradingDelay = 'Trading delay is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Ownership Type */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-4">
          Ownership Type
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => onUpdate({ ownershipType: 'FULL' })}
            className={`p-4 rounded-lg border ${
              data.ownershipType === 'FULL'
                ? 'border-purple-500 bg-purple-500/20'
                : 'border-gray-700 bg-gray-800'
            } transition-all duration-200`}
          >
            <h3 className="text-lg font-medium text-white mb-2">Full Ownership</h3>
            <p className="text-sm text-gray-400">
              Create a single NFT representing full property ownership
            </p>
          </button>

          <button
            type="button"
            onClick={() => onUpdate({ ownershipType: 'FRACTIONAL' })}
            className={`p-4 rounded-lg border ${
              data.ownershipType === 'FRACTIONAL'
                ? 'border-purple-500 bg-purple-500/20'
                : 'border-gray-700 bg-gray-800'
            } transition-all duration-200`}
          >
            <h3 className="text-lg font-medium text-white mb-2">Fractional Ownership</h3>
            <p className="text-sm text-gray-400">
              Create multiple tokens for shared property ownership
            </p>
          </button>
        </div>
      </div>

      {/* Token Supply */}
      {data.ownershipType === 'FRACTIONAL' && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Token Supply
          </label>
          <input
            type="number"
            value={data.totalTokens}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              onUpdate({
                totalTokens: value,
                pricePerToken: calculatePricePerToken('$1,000,000', value),
              });
            }}
            min="1"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter number of tokens"
          />
          {errors.totalTokens && (
            <p className="mt-1 text-sm text-red-500">{errors.totalTokens}</p>
          )}
          <p className="mt-2 text-sm text-gray-400">
            This determines how many tokens the property will be divided into.
          </p>
        </div>
      )}

      {/* Price Per Token */}
      {data.ownershipType === 'FRACTIONAL' && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Price Per Token
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-400">$</span>
            <input
              type="text"
              value={data.pricePerToken}
              onChange={(e) => onUpdate({ pricePerToken: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="0.00"
            />
          </div>
          {errors.pricePerToken && (
            <p className="mt-1 text-sm text-red-500">{errors.pricePerToken}</p>
          )}
        </div>
      )}

      {/* Minimum Investment */}
      {data.ownershipType === 'FRACTIONAL' && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Minimum Investment
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-400">$</span>
            <input
              type="text"
              value={data.minInvestment}
              onChange={(e) => onUpdate({ minInvestment: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Minimum investment amount"
            />
          </div>
          {errors.minInvestment && (
            <p className="mt-1 text-sm text-red-500">{errors.minInvestment}</p>
          )}
        </div>
      )}

      {/* Trading Delay */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Trading Delay
        </label>
        <select
          value={data.tradingDelay}
          onChange={(e) => onUpdate({ tradingDelay: e.target.value })}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Select delay period</option>
          <option value="0">No delay</option>
          <option value="7">7 days</option>
          <option value="14">14 days</option>
          <option value="30">30 days</option>
        </select>
        {errors.tradingDelay && (
          <p className="mt-1 text-sm text-red-500">{errors.tradingDelay}</p>
        )}
        <p className="mt-2 text-sm text-gray-400">
          Period before tokens can be traded after initial purchase.
        </p>
      </div>

      {/* Platform Fees */}
      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
        <h3 className="text-lg font-medium text-white mb-4">Platform Fees</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-300">Standard Fee</p>
              <p className="text-xs text-gray-400">Using ETH or other cryptocurrencies</p>
            </div>
            <span className="text-white font-medium">{data.fees.platformFee}%</span>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-300">Discounted Fee</p>
              <p className="text-xs text-gray-400">Using BCT token</p>
            </div>
            <span className="text-purple-400 font-medium">{data.fees.bctDiscountFee}%</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onPrevious}
          className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Previous
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg hover:from-purple-600 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Continue
        </button>
      </div>
    </form>
  );
}
