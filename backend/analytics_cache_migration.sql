-- Run this in Supabase SQL Editor
create table if not exists analytics_cache (
  key        text primary key,
  data       jsonb not null,
  updated_at timestamptz default now()
);
