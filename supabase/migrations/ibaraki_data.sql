-- Clear existing data (optional, or just add new ones. Let's clear for "limiting")
DELETE FROM reviews;
DELETE FROM favorites;
DELETE FROM spots;

-- Insert Ibaraki Spots
INSERT INTO spots (name, type, rating, location, description, lat, lng, tags, images)
VALUES
  ('Secret Mito Izakaya', 'Izakaya', 4.8, 'Mito, Ibaraki', 'A hidden gem near Kairakuen, serving the best natto dishes and local sake.', 36.373413, 140.448206, ARRAY['Local Sake', 'Natto', 'Cozy'], ARRAY['https://images.unsplash.com/photo-1583478902598-c67b60563456?auto=format&fit=crop&q=80']),
  
  ('Tsukuba Star Cafe', 'Cafe', 4.7, 'Tsukuba, Ibaraki', 'Quiet cafe near the Space Center with a futuristic interior.', 36.066487, 140.126830, ARRAY['Coffee', 'Quiet', 'Space'], ARRAY['https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80']),
  
  ('Oarai Coastal Bar', 'Bar', 4.9, 'Oarai, Ibaraki', 'Ocean view bar perfect for watching the sunrise (or sunset).', 36.307372, 140.589882, ARRAY['Ocean View', 'Cocktails', 'Date Spot'], ARRAY['https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80']),
  
  ('Hitachi Seaside Kitchen', 'Restaurant', 4.6, 'Hitachinaka, Ibaraki', 'Farm-to-table restaurant featuring Ibaraki vegetables and Hitachi beef.', 36.390887, 140.597624, ARRAY['Hitachi Beef', 'Organic', 'Lunch'], ARRAY['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80']),
  
  ('Fukuroda Falls Hideout', 'Restaurant', 4.5, 'Daigo, Ibaraki', 'Traditional restaurant tucked away near the famous falls.', 36.764585, 140.389279, ARRAY['Soba', 'Nature', 'Traditional'], ARRAY['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80']);
