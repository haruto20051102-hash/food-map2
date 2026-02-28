-- Add images column to reviews table
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}';

-- Create a storage bucket for review images if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('reviews', 'reviews', true)
ON CONFLICT (id) DO NOTHING;

-- Set up Storage RLS policies for the reviews bucket
-- Allow public access to view images
-- Set up Storage RLS policies for the reviews bucket
-- Allow public access to view images
CREATE POLICY "Public Access for Reviews" ON storage.objects
    FOR SELECT USING (bucket_id = 'reviews');

-- Allow authenticated users to upload their own review images
-- The path usually includes the user ID for organization
CREATE POLICY "Users can upload review images" ON storage.objects
    FOR INSERT 
    WITH CHECK (
        bucket_id = 'reviews' 
        AND auth.role() = 'authenticated'
    );

-- Allow users to update/delete their own uploaded images
CREATE POLICY "Users can edit their review images" ON storage.objects
    FOR UPDATE
    USING (
        bucket_id = 'reviews' 
        AND auth.role() = 'authenticated'
    );

CREATE POLICY "Users can delete their review images" ON storage.objects
    FOR DELETE
    USING (
        bucket_id = 'reviews' 
        AND auth.role() = 'authenticated'
    );
