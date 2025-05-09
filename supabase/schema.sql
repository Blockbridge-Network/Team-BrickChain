-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create ENUMs for better data consistency
CREATE TYPE user_status AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED');
CREATE TYPE kyc_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE property_status AS ENUM ('DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'SOLD_OUT', 'DELISTED');
CREATE TYPE property_type AS ENUM ('RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'LAND');
CREATE TYPE ownership_type AS ENUM ('FULL', 'FRACTIONAL');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  name TEXT,
  phone TEXT,
  country TEXT,
  status user_status DEFAULT 'PENDING',
  kyc_status kyc_status DEFAULT 'PENDING',
  metadata_uri TEXT, -- For additional user data in IPFS
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create KYC documents table
CREATE TABLE IF NOT EXISTS kyc_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  document_hash TEXT NOT NULL, -- IPFS hash of the document
  metadata_uri TEXT NOT NULL, -- Additional document metadata in IPFS
  status kyc_status DEFAULT 'PENDING',
  verified_at TIMESTAMP WITH TIME ZONE,
  verification_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  price DECIMAL NOT NULL CHECK (price > 0),
  token_supply INTEGER NOT NULL CHECK (token_supply > 0),
  tokens_sold INTEGER DEFAULT 0 CHECK (tokens_sold >= 0),
  property_type property_type NOT NULL,
  ownership_type ownership_type NOT NULL DEFAULT 'FRACTIONAL',
  status property_status DEFAULT 'DRAFT',
  -- IPFS references
  metadata_uri TEXT NOT NULL,
  primary_image TEXT NOT NULL,
  -- Searchable fields
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT NOT NULL,
  total_area DECIMAL CHECK (total_area > 0),
  year_built INTEGER,
  -- Smart contract data
  contract_address TEXT,
  token_id TEXT,
  -- Verification
  verified_at TIMESTAMP WITH TIME ZONE,
  verification_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  CONSTRAINT tokens_sold_check CHECK (tokens_sold <= token_supply)
);

-- Create investments table
CREATE TABLE IF NOT EXISTS investments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investor_id UUID REFERENCES users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  token_amount INTEGER NOT NULL CHECK (token_amount > 0),
  investment_amount DECIMAL NOT NULL CHECK (investment_amount > 0),
  tx_hash TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'PENDING',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  CONSTRAINT unique_investment UNIQUE (investor_id, property_id, tx_hash)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS properties_location_idx ON properties USING gin (location gin_trgm_ops);
CREATE INDEX IF NOT EXISTS properties_city_idx ON properties(city);
CREATE INDEX IF NOT EXISTS properties_price_idx ON properties(price);
CREATE INDEX IF NOT EXISTS properties_type_idx ON properties(property_type);
CREATE INDEX IF NOT EXISTS properties_ownership_idx ON properties(ownership_type);
CREATE INDEX IF NOT EXISTS properties_status_idx ON properties(status);
CREATE INDEX IF NOT EXISTS users_wallet_idx ON users(wallet_address);
CREATE INDEX IF NOT EXISTS investments_investor_idx ON investments(investor_id);
CREATE INDEX IF NOT EXISTS investments_property_idx ON investments(property_id);

-- Update function for timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
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

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Users can read their own KYC documents" ON kyc_documents;
DROP POLICY IF EXISTS "Users can create their own KYC documents" ON kyc_documents;
DROP POLICY IF EXISTS "Anyone can read published properties" ON properties;
DROP POLICY IF EXISTS "Users can create their own properties" ON properties;
DROP POLICY IF EXISTS "Owners can update their properties" ON properties;
DROP POLICY IF EXISTS "Users can read their own investments" ON investments;
DROP POLICY IF EXISTS "Users can create their own investments" ON investments;

-- Create RLS Policies

-- Users policies
CREATE POLICY "Public users can read basic profile info"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  USING (auth.uid()::text = id::text);

-- KYC documents policies
CREATE POLICY "Users can read their own KYC documents"
  ON kyc_documents FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create their own KYC documents"
  ON kyc_documents FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

-- Properties policies
CREATE POLICY "Anyone can read published properties"
  ON properties FOR SELECT
  USING (status = 'PUBLISHED' OR auth.uid()::text = owner_id::text);

CREATE POLICY "Users can create their own properties"
  ON properties FOR INSERT
  WITH CHECK (auth.uid()::text = owner_id::text);

CREATE POLICY "Owners can update their properties"
  ON properties FOR UPDATE
  USING (auth.uid()::text = owner_id::text);

CREATE POLICY "Owners can delete their draft properties"
  ON properties FOR DELETE
  USING (auth.uid()::text = owner_id::text AND status = 'DRAFT');

-- Investments policies
CREATE POLICY "Users can read their own investments"
  ON investments FOR SELECT
  USING (auth.uid()::text = investor_id::text);

CREATE POLICY "Users can create their own investments"
  ON investments FOR INSERT
  WITH CHECK (auth.uid()::text = investor_id::text);

-- Insert test data (only if tables are empty)
INSERT INTO users (wallet_address, email, name, kyc_status, status)
SELECT 
  '0x1234567890123456789012345678901234567890',
  'test@example.com',
  'Test User',
  'APPROVED',
  'ACTIVE'
WHERE NOT EXISTS (SELECT 1 FROM users LIMIT 1);
