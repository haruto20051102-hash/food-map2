-- Add rank column to favorites table
ALTER TABLE favorites ADD COLUMN rank INTEGER;

-- Initialize rank with existing data (if any)
-- This is a simple approximation; in production you'd want a more robust initialization
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at) as r
  FROM favorites
)
UPDATE favorites
SET rank = ranked.r
FROM ranked
WHERE favorites.id = ranked.id;
