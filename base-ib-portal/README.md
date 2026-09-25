# Base.IB Partner Portal — Phase 1

Next.js 16 · Supabase (Auth + Postgres with row-level security) · Tailwind v4 · Vercel.

Two roles:

- **Admin**: adds sub-IBs (broker, IB account ID, $/lot rate), edits them,
  deactivates or deletes them, and sees each partner's training progress.
- **Sub-IB**: signs in to a partner hub: their profile, the Base IB
  Playbook as 10 separate modules with progress tracking, and reference guides
  (Quick Reference, Glossary, FAQ). Broker, IB account ID and $/lot rate are
  admin-only: sub-IBs can't read them, even through the API.
- **Announcements**: admins post updates (optionally pinned); they appear on
  every partner's dashboard and under News.
- **Marketing assets**: admins upload images and ready-to-post captions;
  partners copy captions in one tap and download images.

Security lives in the database. RLS policies in
`supabase/migrations/…_phase1_auth_roles.sql` mean a sub-IB can only ever read
their own rows, and only admins can write. This holds even if someone calls the
Supabase API directly with the public key.

---

## 1. Supabase setup (you do this once)

1. **Create a project** at <https://supabase.com/dashboard>. Pick a region close to your users.
2. **Run the schema.** Go to *SQL Editor → New query*, paste the whole of
   `supabase/migrations/20260925000000_phase1_auth_roles.sql`, and click **Run**.
   Then do the same, in order, with the other files in `supabase/migrations/`.
3. **Turn off public sign-ups.** Go to *Authentication → Sign In / Providers*
   and switch off **Allow new users to sign up**. Only admins create accounts
   (the admin API still works with this off).
4. **Set URLs.** Go to *Authentication → URL Configuration*.
   - **Site URL**: your live URL, e.g. `https://partners.base-ib.com`
     (use `http://localhost:3000` until you deploy).
   - **Redirect URLs**: add `http://localhost:3000/**` and
     `https://<your-vercel-domain>/**`.
5. **Email templates.** Go to *Authentication → Emails → Templates*. Change the
   link in two templates so it lands on the portal:
   - **Invite user**:
     `<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=invite">Set up your Base.IB account</a>`
   - **Reset password**:
     `<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery">Reset your password</a>`
6. **Custom SMTP (needed for email invites and password resets).** Supabase's
   built-in email only delivers to your own team's addresses and is heavily
   rate-limited. Go to *Authentication → Emails → SMTP Settings* and plug in a
   provider (Resend, Postmark, SendGrid, …) with a sender like
   `partners@base-ib.com`. Until then, add sub-IBs with the
   **temporary password** option. That needs no email.
7. **Create your admin login.** Go to *Authentication → Users → Add user*,
   enter your email and password, and tick **Auto Confirm User**. Then open
   `supabase/make-first-admin.sql`, put your email in, and run it in the SQL
   Editor.
8. **Copy your keys.** Go to *Project Settings → API Keys*:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Publishable key (`sb_publishable_…`, or the legacy `anon` key) → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - Secret key (`sb_secret_…`, or the legacy `service_role` key) → `SUPABASE_SECRET_KEY`

   ⚠️ The secret key bypasses RLS. Never commit it, never prefix it with
   `NEXT_PUBLIC_`, and never paste it into chats.

## 2. Run locally

```bash
cd base-ib-portal
cp .env.example .env.local   # fill in the three values
npm install
npm run dev                  # http://localhost:3000
```

## 3. Deploy to Vercel (you do this once)

1. Go to <https://vercel.com/new> and import the `Precision-HQ` GitHub repo.
2. **Root Directory**: `base-ib-portal` (important, because the repo holds other projects too).
   Framework preset: Next.js. Leave the build settings at their defaults.
3. **Environment Variables**: add the three from step 1.8 for Production (and Preview if you use it).
4. Deploy. Then put the Vercel URL (or your custom domain) into Supabase
   **Site URL** and **Redirect URLs** (step 1.4).
5. Optional: add a custom domain such as `partners.base-ib.com` under
   *Project → Settings → Domains*, and update Supabase's Site URL to match.

## Updating the playbook content

The modules and guides come from `../base-ib-playbook.html`. After editing that
file, regenerate the portal content:

```bash
cd base-ib-portal
node scripts/import-playbook.mjs
```

This rewrites `src/content/playbook.generated.ts` and the screenshots in
`public/playbook/`. Commit both and redeploy. Module URLs come from their
titles, so renaming a module resets partners' progress on it.

Still to fill in: the playbook contains `[bracketed placeholders]` (your sign-up
link, eligibility criteria, which broker to recommend). Those show up
highlighted in gold in the portal. It also mentions IC Markets as a broker
partner, while the portal only offers PU Prime and Vantage.

## Environment variables

| Name | Where it's used | Secret? |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | browser + server | no |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | browser + server | no (RLS protects data) |
| `SUPABASE_SECRET_KEY` | server only: creating, banning and deleting logins | **yes** |

## How it fits together

```
src/proxy.ts                    refreshes the session; signed-out users → /login
src/lib/auth.ts                 requireUser() / requireAdmin(): role read from DB
src/lib/supabase/server.ts      client acting AS the user (RLS applies)
src/lib/supabase/admin.ts       secret-key client, only for auth admin calls
src/app/login, forgot-password, set-password, auth/confirm   sign-in flows
src/app/(portal)/dashboard      partner hub: continue learning, modules, guides, profile
src/app/(portal)/learn          playbook overview + one page per module (mark complete → next)
src/app/(portal)/guides         reference guides
src/app/(portal)/announcements  partner news feed (admin manages at /admin/announcements)
src/app/(portal)/assets         images + captions (admin uploads at /admin/assets)
src/content/                    generated playbook content (see "Updating the playbook")
src/app/(portal)/admin          partner list, add, edit, deactivate, delete
supabase/migrations/            tables, triggers, RLS policies
```

- **Adding a sub-IB** creates their Supabase login (by invite email or with a
  temporary password), then inserts their `sub_ibs` row as *you*, so RLS still
  applies. If the second step fails, the login is rolled back.
- **Temporary password** sets a `must_change_password` flag that only the
  server can clear. The partner is forced to `/set-password` on first sign-in.
- **Deactivate** marks the partner inactive *and* bans their login, so they
  can't sign in. Reactivate reverses both.
- **Delete** removes the login; the profile and partner rows cascade.
