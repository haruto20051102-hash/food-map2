-- Create spot_recommendations table
create table spot_recommendations (
  id uuid default gen_random_uuid() primary key,
  source_spot_id uuid references spots(id) on delete cascade not null,
  target_spot_id uuid references spots(id) on delete cascade not null,
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table spot_recommendations enable row level security;

-- Policies
create policy "Public recommendations are viewable by everyone."
  on spot_recommendations for select
  using ( true );

create policy "Users can insert recommendations."
  on spot_recommendations for insert
  with check ( auth.role() = 'authenticated' );

-- Add dummy data (This relies on having some spots. If no spots, this will fail or do nothing)
-- It's safer to just provide the table creation and ask user to insert via UI or manual SQL later,
-- but user approved sample data. We will try to insert a self-referencing dummy or hope for IDs.
-- Actually, without knowing IDs, we can't insert relationships easily in SQL without a DO block looking up IDs.

DO $$
DECLARE
  spot1_id uuid;
  spot2_id uuid;
BEGIN
  -- Try to get two spots
  SELECT id INTO spot1_id FROM spots LIMIT 1;
  SELECT id INTO spot2_id FROM spots OFFSET 1 LIMIT 1;

  IF spot1_id IS NOT NULL AND spot2_id IS NOT NULL THEN
    INSERT INTO spot_recommendations (source_spot_id, target_spot_id, comment)
    VALUES (spot1_id, spot2_id, 'ここのラーメンは絶品です！仕事終わりによく行きます。');
    
    INSERT INTO spot_recommendations (source_spot_id, target_spot_id, comment)
    VALUES (spot2_id, spot1_id, '落ち着いた雰囲気で最高です。マスターとの会話も楽しい。');
  END IF;
END $$;
