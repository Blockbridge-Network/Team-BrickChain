const Stats = () => {
  const stats = [
    {
      value: "$613T+",
      label: "Global Real Estate Market"
    },
    {
      value: "1,000",
      label: "Shares Per Property"
    },
    {
      value: "0.65%",
      label: "BCT Discounted Fee"
    },
    {
      value: "Global",
      label: "Investment Access"
    }
  ];

  return (
    <section className="py-12 bg-[#1f2b48] bg-opacity-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="font-space-grotesk text-4xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
