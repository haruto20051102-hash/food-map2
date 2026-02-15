-- Create a storage bucket for spot images
INSERT INTO storage.buckets (id, name, public) VALUES ('spots', 'spots', true);

-- Set up access policies for the storage bucket
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'spots' );
CREATE POLICY "Auth Upload" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'spots' AND auth.role() = 'authenticated' );
