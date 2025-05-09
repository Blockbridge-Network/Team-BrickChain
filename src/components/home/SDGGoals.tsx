const SDGGoals = () => {
  const goals = [
    {
      number: 1,
      name: "No Poverty",
      color: "#E5243B",
      description: "Asset ownership for low-income earners"
    },
    {
      number: 8,
      name: "Economic Growth",
      color: "#A21942",
      description: "Decentralized finance opportunities"
    },
    {
      number: 11,
      name: "Sustainable Cities",
      color: "#FD6925",
      description: "Affordable housing investment"
    },
    {
      number: 17,
      name: "Partnerships",
      color: "#19486A",
      description: "Blockchain integration"
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
          Sustainable Development Goals
        </h2>
        <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
          BrickChain aligns with the UN&apos;s Sustainable Development Goals, contributing to a more inclusive and sustainable future.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {goals.map((goal) => (
            <div key={goal.number} className="flex flex-col items-center">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: goal.color }}
              >
                <span className="text-2xl font-bold text-white">
                  {goal.number}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 text-center">
                {goal.name}
              </h3>
              <p className="text-sm text-gray-400 text-center">
                {goal.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Background elements */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-500/5 rounded-full blur-3xl" />
    </section>
  );
};

export default SDGGoals;
