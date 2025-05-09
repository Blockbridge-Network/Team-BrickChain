'use client';

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  price: number;
  imageUrl: string;
  tokenPrice: number;
  availableTokens: number;
  totalTokens: number;
  onInvest: () => void;
}

export default function PropertyCard({
  id,
  title,
  location,
  price,
  imageUrl,
  tokenPrice,
  availableTokens,
  totalTokens,
  onInvest
}: PropertyCardProps) {
  const percentageSold = ((totalTokens - availableTokens) / totalTokens) * 100;

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-sm text-gray-400">{location}</p>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-400">Property Value</span>
          <span className="font-semibold">${price.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Token Price</span>
          <span className="font-semibold">${tokenPrice.toLocaleString()}</span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>{availableTokens} tokens available</span>
            <span>{percentageSold.toFixed(1)}% sold</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full" 
              style={{ width: `${percentageSold}%` }}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={onInvest}
          disabled={availableTokens === 0}
        >
          {availableTokens > 0 ? 'Invest Now' : 'Sold Out'}
        </Button>
      </CardFooter>
    </Card>
  );
}
