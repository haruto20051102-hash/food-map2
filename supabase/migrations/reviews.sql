-- Create reviews table
create table reviews (
  id uuid default gen_random_uuid() primary key,
  spot_id uuid references spots not null,
  user_id uuid references auth.users not null,
  rating integer check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for reviews
alter table reviews enable row level security;

create policy "Reviews are viewable by everyone." on reviews
  for select using (true);

create policy "Users can insert their own reviews." on reviews
  for insert with check (auth.uid() = user_id);

-- Optional: Prevent multiple reviews from same user for same spot
-- create unique index unique_review_per_spot_user on reviews(spot_id, user_id);
