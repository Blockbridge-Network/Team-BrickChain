import { Property } from './property';

export interface SampleProperty {
  id: string;
  title: string;
  description: string;
  property_type: Property['property_type'];
  ownership_type: Property['ownership_type'];
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  images: string[];
  amenities: string[];
  size: number;
  bedrooms: number;
  bathrooms: number;
  year_built: number;
  status: Property['status'];
  tokens_sold: number;
  token_supply: number;
  owner: {
    id: string;
    name: string;
    email: string;
    wallet_address: string;
  };
  metadata?: {
    [key: string]: any;
  };
}
