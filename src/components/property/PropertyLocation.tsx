import { MapPin } from "lucide-react";

interface PropertyLocationProps {
  location: string;
}

const PropertyLocation = ({ location }: PropertyLocationProps) => {
  return (
    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-purple-600/20 rounded-lg">
          <MapPin size={24} className="text-purple-400" />
        </div>
        <h2 className="text-xl font-bold text-white">Location</h2>
      </div>

      {/* Location Details */}
      <p className="text-gray-400 mb-4">{location}</p>

      {/* Map Placeholder - To be replaced with actual map integration */}
      <div className="aspect-[16/9] bg-gray-800 rounded-lg overflow-hidden">
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          Interactive Map Coming Soon
        </div>
      </div>
    </div>
  );
};

export default PropertyLocation;
