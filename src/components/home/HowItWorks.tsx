const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: "Connect Wallet",
      description: "Use any Web3 wallet to access engagement opportunities"
    },
    {
      number: 2,
      title: "Browse Properties",
      description: "Explore curated real estate opportunities worldwide"
    },
    {
      number: 3,
      title: "Purchase Tokens",
      description: "Buy full or fractional ownership in properties"
    },
    {
      number: 4,
      title: "Manage Portfolio",
      description: "Track and manage your property investments"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-transparent to-gray-900/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
          How It Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-white">{step.number}</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
              
              {/* Connector line for all except last item */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/2 w-full h-px bg-gradient-to-r from-indigo-600/20 to-purple-600/20" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
