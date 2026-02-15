-- Create diaries table
create table diaries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  spot_id uuid references spots(id) on delete set null, -- Optional link to a spot
  title text,
  content text,
  images text[], -- Array of image URLs
  rating integer check (rating >= 1 and rating <= 5),
  visited_at date default now(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table diaries enable row level security;

-- Policies
create policy "Users can view their own diaries."
  on diaries for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own diaries."
  on diaries for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own diaries."
  on diaries for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own diaries."
  on diaries for delete
  using ( auth.uid() = user_id );
