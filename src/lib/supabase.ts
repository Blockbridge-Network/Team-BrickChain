import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// User related functions
export async function createUser(walletAddress: string, email?: string) {
  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        wallet_address: walletAddress,
        email,
        kyc_status: 'PENDING'
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserByWallet(walletAddress: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
  return data;
}

// KYC related functions
export async function updateKycStatus(userId: string, status: 'PENDING' | 'APPROVED' | 'REJECTED', documentIpfsHash?: string) {
  const { data, error } = await supabase
    .from('kyc_documents')
    .upsert({
      user_id: userId,
      status,
      document_hash: documentIpfsHash,
      updated_at: new Date().toISOString()
    });

  if (error) throw error;
  return data;
}

// Property related functions
export async function createProperty(
  ownerId: string,
  propertyData: {
    title: string;
    description: string;
    location: string;
    price: number;
    token_supply: number;
    images: string[];
    documents: string[];
  }
) {
  const { data, error } = await supabase
    .from('properties')
    .insert([
      {
        owner_id: ownerId,
        ...propertyData,
        status: 'DRAFT'
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getPropertyById(id: string) {
  const { data, error } = await supabase
    .from('properties')
    .select(`
      *,
      owner:users(*),
      investments(
        *,
        investor:users(*)
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getProperties(filters?: {
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  ownershipType?: 'FULL' | 'FRACTIONAL';
}) {
  let query = supabase
    .from('properties')
    .select(`
      *,
      owner:users(*)
    `);

  if (filters) {
    if (filters.propertyType) {
      query = query.eq('type', filters.propertyType);
    }
    if (filters.minPrice) {
      query = query.gte('price', filters.minPrice);
    }
    if (filters.maxPrice) {
      query = query.lte('price', filters.maxPrice);
    }
    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }
    if (filters.ownershipType) {
      query = query.eq('ownership_type', filters.ownershipType);
    }
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}
