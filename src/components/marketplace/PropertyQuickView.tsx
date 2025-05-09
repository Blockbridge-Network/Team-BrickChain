"use client";

import Image from "next/image";
import { PropertyQuickViewProps } from "@/types/components";
import { resolveIpfsUrl } from "@/lib/ipfs";

interface Amenity {
  id: number;
  name: string;
}

const PropertyQuickView: React.FC<PropertyQuickViewProps> = ({ property, onClose }) => {
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden max-w-2xl w-full">
      <div className="relative h-64">
        <Image
          src={resolveIpfsUrl(property.images[0])}
          alt={property.title}
          fill
          className="object-cover"
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm p-2 rounded-full text-white hover:bg-black/80"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-bold text-white mb-4">{property.title}</h2>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-gray-400 text-sm">Location</p>
            <p className="text-white">{property.location.city}, {property.location.country}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Property Type</p>
            <p className="text-white">{property.property_type}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Price</p>
            <p className="text-white">${property.price.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Token Price</p>
            <p className="text-white">
              ${((property.price / property.token_supply) || 0).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <div className="mb-6">
            <p className="text-gray-400 text-sm mb-2">Amenities</p>
            <div className="flex flex-wrap gap-2">
              {(property.amenities ?? []).map((amenity: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {property.bedrooms && (
            <div>
              <p className="text-gray-400 text-sm">Bedrooms</p>
              <p className="text-white">{property.bedrooms}</p>
            </div>
          )}
          {property.bathrooms && (
            <div>
              <p className="text-gray-400 text-sm">Bathrooms</p>
              <p className="text-white">{property.bathrooms}</p>
            </div>
          )}
          {property.size && (
            <div>
              <p className="text-gray-400 text-sm">Size</p>
              <p className="text-white">{property.size} sq ft</p>
            </div>
          )}
          {property.year_built && (
            <div>
              <p className="text-gray-400 text-sm">Year Built</p>
              <p className="text-white">{property.year_built}</p>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-800">
          <div>
            <p className="text-gray-400 text-sm">Investment Progress</p>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500"
                  style={{ width: `${(property.tokens_sold / property.token_supply) * 100}%` }}
                />
              </div>
              <span className="text-white text-sm">
                {Math.round((property.tokens_sold / property.token_supply) * 100)}%
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
