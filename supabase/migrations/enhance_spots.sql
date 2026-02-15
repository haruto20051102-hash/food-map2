-- Add new columns for business details and subscription status
ALTER TABLE spots 
ADD COLUMN IF NOT EXISTS regular_holiday text,
ADD COLUMN IF NOT EXISTS business_hours text,
ADD COLUMN IF NOT EXISTS listing_status text DEFAULT 'active', -- 'active', 'cancelled'
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Update RLS policies to allow users to update their own spots (for cancellation)
CREATE POLICY "Users can update own spots." ON spots
  FOR UPDATE USING (auth.uid() = user_id);
