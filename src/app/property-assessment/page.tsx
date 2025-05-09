'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileUploader } from '@/components/listing/steps/FileUploader';

export default function PropertyAssessmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [assessment, setAssessment] = useState({
    propertyAddress: '',
    propertyType: 'residential',
    yearBuilt: '',
    totalArea: '',
    estimatedValue: '',
    description: '',
    photos: [] as File[],
    condition: '',
    amenities: [] as string[]
  });

  const propertyTypes = ['residential', 'commercial', 'industrial', 'land'];
  const conditionOptions = ['excellent', 'good', 'fair', 'needs-work'];
  const amenityOptions = [
    'parking',
    'security',
    'elevator',
    'pool',
    'gym',
    'garden',
    'air-conditioning',
    'furnished'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate assessment submission and valuation
      await new Promise(resolve => setTimeout(resolve, 2000));
      router.push('/documents');
    } catch (error) {
      console.error('Assessment submission failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAmenity = (amenity: string) => {
    setAssessment(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  return (
    <main className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Property Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Property Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium block mb-2">Property Address</label>
                  <Input
                    value={assessment.propertyAddress}
                    onChange={e => setAssessment(prev => ({ ...prev, propertyAddress: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Property Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {propertyTypes.map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setAssessment(prev => ({ ...prev, propertyType: type }))}
                        className={`p-2 rounded-lg border capitalize ${
                          assessment.propertyType === type
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium block mb-2">Year Built</label>
                  <Input
                    type="number"
                    value={assessment.yearBuilt}
                    onChange={e => setAssessment(prev => ({ ...prev, yearBuilt: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Total Area (sq ft)</label>
                  <Input
                    type="number"
                    value={assessment.totalArea}
                    onChange={e => setAssessment(prev => ({ ...prev, totalArea: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Estimated Value ($)</label>
                  <Input
                    type="number"
                    value={assessment.estimatedValue}
                    onChange={e => setAssessment(prev => ({ ...prev, estimatedValue: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {/* Property Description */}
              <div>
                <label className="text-sm font-medium block mb-2">Property Description</label>
                <Textarea
                  value={assessment.description}
                  onChange={e => setAssessment(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  required
                />
              </div>

              {/* Property Photos */}
              <div>
                <label className="text-sm font-medium block mb-2">Property Photos</label>
                <FileUploader
                  label="Upload Property Photos"
                  description="Upload clear photos of the property (exterior and interior)"
                  accept="image/*"
                  multiple={true}
                  files={assessment.photos}
                  onFilesChange={files => setAssessment(prev => ({ ...prev, photos: files }))}
                  maxFiles={10}
                  maxSize={5242880} // 5MB
                />
              </div>

              {/* Property Condition */}
              <div>
                <label className="text-sm font-medium block mb-2">Property Condition</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {conditionOptions.map(condition => (
                    <button
                      key={condition}
                      type="button"
                      onClick={() => setAssessment(prev => ({ ...prev, condition }))}
                      className={`p-2 rounded-lg border capitalize ${
                        assessment.condition === condition
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      {condition.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="text-sm font-medium block mb-2">Amenities</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {amenityOptions.map(amenity => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`p-2 rounded-lg border capitalize ${
                        assessment.amenities.includes(amenity)
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      {amenity.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Submitting Assessment...' : 'Submit for Valuation'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
