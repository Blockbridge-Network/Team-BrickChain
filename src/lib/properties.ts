import { createBrowserClient } from '@supabase/ssr';
import { PropertyMetadata, uploadPropertyMetadata } from './storage';
import { useClient } from '../app/client';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface CreatePropertyInput extends PropertyMetadata {
  price: number;
  tokenSupply: number;
  ownershipType: 'FULL' | 'FRACTIONAL';
}

export async function createProperty(
  client: ReturnType<typeof useClient>,
  ownerId: string,
  input: CreatePropertyInput
) {
  try {
    // 1. Upload metadata to IPFS
    const { metadataUri, imageUris, documentUris } = await uploadPropertyMetadata(client, {
      ...input,
      images: input.images,
      documents: input.documents
    });

    // 2. Store essential data in Supabase
    const { data, error } = await supabase
      .from('properties')
      .insert({
        owner_id: ownerId,
        title: input.title,
        location: `${input.location.address}, ${input.location.city}, ${input.location.state}`,
        price: input.price,
        token_supply: input.tokenSupply,
        property_type: input.propertyType,
        ownership_type: input.ownershipType,
        metadata_uri: metadataUri,
        primary_image: imageUris[0], // First image as primary
        city: input.location.city,
        state: input.location.state,
        country: input.location.country,
        total_area: input.totalArea,
        year_built: parseInt(input.yearBuilt),
        status: 'DRAFT'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating property:', error);
    throw error;
  }
}

export async function getProperty(propertyId: string) {
  try {
    // 1. Get basic data from Supabase
    const { data: property, error } = await supabase
      .from('properties')
      .select(`
        *,
        owner:users(*)
      `)
      .eq('id', propertyId)
      .single();

    if (error) throw error;
    if (!property) throw new Error('Property not found');

    // 2. Fetch full metadata from IPFS
    const response = await fetch(property.metadata_uri);
    const metadata: PropertyMetadata = await response.json();

    return {
      ...property,
      metadata
    };
  } catch (error) {
    console.error('Error fetching property:', error);
    throw error;
  }
}

export interface PropertyFilters {
  propertyType?: string;
  priceRange?: [number, number];
  location?: string;
  ownershipType?: 'FULL' | 'FRACTIONAL';
  city?: string;
  state?: string;
  minArea?: number;
  maxArea?: number;
}

export async function searchProperties(filters: PropertyFilters = {}) {
  try {
    let query = supabase
      .from('properties')
      .select(`
        *,
        owner:users(*)
      `);

    // Apply filters
    if (filters.propertyType) {
      query = query.eq('property_type', filters.propertyType);
    }

    if (filters.ownershipType) {
      query = query.eq('ownership_type', filters.ownershipType);
    }

    if (filters.city) {
      query = query.ilike('city', `%${filters.city}%`);
    }

    if (filters.state) {
      query = query.ilike('state', `%${filters.state}%`);
    }

    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    if (filters.priceRange) {
      query = query
        .gte('price', filters.priceRange[0])
        .lte('price', filters.priceRange[1]);
    }

    if (filters.minArea) {
      query = query.gte('total_area', filters.minArea);
    }

    if (filters.maxArea) {
      query = query.lte('total_area', filters.maxArea);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error searching properties:', error);
    throw error;
  }
}
