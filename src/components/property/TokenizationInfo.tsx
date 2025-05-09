import { CircleDollarSign, Coins, TrendingUp } from "lucide-react";

interface TokenizationInfoProps {
  price: string;
  pricePerToken: string;
  tokensSold: number;
  tokenSupply: number;
  annualReturn: string;
}

const TokenizationInfo = ({
  price,
  pricePerToken,
  tokensSold,
  tokenSupply,
  annualReturn,
}: TokenizationInfoProps) => {
  return (
    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl p-6 border border-gray-800">
      <h2 className="text-xl font-bold text-white mb-6">Investment Information</h2>

      {/* Property Value */}
      <div className="flex items-start gap-4 mb-6">
        <div className="p-2 bg-indigo-600/20 rounded-lg">
          <CircleDollarSign size={24} className="text-indigo-400" />
        </div>
        <div>
          <p className="text-sm text-gray-400">Total Property Value</p>
          <p className="text-xl font-bold text-white">{price}</p>
        </div>
      </div>

      {/* Token Info */}
      <div className="flex items-start gap-4 mb-6">
        <div className="p-2 bg-purple-600/20 rounded-lg">
          <Coins size={24} className="text-purple-400" />
        </div>
        <div>
          <p className="text-sm text-gray-400">Price per Token</p>
          <p className="text-xl font-bold text-white">{pricePerToken}</p>
          <p className="text-sm text-gray-400 mt-1">
            {tokensSold}% tokens sold ({Math.floor(tokenSupply * tokensSold / 100)} of {tokenSupply})
          </p>
        </div>
      </div>

      {/* Expected Returns */}
      <div className="flex items-start gap-4">
        <div className="p-2 bg-cyan-600/20 rounded-lg">
          <TrendingUp size={24} className="text-cyan-400" />
        </div>
        <div>
          <p className="text-sm text-gray-400">Expected Annual Return</p>
          <p className="text-xl font-bold text-white">{annualReturn}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-8">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Token Sale Progress</span>
          <span className="text-white">{tokensSold}%</span>
        </div>
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
            style={{ width: `${tokensSold}%` }}
          />
        </div>
      </div>

      {/* Buy Button */}
      <button className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-purple-500/20 transition-all">
        Buy Tokens
      </button>
    </div>
  );
};

export default TokenizationInfo;
