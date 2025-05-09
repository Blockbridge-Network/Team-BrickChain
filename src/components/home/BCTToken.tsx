const BCTToken = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-2xl p-8 md:p-12 border border-gray-800">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Token Icon */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">BCT</span>
            </div>
            
            {/* Token Info */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                BrickChain Token (BCT)
              </h2>
              <p className="text-gray-400 mb-6 max-w-2xl">
                Use our utility token to get discounted transaction fees and exclusive platform benefits for holders.
              </p>
              <button className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-white font-medium hover:shadow-lg hover:shadow-purple-500/20 transition-all">
                Get BCT Tokens
              </button>
            </div>
          </div>

          {/* Discounted Transaction Fees Badge */}
          <div className="mt-8 inline-block bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-lg p-4 border border-indigo-800/50">
            <div className="flex items-center gap-3">
              <span className="text-indigo-400">🎉</span>
              <span className="text-white">
                <span className="font-bold">0.65%</span> discounted fees for BCT holders
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute -top-40 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
    </section>
  );
};

export default BCTToken;
