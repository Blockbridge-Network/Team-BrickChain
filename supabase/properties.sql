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
