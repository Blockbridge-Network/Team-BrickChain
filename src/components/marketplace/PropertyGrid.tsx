"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import PropertyImage from "../ui/PropertyImage";
import Modal from "../ui/Modal";
import { PropertyQuickView } from "./PropertyQuickView";
import Toast from "../ui/toast";
import { getCurrentUser } from "@/lib/user";
import { Property, PropertyGridProps } from "@/types/property";
import { User } from "@/types/user";
import { SampleProperty } from "@/types/sample-data";

// Create Supabase client outside component
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// eslint-disable-next-line react/prop-types
const PropertyGrid: React.FC<PropertyGridProps> = ({ filters }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [toastMessage, setToastMessage] = useState<string>("");
  const router = useRouter();

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let filteredData: Property[];
        if (process.env.NODE_ENV === 'development') {
        const { sampleProperties } = await import('@/lib/sample-data');
        const sampleData = sampleProperties as unknown as SampleProperty[];
        filteredData = sampleData.map(p => ({
          ...p,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })) as Property[];
      } else {
        const { data, error: fetchError } = await supabase
          .from('properties')
          .select(`
            *,
            owner:users(*)
          `);

        if (fetchError) throw fetchError;
        filteredData = (data || []) as Property[];
      }

      // Apply filters
      // eslint-disable-next-line react/prop-types
      if (filters.propertyType !== "all") {
        filteredData = filteredData.filter(p => 
          // eslint-disable-next-line react/prop-types
          p.property_type.toUpperCase() === filters.propertyType.toUpperCase()
        );
      }

      // eslint-disable-next-line react/prop-types
      if (filters.location !== "all") {
        filteredData = filteredData.filter(p => 
          // eslint-disable-next-line react/prop-types
          p.location.city.toLowerCase().includes(filters.location.toLowerCase())
        );
      }

      // eslint-disable-next-line react/prop-types
      if (filters.ownershipType !== "all") {
        filteredData = filteredData.filter(p => 
          // eslint-disable-next-line react/prop-types
          p.ownership_type.toUpperCase() === filters.ownershipType.toUpperCase()
        );
      }

      // Apply price range filter
      filteredData = filteredData.filter((property) => 
        // eslint-disable-next-line react/prop-types
        property.price >= filters.priceRange[0] && property.price <= filters.priceRange[1]
      );

      setProperties(filteredData);
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError("Failed to load properties. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleQuickView = (property: Property) => {
    setSelectedProperty(property);
    setQuickViewOpen(true);
  };

  const handleInvest = async (property: Property) => {
    try {
      const user = await getCurrentUser() as User;
      if (!user?.wallet_address || !user?.kycCompleted) {
        setToastMessage("Please complete your profile and KYC verification before investing");
        setTimeout(() => {
          router.push("/profile");
        }, 2000);
        return;
      }
      router.push(`/property/${property.id}`);
    } catch (err) {
      console.error("Error handling investment:", err);
      setToastMessage("Failed to process investment request");
    }
  };

  const handleCloseModal = () => {
    setQuickViewOpen(false);
    setSelectedProperty(null);
  };

  if (loading) {
    return (
      <div className="col-span-full flex items-center justify-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          <p className="text-gray-400">Loading properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-12">
        <p className="text-lg text-red-400 mb-4">{error}</p>
        <button
          onClick={() => {
            setError(null);
            fetchProperties();
          }}
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-12">
        <p className="text-lg text-gray-400">No properties match your filters.</p>
        <p className="text-sm text-gray-500 mt-2">Try adjusting your search criteria.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div key={property.id} className="group relative">
            <div 
              className="block cursor-pointer" 
              tabIndex={-1} 
              onClick={() => handleInvest(property)}
            >
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all duration-300">
                <div className="relative h-48">
                  <PropertyImage
                    src={property.images[0] || '/placeholder-property.jpg'}
                    alt={property.title}
                    fill
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-sm text-white">
                      {property.tokens_sold ? `${property.tokens_sold}% Sold` : 'New'}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{property.title}</h3>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-400">{property.location.city}</span>
                    <span className="text-purple-400">{property.property_type}</span>
                  </div>

                  <div className="border-t border-gray-800 pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-400">Total Value</p>
                        <p className="text-lg font-bold text-white">
                          ${property.price.toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickView(property);
                        }}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                      >
                        Quick View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {quickViewOpen && selectedProperty && (
        <Modal open={quickViewOpen} onClose={handleCloseModal}>
          <PropertyQuickView property={selectedProperty} onClose={handleCloseModal} />
        </Modal>
      )}

      {toastMessage && <Toast message={toastMessage} />}
    </>
  );
};

export default PropertyGrid;
