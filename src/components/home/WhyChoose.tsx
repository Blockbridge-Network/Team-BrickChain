const WhyChoose = () => {
  const features = [
    {
      title: "Fractional Ownership",
      description: "Invest in real estate with as little as you want, making property investment accessible to everyone.",
      icon: "$",
      color: "from-purple-500 to-indigo-600"
    },
    {
      title: "Global Access",
      description: "Invest in properties worldwide, breaking down geographical barriers to real estate investment.",
      icon: "🌍",
      color: "from-cyan-500 to-blue-600"
    },
    {
      title: "Liquid Investments",
      description: "Trade your property tokens easily, providing unprecedented liquidity in real estate investment.",
      icon: "💧",
      color: "from-indigo-500 to-purple-600"
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
          Why Choose BrickChain?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center text-2xl mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Background elements */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
    </section>
  );
};

export default WhyChoose;
