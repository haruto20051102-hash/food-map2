-- Create tables
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  role text default 'user', -- 'user' or 'admin'

  constraint username_length check (char_length(username) >= 3)
);

create table spots (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  type text not null, -- 'Bar', 'Izakaya', etc.
  description text,
  location text, -- Address string
  lat double precision,
  lng double precision,
  images text[], -- Array of image URLs
  tags text[],
  rating numeric default 0,
  is_hidden boolean default true,
  user_id uuid references auth.users not null,
  business_hours text,
  regular_holiday text,
  listing_status text default 'pending_payment', -- 'pending_payment', 'active', 'cancelled'
  subscription_expires_at timestamp with time zone
);

create table favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  spot_id uuid references spots not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, spot_id)
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table profiles enable row level security;
alter table spots enable row level security;
alter table favorites enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Spots policies
create policy "Spots are viewable by everyone." on spots
  for select using (true);

-- Favorites policies
create policy "Users can view their own favorites." on favorites
  for select using (auth.uid() = user_id);

create policy "Users can insert their own favorites." on favorites
  for insert with check (auth.uid() = user_id);

create policy "Users can delete their own favorites." on favorites
  for delete using (auth.uid() = user_id);

-- Initial Mock Data Migration
INSERT INTO spots (name, type, rating, location, description, lat, lng, tags, images)
VALUES
  ('The Library', 'Speakeasy', 4.8, 'Shibuya, Tokyo', 'A hidden speakeasy behind a bookshelf facade.', 35.658034, 139.701636, ARRAY['Quiet', 'Cocktails', 'Date Night'], ARRAY['/images/bar1.jpg']),
  ('Sakura Lane', 'Izakaya', 4.9, 'Nakameguro, Tokyo', 'Authentic izakaya with seasonal dishes.', 35.644395, 139.699026, ARRAY['Lively', 'Sake', 'Local'], ARRAY['/images/izakaya1.jpg']),
  ('Midnight Blue', 'Bar', 4.7, 'Roppongi, Tokyo', 'Upscale bar with live jazz music.', 35.662665, 139.731463, ARRAY['Jazz', 'Whisky', 'Late Night'], ARRAY['/images/bar2.jpg']),
  ('Hidden Garden', 'Restaurant', 4.6, 'Aoyama, Tokyo', 'Italian dining in a secluded garden setting.', 35.666132, 139.713837, ARRAY['Garden', 'Italian', 'Wine'], ARRAY['/images/rest1.jpg']),
  ('Neon Alley', 'Bar', 4.5, 'Shinjuku, Tokyo', 'Futuristic themed bar in Golden Gai.', 35.693825, 139.703356, ARRAY['Neon', 'Cyberpunk', 'Drinks'], ARRAY['/images/bar3.jpg']);

-- Contacts table for inquiries
create table contacts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text default 'unread' -- 'unread', 'read', 'replied'
);

-- Contacts policies
alter table contacts enable row level security;

-- Allow anyone to insert (public form)
create policy "Anyone can insert contacts." on contacts
  for insert with check (true);

-- Only admins/authenticated users (or just me) can view? 
-- For now, let's allow authenticated users to view for simplicity of the admin dashboard idea later.
create policy "Authenticated users can view contacts." on contacts
  for select using (auth.role() = 'authenticated');
