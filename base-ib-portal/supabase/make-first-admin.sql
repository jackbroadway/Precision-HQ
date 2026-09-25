-- Promote your own account to admin.
-- 1. First create your login: Dashboard → Authentication → Users → Add user
--    (tick "Auto Confirm User").
-- 2. Replace the email below and run this in the SQL Editor.
-- The SQL editor runs as the database owner, so it bypasses RLS — which is
-- exactly why this is the only way to create the first admin.

update public.profiles
set role = 'admin'
where email = 'you@example.com';

-- Check it worked (should return one row with role = admin):
select id, email, role from public.profiles where role = 'admin';
