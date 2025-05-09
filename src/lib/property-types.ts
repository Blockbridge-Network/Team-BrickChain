// src/lib/property-types.ts
export interface PropertyMetadata {
  propertyAddress: string;
  description: string;
  amenities: string[];
  yearBuilt: number;
  totalArea: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpots?: number;
  constructionDetails?: string;
  legalInformation?: string;
  propertyTaxes?: number;
  maintenanceFees?: number;
}

export interface TokenizationDetails {
  ownershipType: 'FULL' | 'FRACTIONAL';
  totalTokens: number;
  pricePerToken: number;
  minimumInvestment: number;
  tradingDelay: number;
  platformFee: number;
  bctDiscountRate: number;
}

export interface PropertyImages {
  primary: string;
  gallery: string[];
  floorPlan?: string;
}

export interface PropertyDocuments {
  titleDeed: string;
  valuationReport?: string;
  structuralReport?: string;
  propertyInspection?: string;
  insuranceDocs?: string;
  additionalDocs?: string[];
}

export interface PropertyListing {
  id?: string;
  ownerId: string;
  title: string;
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  price: number;
  propertyType: 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL' | 'LAND';
  status: 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'SOLD_OUT' | 'DELISTED';
  metadata: PropertyMetadata;
  tokenization: TokenizationDetails;
  images: PropertyImages;
  documents: PropertyDocuments;
  createdAt?: Date;
  updatedAt?: Date;
  verifiedAt?: Date;
  contractAddress?: string;
  tokenId?: string;
}

export const PROPERTY_TYPES = ['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'LAND'] as const;

export const OWNERSHIP_TYPES = ['FULL', 'FRACTIONAL'] as const;

export const AMENITIES = [
  'Air Conditioning',
  'Heating',
  'Parking',
  'Pool',
  'Gym',
  'Security System',
  'Garden',
  'Balcony',
  'Elevator',
  'Storage',
  'Solar Panels',
  'EV Charging',
  'Smart Home',
  'Pet Friendly'
] as const;

export const REQUIRED_DOCUMENTS = {
  titleDeed: 'Title Deed or Property Ownership Certificate',
  valuationReport: 'Professional Valuation Report',
  structuralReport: 'Structural Survey Report',
  propertyInspection: 'Property Inspection Report',
  insuranceDocs: 'Property Insurance Documentation'
} as const;

export function validatePropertyListing(listing: PropertyListing): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Basic validation
  if (!listing.title?.trim()) errors.push('Title is required');
  if (!listing.location?.address?.trim()) errors.push('Property address is required');
  if (!listing.location?.city?.trim()) errors.push('City is required');
  if (!listing.location?.country?.trim()) errors.push('Country is required');
  if (!listing.price || listing.price <= 0) errors.push('Valid price is required');
  if (!listing.propertyType || !PROPERTY_TYPES.includes(listing.propertyType as any)) {
    errors.push('Valid property type is required');
  }

  // Metadata validation
  if (!listing.metadata?.totalArea || listing.metadata.totalArea <= 0) {
    errors.push('Valid total area is required');
  }
  if (!listing.metadata?.yearBuilt || listing.metadata.yearBuilt < 1800) {
    errors.push('Valid construction year is required');
  }

  // Tokenization validation
  if (!listing.tokenization?.totalTokens || listing.tokenization.totalTokens <= 0) {
    errors.push('Valid total tokens amount is required');
  }
  if (!listing.tokenization?.pricePerToken || listing.tokenization.pricePerToken <= 0) {
    errors.push('Valid price per token is required');
  }
  if (!listing.tokenization?.minimumInvestment || listing.tokenization.minimumInvestment <= 0) {
    errors.push('Valid minimum investment amount is required');
  }

  // Images validation
  if (!listing.images?.primary) errors.push('Primary property image is required');
  if (!listing.images?.gallery?.length) errors.push('At least one gallery image is required');

  // Documents validation
  if (!listing.documents?.titleDeed) errors.push('Title deed document is required');

  return {
    isValid: errors.length === 0,
    errors
  };
}