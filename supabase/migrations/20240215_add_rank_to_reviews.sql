-- Add rank column to reviews table
ALTER TABLE reviews ADD COLUMN rank integer CHECK (rank > 0);

-- Create index for faster querying of user's ranked reviews
CREATE INDEX idx_reviews_user_rank ON reviews(user_id, rank);
