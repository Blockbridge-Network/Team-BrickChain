-- Create role enum
CREATE TYPE user_role AS ENUM ('USER', 'ADMIN', 'PROPERTY_OWNER');

-- Add role column to users table with default value
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role user_role NOT NULL DEFAULT 'USER';

-- Create index for role column
CREATE INDEX IF NOT EXISTS users_role_idx ON users(role);
