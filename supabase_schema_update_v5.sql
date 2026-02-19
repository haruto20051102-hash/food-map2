-- Add owner_email column to spots table
ALTER TABLE spots ADD COLUMN IF NOT EXISTS owner_email TEXT;
