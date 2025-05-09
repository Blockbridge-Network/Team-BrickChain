import Link from "next/link";
import Image from "next/image";
import { Property } from "../../lib/propertyData";

interface SimilarPropertiesProps {
  currentProperty: Property;
  properties: Property[];
}

const SimilarProperties = ({ currentProperty, properties }: SimilarPropertiesProps) => {
  // Get properties of the same type, excluding the current one
  const similarProperties = properties
    .filter((p) => p.type === currentProperty.type)
    .slice(0, 3);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Similar Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {similarProperties.map((property) => (
          <Link
            href={`/property/${property.id}`}
            key={property.id}
            className="group"
          >
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all duration-300">
              <div className="relative h-48">
                <Image
                  src={property.images[0]}
                  alt={property.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                {/* Token availability badge */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-sm text-white">{property.tokensSold}% Sold</span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{property.title}</h3>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400">{property.location}</span>
                  <span className="text-purple-400">{property.annualReturn} APR</span>
                </div>

                <div className="border-t border-gray-800 pt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400">Token Price</p>
                      <p className="text-lg font-bold text-white">{property.pricePerToken}</p>
                    </div>
                    <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg text-white text-sm font-medium hover:shadow-lg hover:shadow-purple-500/20 transition-all">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SimilarProperties;
