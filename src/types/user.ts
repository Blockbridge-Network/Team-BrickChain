export interface User {
  id: string;
  email: string;
  name?: string;
  address?: string;
  kycCompleted?: boolean;
  role?: 'INVESTOR' | 'OWNER' | 'ADMIN';
  created_at?: string;
  updated_at?: string;
  wallet_address?: string;
}

export interface UserProfile extends User {
  profileComplete: boolean;
  investmentPreferences?: {
    propertyTypes: string[];
    locations: string[];
    priceRange: [number, number];
  };
}
