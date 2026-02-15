-- Add is_auto_renewal column to spots
alter table spots add column is_auto_renewal boolean default true;
