-- Run in Supabase SQL Editor

create table if not exists contact_submissions (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  phone      text,
  company    text,
  service    text,
  message    text not null,
  subscribe  boolean default false,
  status     text default 'new',   -- new | in_progress | completed | archived
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
