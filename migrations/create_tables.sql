-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Clients table: organizations or clients for portfolio items
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  website text,
  logo_url text,
  created_at timestamptz DEFAULT now()
);

-- Works table: portfolio items
CREATE TABLE IF NOT EXISTS works (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Contacts table: messages submitted via contact form
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text,
  phone text,
  message text,
  created_at timestamptz DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_works_created_at ON works (created_at DESC);
