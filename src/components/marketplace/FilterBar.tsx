interface FilterBarProps {
  filters: {
    propertyType: string;
    priceRange: number[];
    location: string;
    ownershipType: string;
  };
  onFiltersChange: (filters: any) => void;
}

const FilterBar = ({ filters, onFiltersChange }: FilterBarProps) => {
  const propertyTypes = ["All", "Residential", "Commercial", "Industrial"];
  const locations = ["All", "New York", "Miami", "London", "Dubai", "Singapore"];
  const ownershipTypes = ["All", "Full", "Fractional"];

  return (
    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-xl p-6 border border-gray-800">
      <h2 className="text-xl font-bold text-white mb-6">Filters</h2>

      {/* Property Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Property Type
        </label>
        <select
          value={filters.propertyType}
          onChange={(e) =>
            onFiltersChange({ ...filters, propertyType: e.target.value })
          }
          className="w-full bg-gray-900 border border-gray-800 text-white rounded-lg p-2.5 focus:ring-1 focus:ring-purple-500"
        >
          {propertyTypes.map((type) => (
            <option key={type} value={type.toLowerCase()}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Price Range
        </label>
        <div className="flex gap-4">
          <input
            type="number"
            value={filters.priceRange[0]}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                priceRange: [Number(e.target.value), filters.priceRange[1]],
              })
            }
            className="w-full bg-gray-900 border border-gray-800 text-white rounded-lg p-2.5 focus:ring-1 focus:ring-purple-500"
            placeholder="Min"
          />
          <input
            type="number"
            value={filters.priceRange[1]}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                priceRange: [filters.priceRange[0], Number(e.target.value)],
              })
            }
            className="w-full bg-gray-900 border border-gray-800 text-white rounded-lg p-2.5 focus:ring-1 focus:ring-purple-500"
            placeholder="Max"
          />
        </div>
      </div>

      {/* Location */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Location
        </label>
        <select
          value={filters.location}
          onChange={(e) =>
            onFiltersChange({ ...filters, location: e.target.value })
          }
          className="w-full bg-gray-900 border border-gray-800 text-white rounded-lg p-2.5 focus:ring-1 focus:ring-purple-500"
        >
          {locations.map((location) => (
            <option key={location} value={location.toLowerCase()}>
              {location}
            </option>
          ))}
        </select>
      </div>

      {/* Ownership Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Ownership Type
        </label>
        <select
          value={filters.ownershipType}
          onChange={(e) =>
            onFiltersChange({ ...filters, ownershipType: e.target.value })
          }
          className="w-full bg-gray-900 border border-gray-800 text-white rounded-lg p-2.5 focus:ring-1 focus:ring-purple-500"
        >
          {ownershipTypes.map((type) => (
            <option key={type} value={type.toLowerCase()}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Reset Button */}
      <button
        onClick={() =>
          onFiltersChange({
            propertyType: "all",
            priceRange: [0, 10000000],
            location: "all",
            ownershipType: "all",
          })
        }
        className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
      >
        Reset Filters
      </button>
    </div>
  );
};

export default FilterBar;
