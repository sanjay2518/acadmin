-- Run this in your Supabase SQL Editor

-- Customers table (source of truth for invoicing)
create table if not exists customers (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  email            text,
  amount           numeric(12, 2) not null default 0,
  invoice_status   text not null default 'pending',  -- pending | synced
  xero_contact_id  text,
  xero_invoice_id  text,
  created_at       timestamptz not null default now()
);

-- Xero OAuth tokens (one row per connected org)
create table if not exists xero_tokens (
  id             bigint primary key generated always as identity,
  access_token   text not null,
  refresh_token  text not null,
  expires_at     double precision not null,
  tenant_id      text not null,
  updated_at     timestamptz not null default now()
);

-- Temporary OAuth state tokens (CSRF protection)
create table if not exists oauth_states (
  state       text primary key,
  created_at  timestamptz not null default now()
);

-- Auto-clean states older than 10 minutes (optional cron or trigger)
-- You can also just delete them in the callback as the code already does.
