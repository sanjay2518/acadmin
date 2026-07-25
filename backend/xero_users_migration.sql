-- Run in Supabase SQL Editor

create table if not exists xero_users (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  email            text unique not null,
  password_hash    text not null,   -- SHA-256 hash of the password
  xero_contact_id  text not null,
  created_at       timestamptz default now()
);

-- ─────────────────────────────────────────────────────────────────
-- How to insert a user manually:
--
-- 1. Generate SHA-256 hash of the password:
--    Python: import hashlib; hashlib.sha256(b"yourpassword").hexdigest()
--    Online: https://emn178.github.io/online-tools/sha256.html
--
-- 2. Insert the user:

insert into xero_users (name, email, password_hash, xero_contact_id)
values (
  'Sanjay Kumar',
  'sanjay@gmail.com',
  '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',  -- hash of "password"
  'your-xero-contact-id-here'
);

-- ─────────────────────────────────────────────────────────────────
-- To get the Xero Contact ID for a user:
-- GET http://localhost:8000/api/users
-- Find the contact by email → copy the "id" field
-- ─────────────────────────────────────────────────────────────────
