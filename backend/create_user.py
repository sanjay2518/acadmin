import hashlib

name       = "Swift Courier Services"
email      = "billing@swiftcourier.in"
password   = "Scs@323232"
contact_id = "c052e3b6-dc24-4088-b47d-a59c98f65d6e"

password_hash = hashlib.sha256(password.encode()).hexdigest()

print("\n--- Run this in Supabase SQL Editor ---\n")
print(f"""INSERT INTO xero_users (name, email, password_hash, xero_contact_id)
VALUES (
  '{name}',
  '{email}',
  '{password_hash}',
  '{contact_id}'
);""")
