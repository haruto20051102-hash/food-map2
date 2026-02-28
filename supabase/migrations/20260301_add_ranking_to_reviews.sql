-- Add rank column to reviews table
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS rank integer CHECK (rank > 0);

-- Create index for faster querying of user's ranked reviews
CREATE INDEX IF NOT EXISTS idx_reviews_user_rank ON reviews(user_id, rank);
