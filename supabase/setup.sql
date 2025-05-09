-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
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
CREATE TABLE IF NOT EXISTS kyc_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  document_hash TEXT NOT NULL,
  status TEXT DEFAULT 'PENDING',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create properties table with enhanced structure
CREATE TABLE IF NOT EXISTS properties (
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create investments table
CREATE TABLE IF NOT EXISTS investments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investor_id UUID REFERENCES users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  token_amount INTEGER NOT NULL,
  investment_amount DECIMAL NOT NULL,
  tx_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS properties_location_idx ON properties USING GiST ((LOWER(location)));
CREATE INDEX IF NOT EXISTS properties_price_idx ON properties (price);
CREATE INDEX IF NOT EXISTS properties_type_idx ON properties (property_type);
CREATE INDEX IF NOT EXISTS properties_ownership_idx ON properties (ownership_type);
CREATE INDEX IF NOT EXISTS properties_status_idx ON properties (status);
CREATE INDEX IF NOT EXISTS users_wallet_idx ON users (wallet_address);
CREATE INDEX IF NOT EXISTS investments_investor_idx ON investments (investor_id);
CREATE INDEX IF NOT EXISTS investments_property_idx ON investments (property_id);

-- Create timestamp update function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_kyc_documents_updated_at ON kyc_documents;
CREATE TRIGGER update_kyc_documents_updated_at
  BEFORE UPDATE ON kyc_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_properties_updated_at ON properties;
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Users policies
CREATE POLICY "Users can read their own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- KYC documents policies
CREATE POLICY "Users can read their own KYC documents"
  ON kyc_documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own KYC documents"
  ON kyc_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Properties policies
CREATE POLICY "Anyone can read published properties"
  ON properties FOR SELECT
  USING (status = 'PUBLISHED' OR auth.uid() = owner_id);

CREATE POLICY "Users can create their own properties"
  ON properties FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their properties"
  ON properties FOR UPDATE
  USING (auth.uid() = owner_id);

-- Investments policies
CREATE POLICY "Users can read their own investments"
  ON investments FOR SELECT
  USING (auth.uid() = investor_id);

CREATE POLICY "Users can create their own investments"
  ON investments FOR INSERT
  WITH CHECK (auth.uid() = investor_id);

-- Insert some test data
INSERT INTO users (wallet_address, email, kyc_status)
VALUES
  ('0x1234567890123456789012345678901234567890', 'test@example.com', 'APPROVED')
ON CONFLICT (wallet_address) DO NOTHING;
