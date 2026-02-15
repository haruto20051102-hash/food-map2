-- Allow authenticated users to insert new spots
CREATE POLICY "Users can insert spots." ON spots
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
