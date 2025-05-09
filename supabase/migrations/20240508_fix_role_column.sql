-- Drop the old migration if it exists
DROP TYPE IF EXISTS user_role CASCADE;

-- Create the enum
CREATE TYPE user_role AS ENUM ('PROPERTY_OWNER', 'INVESTOR');

-- Drop existing role column if it exists with incorrect type
ALTER TABLE users DROP COLUMN IF EXISTS role;

-- Add role column with correct type
ALTER TABLE users ADD COLUMN role user_role NOT NULL DEFAULT 'INVESTOR';

-- Create index
CREATE INDEX IF NOT EXISTS users_role_idx ON users(role);

-- Update any existing users to be investors by default
UPDATE users SET role = 'INVESTOR' WHERE role IS NULL;
