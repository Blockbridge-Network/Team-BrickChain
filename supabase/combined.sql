-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  name TEXT,
  phone TEXT,
  country TEXT,
  kyc_status TEXT DEFAULT 'PENDING',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create KYC documents table
CREATE TABLE kyc_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  document_hash TEXT NOT NULL,
  status TEXT DEFAULT 'PENDING',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create properties table
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  price DECIMAL NOT NULL,
  token_supply INTEGER NOT NULL,
  tokens_sold INTEGER DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  documents TEXT[] DEFAULT '{}',
  contract_address TEXT,
  ownership_type TEXT NOT NULL DEFAULT 'FRACTIONAL',
  status TEXT DEFAULT 'DRAFT',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create investments table
CREATE TABLE investments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investor_id UUID REFERENCES users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  token_amount INTEGER NOT NULL,
  investment_amount DECIMAL NOT NULL,
  tx_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Add RLS (Row Level Security) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Public read access for properties" ON properties
  FOR SELECT USING (true);

CREATE POLICY "Users can view their own KYC documents" ON kyc_documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own investments" ON investments
  FOR SELECT USING (auth.uid() = investor_id);
-- Update the properties table to focus on essential queryable data
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  price DECIMAL NOT NULL,
  token_supply INTEGER NOT NULL,
  tokens_sold INTEGER DEFAULT 0,
  property_type TEXT NOT NULL,
  ownership_type TEXT NOT NULL DEFAULT 'FRACTIONAL',
  status TEXT DEFAULT 'DRAFT',
  -- IPFS references
  metadata_uri TEXT NOT NULL,
  primary_image TEXT NOT NULL,
  -- Searchable fields
  city TEXT,
  state TEXT,
  country TEXT,
  total_area DECIMAL,
  year_built INTEGER,
  -- Smart contract data
  contract_address TEXT,
  token_id TEXT,
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Add a GiST index for location-based queries
CREATE INDEX properties_location_idx ON properties USING GiST (
  (LOWER(location))
);

-- Add indexes for common queries
CREATE INDEX properties_price_idx ON properties (price);
CREATE INDEX properties_type_idx ON properties (property_type);
CREATE INDEX properties_ownership_idx ON properties (ownership_type);
CREATE INDEX properties_status_idx ON properties (status);

-- Create a function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger for updating timestamps
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
