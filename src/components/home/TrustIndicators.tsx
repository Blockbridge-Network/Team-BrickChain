import { Shield, Globe, LineChart } from "lucide-react";

const TrustIndicators = () => {
  const stats = [
    {
      icon: Shield,
      value: "$50M+",
      label: "Total Value Locked",
      sublabel: "Secured by smart contracts"
    },
    {
      icon: Globe,
      value: "10K+",
      label: "Global Investors",
      sublabel: "From 30+ countries"
    },
    {
      icon: LineChart,
      value: "99.9%",
      label: "Platform Uptime",
      sublabel: "Enterprise-grade reliability"
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl p-6 border border-gray-800"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              </div>
              <p className="text-sm text-gray-400">{stat.sublabel}</p>
            </div>
          ))}
        </div>

        {/* Partners Section */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-bold text-white mb-8">Trusted By Industry Leaders</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Replace with actual partner logos */}
            {[1, 2, 3, 4].map((partner) => (
              <div 
                key={partner}
                className="h-16 bg-gray-800/50 rounded-lg flex items-center justify-center"
              >
                <span className="text-gray-400">Partner {partner}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Background elements */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
    </section>
  );
};

export default TrustIndicators;
