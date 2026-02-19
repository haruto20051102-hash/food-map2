-- Add has_parking column to spots table
ALTER TABLE spots ADD COLUMN IF NOT EXISTS has_parking BOOLEAN DEFAULT false;
