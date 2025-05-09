"use client";

import { useEffect, useState } from "react";
import { propertyData } from "../../../lib/propertyData";
import PropertyImageGallery from "../../../components/property/PropertyImageGallery";
import TokenizationInfo from "../../../components/property/TokenizationInfo";
import PropertyDetails from "../../../components/property/PropertyDetails";
import InvestmentCalculator from "../../../components/property/InvestmentCalculator";
import PropertyLocation from "../../../components/property/PropertyLocation";
import SimilarProperties from "../../../components/property/SimilarProperties";

interface PageProps {
  params: {
    id: string;
  };
}

export default function PropertyPage({ params }: PageProps) {
  const property = propertyData.find((p) => p.id === params.id);

  if (!property) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Property Not Found</h1>
          <p className="text-gray-400">The property you&#39;re looking for doesn&#39;t exist.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-20">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a1128] via-[#1a1b3a] to-[#16213e] -z-10" />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Basic Info */}
          <div className="lg:col-span-2 space-y-8">
            <PropertyImageGallery images={property.images} title={property.title} />
            <PropertyDetails property={property} />
            <PropertyLocation location={property.location} />
          </div>

          {/* Right Column - Investment Info */}
          <div className="space-y-8">
            <TokenizationInfo 
              price={property.price}
              pricePerToken={property.pricePerToken}
              tokensSold={property.tokensSold}
              tokenSupply={property.tokenSupply}
              annualReturn={property.annualReturn}
            />
            <InvestmentCalculator 
              pricePerToken={property.pricePerToken}
              tokenSupply={property.tokenSupply}
              tokensLeft={property.tokenSupply - (property.tokenSupply * property.tokensSold / 100)}
            />
          </div>
        </div>

        {/* Similar Properties */}
        <div className="mt-16">
          <SimilarProperties 
            currentProperty={property}
            properties={propertyData.filter(p => p.id !== property.id)}
          />
        </div>
      </div>
    </main>
  );
}
