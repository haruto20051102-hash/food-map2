-- Add is_proxy column to spots table
ALTER TABLE spots ADD COLUMN IF NOT EXISTS is_proxy BOOLEAN DEFAULT false;
