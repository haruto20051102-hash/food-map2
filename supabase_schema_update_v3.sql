-- Add phone_number column to spots table
ALTER TABLE spots ADD COLUMN IF NOT EXISTS phone_number TEXT;
