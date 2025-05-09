'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// import { Slider } from '@/components/ui/slider';

export default function PreferencesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    investmentStyle: '' as 'conservative' | 'moderate' | 'aggressive' | '',
    monthlyInvestment: 500,
    propertyTypes: [] as string[],
    locations: [] as string[]
  });

  const propertyTypes = [
    'Residential',
    'Commercial',
    'Industrial',
    'Land'
  ];

  const locations = [
    'North America',
    'Europe',
    'Asia',
    'Australia',
    'South America',
    'Africa'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save preferences to user profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/marketplace');
    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePropertyType = (type: string) => {
    setPreferences(prev => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(type)
        ? prev.propertyTypes.filter(t => t !== type)
        : [...prev.propertyTypes, type]
    }));
  };

  const toggleLocation = (location: string) => {
    setPreferences(prev => ({
      ...prev,
      locations: prev.locations.includes(location)
        ? prev.locations.filter(l => l !== location)
        : [...prev.locations, location]
    }));
  };

  return (
    <main className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Investment Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Investment Style */}
              <div className="space-y-4">
                <label className="text-sm font-medium block">Investment Style</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['conservative', 'moderate', 'aggressive'].map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setPreferences(prev => ({ ...prev, investmentStyle: style as any }))}
                      className={`p-4 rounded-lg border ${
                        preferences.investmentStyle === style
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="font-medium capitalize">{style}</div>
                      <div className="text-sm text-gray-400 mt-1">
                        {style === 'conservative' && 'Lower risk, stable returns'}
                        {style === 'moderate' && 'Balanced risk and returns'}
                        {style === 'aggressive' && 'Higher risk, higher potential'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Monthly Investment */}
              <div className="space-y-4">
                <label className="text-sm font-medium block">
                  Monthly Investment Target: ${preferences.monthlyInvestment}
                </label>
                {/*
                <Slider
                  value={[preferences.monthlyInvestment]}
                  onValueChange={([value]) => setPreferences(prev => ({ ...prev, monthlyInvestment: value }))}
                  min={100}
                  max={10000}
                  step={100}
                  className="w-full"
                />
                */}
                <div className="flex justify-between text-sm text-gray-400">
                  <span>$100</span>
                  <span>$10,000</span>
                </div>
              </div>

              {/* Property Types */}
              <div className="space-y-4">
                <label className="text-sm font-medium block">Preferred Property Types</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {propertyTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => togglePropertyType(type)}
                      className={`p-2 rounded-lg border text-sm ${
                        preferences.propertyTypes.includes(type)
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Locations */}
              <div className="space-y-4">
                <label className="text-sm font-medium block">Preferred Locations</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {locations.map((location) => (
                    <button
                      key={location}
                      type="button"
                      onClick={() => toggleLocation(location)}
                      className={`p-2 rounded-lg border text-sm ${
                        preferences.locations.includes(location)
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      {location}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Saving...' : 'Save Preferences & Continue'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
