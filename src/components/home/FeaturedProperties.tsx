import Image from "next/image";

const FeaturedProperties = () => {
  const properties = [
    {
      image: "/Houses/House1.jpg",
      title: "Luxury Condo, New York",
      price: "$2,500,000",
      pricePerToken: "$2,500",
      tokensSold: "70%"
    },
    {
      image: "/Houses/House2.jpg",
      title: "Beach Villa, Miami",
      price: "$4,100,000",
      pricePerToken: "$4,100",
      tokensSold: "45%"
    },
    {
      image: "/Houses/House3.jpg",
      title: "Office Building, London",
      price: "$7,800,000",
      pricePerToken: "$7,800",
      tokensSold: "25%"
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
          Featured Properties
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all duration-300"
            >
              <div className="relative h-48">
                <Image
                  src={property.image}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{property.title}</h3>
                <div className="flex justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-400">Total Value</p>
                    <p className="text-lg font-semibold text-white">{property.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Price per Token</p>
                    <p className="text-lg font-semibold text-white">{property.pricePerToken}</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-gray-800 rounded-full mb-3">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                    style={{ width: property.tokensSold }}
                  />
                </div>
                <p className="text-sm text-gray-400 mb-4">{property.tokensSold} Tokens Sold</p>

                <button className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-white font-medium hover:shadow-lg hover:shadow-purple-500/20 transition-all">
                  Invest Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
