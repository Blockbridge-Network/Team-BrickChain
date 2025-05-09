"use client";

import { useState } from 'react';
import Image from 'next/image';
import { ListingFormData } from '@/lib/types/listing';

interface PreviewFormProps {
  formData: ListingFormData;
  onSubmit: () => Promise<void>;
  onPrevious: () => void;
}

export default function PreviewForm({ formData, onSubmit, onPrevious }: PreviewFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError('');
      await onSubmit();
    } catch (err) {
      console.error('Error submitting listing:', err);
      setError('Failed to submit listing. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatLocation = () => {
    return [
      formData.propertyDetails.location,
      formData.propertyDetails.city,
      formData.propertyDetails.state,
      formData.propertyDetails.country
    ].filter(Boolean).join(', ');
  };

  return (
    <div className="space-y-8">
      {/* Property Preview */}
      <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
        <h3 className="text-xl font-medium text-white mb-6">Property Preview</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Main Image */}
          {formData.documents.propertyImages[0] && (
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={URL.createObjectURL(formData.documents.propertyImages[0])}
                alt={formData.propertyDetails.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Property Details */}
          <div className="space-y-4">
            <h4 className="text-2xl font-medium text-white">
              {formData.propertyDetails.title}
            </h4>
            <p className="text-gray-400">{formData.propertyDetails.description}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Location</p>
                <p className="text-white">{formatLocation()}</p>
              </div>
              <div>
                <p className="text-gray-400">Property Type</p>
                <p className="text-white">{formData.propertyDetails.type}</p>
              </div>
              <div>
                <p className="text-gray-400">Size</p>
                <p className="text-white">{formData.propertyDetails.size} sq ft</p>
              </div>
              <div>
                <p className="text-gray-400">Year Built</p>
                <p className="text-white">{formData.propertyDetails.yearBuilt}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-400">Price</p>
                <p className="text-white font-medium">${formData.propertyDetails.price}</p>
              </div>
            </div>

            {/* Amenities */}
            {formData.propertyDetails.amenities.length > 0 && (
              <div>
                <p className="text-gray-400 mb-2">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {formData.propertyDetails.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="px-3 py-1 bg-gray-800 text-white text-sm rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tokenization Summary */}
      <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
        <h3 className="text-xl font-medium text-white mb-6">Tokenization Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-gray-400">Total Tokens</p>              <p className="text-white font-medium">{formData.tokenization.totalTokens}</p>
            </div>
            <div>
              <p className="text-gray-400">Price per Token</p>
              <p className="text-white font-medium">${formData.tokenization.pricePerToken}</p>
            </div>
            <div>
              <p className="text-gray-400">Minimum Investment</p>
              <p className="text-white font-medium">${formData.tokenization.minInvestment}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-gray-400">Trading Delay</p>
              <p className="text-white font-medium">{formData.tokenization.tradingDelay} days</p>
            </div>
            <div>
              <p className="text-gray-400">Platform Fee</p>
              <p className="text-white font-medium">{formData.tokenization.platformFee}%</p>
            </div>
            <div>
              <p className="text-gray-400">BCT Discounted Fee</p>
              <p className="text-purple-400 font-medium">{formData.tokenization.bctDiscountFee}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Summary */}
      <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
        <h3 className="text-xl font-medium text-white mb-6">Uploaded Documents</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-gray-400 mb-2">Property Images</p>
            <p className="text-white">{formData.documents.propertyImages.length} files</p>
          </div>
          <div>
            <p className="text-gray-400 mb-2">Legal Documents</p>
            <p className="text-white">{formData.documents.legalDocuments.length} files</p>
          </div>
          <div>
            <p className="text-gray-400 mb-2">Additional Certificates</p>
            <p className="text-white">{formData.documents.certificates.length} files</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onPrevious}
          disabled={submitting}
          className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg hover:from-purple-600 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting...' : 'Submit Listing'}
        </button>
      </div>
    </div>
  );
}
