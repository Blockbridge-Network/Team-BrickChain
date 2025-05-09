export interface Location {
  city: string;
  state: string;
  country: string;
  address: string;
  zipCode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface PropertyOwner {
  id: string;
  email: string;
  name: string;
  wallet_address?: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  property_type: 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL';
  ownership_type: 'FULL' | 'FRACTIONAL';
  price: number;
  location: Location;
  images: string[];
  owner: PropertyOwner;
  tokens_sold: number;
  token_supply: number;
  amenities?: string[];
  size?: number;
  bedrooms?: number;
  bathrooms?: number;
  year_built?: number;
  status: 'AVAILABLE' | 'PENDING' | 'SOLD';
  created_at: string;
  updated_at: string;
  type?: string;
  pricePerToken?: number;
  tokensSold?: number;
  tokenSupply?: number;
  documents?: string[];
  propertyDetails?: {
    [key: string]: string | number;
  };
}

export interface PropertyFilters {
  propertyType: string;
  priceRange: [number, number];
  location: string;
  ownershipType: string;
}

export interface PropertyGridProps {
  filters: PropertyFilters;
}
