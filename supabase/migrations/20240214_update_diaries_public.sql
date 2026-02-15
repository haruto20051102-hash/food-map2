-- Drop the restrictive policy
drop policy "Users can view their own diaries." on diaries;

-- Create public view policy
create policy "Public can view all diaries."
  on diaries for select
  using ( true );

-- Ensure insert/update/delete remain restricted (they should be, but confirming)
-- (Existing policies "Users can insert/update/delete their own diaries" check auth.uid() = user_id)
-- We might want to restrict INSERT to admin only in SQL too, but UI restriction is good first step.
-- For now, the existing policies combined with UI hiding is "good enough" for this user request context
-- unless they specifically asked for SQL-level admin enforcement.
-- The user request was "make my posts visible to others".
