-- ============================================================
-- Wealcco Multi-Tenant Migration
-- Run this in Supabase SQL Editor (replaces xero_users_migration.sql)
-- ============================================================

-- 1. Clients (tenants) — one row per business client (A, B, C)
create table if not exists clients (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  email        text unique not null,   -- primary contact email
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);

-- 2. Portal users — one login per client + one super_admin
--    role: 'super_admin' | 'client'
--    client_id is NULL for super_admin, set for client role
create table if not exists portal_users (
  id            uuid primary key default gen_random_uuid(),
  client_id     uuid references clients(id) on delete cascade,
  name          text not null,
  email         text unique not null,
  password_hash text,                  -- null until invite is accepted
  role          text not null default 'client' check (role in ('super_admin','client')),
  invite_token  text unique,           -- set on creation, cleared on password set
  invite_sent_at timestamptz,
  created_at    timestamptz not null default now()
);

-- 3. Xero connections — one row per client (their own Xero org)
create table if not exists xero_connections (
  id             bigint primary key generated always as identity,
  client_id      uuid not null unique references clients(id) on delete cascade,
  xero_tenant_id text not null,
  access_token   text not null,
  refresh_token  text not null,
  expires_at     double precision not null,
  updated_at     timestamptz not null default now()
);

-- 4. Analytics cache — scoped per client
create table if not exists analytics_cache (
  id         bigint primary key generated always as identity,
  client_id  uuid not null references clients(id) on delete cascade,
  key        text not null,            -- e.g. 'aged_receivables'
  data       jsonb not null,
  updated_at timestamptz not null default now(),
  unique (client_id, key)
);

-- 5. OAuth states (CSRF) — carry client_id so callback knows who is connecting
create table if not exists oauth_states (
  state      text primary key,
  client_id  uuid references clients(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- 6. Seed the super_admin (Nikhil)
--    Password hash below = SHA-256 of "changeme" — update immediately after first login
insert into portal_users (client_id, name, email, password_hash, role)
values (
  null,
  'Nikhil',
  'nikhil@wealcco.com',
  '4813494d137e1631bba301d5acab6e7bb7aa74ce1185d456565ef51d737677b2',
  'super_admin'
)
on conflict (email) do nothing;
