"use client";

import { useState } from 'react';
import { PropertyDetailsForm as PropertyDetailsFormType } from '@/lib/types/listing';

interface PropertyDetailsFormProps {
  data: PropertyDetailsFormType;
  onUpdate: (data: Partial<PropertyDetailsFormType>) => void;
  onNext: () => void;
}

const propertyTypes = [
  'Residential',
  'Commercial',
  'Industrial',
  'Land',
  'Mixed-Use',
];

const amenityOptions = [
  'Parking',
  'Security',
  'Pool',
  'Elevator',
  'Garden',
  'Smart Home',
  'Gym',
  'Meeting Rooms',
  '24/7 Access',
  'Loading Bays',
];

export default function PropertyDetailsForm({ data, onUpdate, onNext }: PropertyDetailsFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!data.title) newErrors.title = 'Title is required';
    if (!data.type) newErrors.type = 'Property type is required';
    if (!data.location) newErrors.location = 'Street address is required';
    if (!data.city) newErrors.city = 'City is required';
    if (!data.state) newErrors.state = 'State is required';
    if (!data.country) newErrors.country = 'Country is required';
    if (!data.description) newErrors.description = 'Description is required';
    if (!data.price) newErrors.price = 'Price is required';
    if (data.description && data.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Property Title
          </label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter property title"
          />
          {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Property Type
          </label>
          <select
            value={data.type}
            onChange={(e) => onUpdate({ type: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select type</option>
            {propertyTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
        </div>

        {/* Location */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Street Address
          </label>
          <input
            type="text"
            value={data.location}
            onChange={(e) => onUpdate({ location: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter street address"
          />
          {errors.location && <p className="mt-1 text-sm text-red-500">{errors.location}</p>}
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            City
          </label>
          <input
            type="text"
            value={data.city}
            onChange={(e) => onUpdate({ city: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter city"
          />
          {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
        </div>

        {/* State */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            State
          </label>
          <input
            type="text"
            value={data.state}
            onChange={(e) => onUpdate({ state: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter state"
          />
          {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state}</p>}
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Country
          </label>
          <input
            type="text"
            value={data.country}
            onChange={(e) => onUpdate({ country: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter country"
          />
          {errors.country && <p className="mt-1 text-sm text-red-500">{errors.country}</p>}
        </div>

        {/* Size */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Property Size (sq ft)
          </label>
          <input
            type="text"
            value={data.size}
            onChange={(e) => onUpdate({ size: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter size in square feet"
          />
        </div>

        {/* Year Built */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Year Built
          </label>
          <input
            type="number"
            value={data.yearBuilt}
            onChange={(e) => onUpdate({ yearBuilt: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter year built"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Property Price ($)
          </label>
          <input
            type="text"
            value={data.price}
            onChange={(e) => onUpdate({ price: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter property price"
          />
          {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
        </div>

        {/* Amenities */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Amenities
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {amenityOptions.map((amenity) => (
              <label
                key={amenity}
                className={`flex items-center p-3 rounded-lg border ${
                  data.amenities.includes(amenity)
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-gray-700 bg-gray-800'
                } cursor-pointer transition-all duration-200`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={data.amenities.includes(amenity)}
                  onChange={(e) => {
                    const newAmenities = e.target.checked
                      ? [...data.amenities, amenity]
                      : data.amenities.filter(a => a !== amenity);
                    onUpdate({ amenities: newAmenities });
                  }}
                />
                <span className={`text-sm ${
                  data.amenities.includes(amenity) ? 'text-white' : 'text-gray-400'
                }`}>
                  {amenity}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={data.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            rows={4}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Describe the property..."
          />
          {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end pt-6">
        <button
          type="submit"
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg hover:from-purple-600 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Continue
        </button>
      </div>
    </form>
  );
}
