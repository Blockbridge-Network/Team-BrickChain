import { Property } from "../../lib/propertyData";
import { Home, Calendar, AreaChart } from "lucide-react";

interface PropertyDetailsProps {
  property: Property;
}

const PropertyDetails = ({ property }: PropertyDetailsProps) => {
  return (
    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl p-6 border border-gray-800">
      <h1 className="text-2xl font-bold text-white mb-4">{property.title}</h1>
      <p className="text-gray-400 mb-6">{property.description}</p>

      {/* Key Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600/20 rounded-lg">
            <Home size={20} className="text-indigo-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Property Size</p>
            <p className="text-white">{property.propertySize}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-600/20 rounded-lg">
            <Calendar size={20} className="text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Year Built</p>
            <p className="text-white">{property.yearBuilt}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-600/20 rounded-lg">
            <AreaChart size={20} className="text-cyan-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Type</p>
            <p className="text-white">{property.type}</p>
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Amenities</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {property.amenities.map((amenity) => (
            <div
              key={amenity}
              className="px-4 py-2 bg-gray-800/50 rounded-lg text-gray-300"
            >
              {amenity}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
