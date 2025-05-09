-- Create role enum if it doesn't exist
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('PROPERTY_OWNER', 'INVESTOR');
    END IF;
END $$;

-- Add role column if it doesn't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role user_role NOT NULL DEFAULT 'INVESTOR';

-- Create index on role column
CREATE INDEX IF NOT EXISTS users_role_idx ON users(role);
