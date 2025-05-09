"use client";

import { useState } from "react";
import PropertyGrid from "../../components/marketplace/PropertyGrid";
import PropertyMap from "../../components/marketplace/PropertyMap";
import FilterBar from "../../components/marketplace/FilterBar";
import ActivityFeed from "../../components/marketplace/ActivityFeed";
import { ViewToggle } from "../../components/marketplace/ViewToggle";

export default function Marketplace() {
  const [view, setView] = useState<"grid" | "map">("grid");
  const [filters, setFilters] = useState({
    propertyType: "all",
    priceRange: [0, 10000000],
    location: "all",
    ownershipType: "all",
  });

  return (
    <main className="min-h-screen pt-20">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a1128] via-[#1a1b3a] to-[#16213e] -z-10" />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Property Marketplace
            </h1>
            <ViewToggle currentView={view} onViewChange={setView} />
          </div>

          {/* Filters and Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <FilterBar filters={filters} onFiltersChange={setFilters} />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {view === "grid" ? (
                <PropertyGrid filters={filters} />
              ) : (
                <PropertyMap filters={filters} />
              )}
            </div>
          </div>

          {/* Activity Feed */}
          <ActivityFeed />
        </div>
      </div>
    </main>
  );
}
