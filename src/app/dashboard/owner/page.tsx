'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/ui/Spinner';
import WalletConnection from '@/components/profile/WalletConnection';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  imageUrl: string;
  status: 'listed' | 'pending' | 'tokenized';
  totalTokens: number;
  soldTokens: number;
  images: string[];
  created_at: string;
}

export default function OwnerDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      if (!user?.walletAddress) return;
      
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('owner_address', user.walletAddress);

        if (error) throw error;
        setProperties(data || []);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [user?.walletAddress]);

  const handleAddProperty = () => {
    router.push('/list-property');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (!user?.walletAddress) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="mb-8">Please connect your wallet to access the owner dashboard.</p>
          <WalletConnection />
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Property Owner Dashboard</h1>
        <Button onClick={handleAddProperty}>Add New Property</Button>
      </div>

      {/* Property Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-400">Total Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{properties.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-400">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ${properties.reduce((sum, prop) => sum + prop.price, 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-400">Tokenized Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {properties.filter(p => p.status === 'tokenized').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Property List */}
      <h2 className="text-2xl font-bold mb-4">Your Properties</h2>
      {properties.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-400 mb-4">You haven&apos;t listed any properties yet.</p>
          <Button onClick={handleAddProperty}>List Your First Property</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={property.images[0] || '/Houses/House1.jpg'}
                  alt={property.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-sm ${
                  property.status === 'tokenized' ? 'bg-green-500/80' :
                  property.status === 'pending' ? 'bg-yellow-500/80' :
                  'bg-blue-500/80'
                }`}>
                  {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{property.title}</CardTitle>
                <p className="text-sm text-gray-400">{property.location}</p>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Property Value</span>
                  <span className="font-semibold">${property.price.toLocaleString()}</span>
                </div>
                {property.status === 'tokenized' && property.totalTokens > 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Token Sales Progress</span>
                      <span>{((property.soldTokens / property.totalTokens) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(property.soldTokens / property.totalTokens) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push(`/property/${property.id}`)}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}