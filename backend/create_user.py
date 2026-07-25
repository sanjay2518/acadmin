import hashlib

name       = " user name "
email      = "user mail id"
password   = "user password"
contact_id = "user contact Id "

password_hash = hashlib.sha256(password.encode()).hexdigest()

print("\n--- Run this in Supabase SQL Editor ---\n")
print(f"""INSERT INTO xero_users (name, email, password_hash, xero_contact_id)
VALUES (
  '{name}',
  '{email}',
  '{password_hash}',
  '{contact_id}'
);""")
