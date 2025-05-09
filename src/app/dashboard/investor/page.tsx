'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PropertyCard from '@/components/dashboard/PropertyCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  imageUrl: string;
  tokenPrice: number;
  availableTokens: number;
  totalTokens: number;
}

// Mock data for now - will be replaced with real data from smart contracts
const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Luxury Apartment in Downtown',
    location: 'New York, NY',
    price: 1500000,
    imageUrl: '/Houses/House1.jpg',
    tokenPrice: 150,
    availableTokens: 8000,
    totalTokens: 10000,
  },
  {
    id: '2',
    title: 'Beachfront Villa',
    location: 'Miami, FL',
    price: 2500000,
    imageUrl: '/Houses/House2.jpg',
    tokenPrice: 250,
    availableTokens: 5000,
    totalTokens: 10000,
  },
  {
    id: '3',
    title: 'Mountain Resort Condo',
    location: 'Aspen, CO',
    price: 1800000,
    imageUrl: '/Houses/House3.jpg',
    tokenPrice: 180,
    availableTokens: 3000,
    totalTokens: 10000,
  },
];

interface InvestmentStats {
  totalInvested: number;
  totalProperties: number;
  monthlyIncome: number;
  yearlyReturn: number;
}

// Mock investment data
const mockInvestments: InvestmentStats = {
  totalInvested: 25000,
  totalProperties: 3,
  monthlyIncome: 450,
  yearlyReturn: 8.5
};

export default function InvestorDashboard() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  
  const handleInvest = (propertyId: string) => {
    router.push(`/invest/${propertyId}`);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Investor Dashboard</h1>
      
      {/* Investment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-400">Total Invested</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${mockInvestments.totalInvested.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-400">Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{mockInvestments.totalProperties}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-400">Monthly Income</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${mockInvestments.monthlyIncome}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-gray-400">Yearly Return</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{mockInvestments.yearlyReturn}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Available Properties */}
      <h2 className="text-2xl font-bold mb-4">Available Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property: Property) => (
          <PropertyCard
            key={property.id}
            {...property}
            onInvest={() => handleInvest(property.id)}
          />
        ))}
      </div>
    </main>
  );
}