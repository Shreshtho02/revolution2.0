# Revolution 2.0 — GSCCC

An online cultural event portal for **Govt. Science College Cultural Club (GSCCC), Dhaka**.

Built as a fast, single-site experience (hash routing) and deployed on **GitHub Pages** with registrations stored in **Supabase**.

## Live site

- **Website**: `https://shreshtho02.github.io/revolution2.0/`

## What’s inside

- **Public portal**: Home, Segments, Registration, Success screen
- **Admin Control Panel**: `/#control-panel`
  - Login via **Supabase Auth**
  - Review registrations, approve/reject, export CSV, delete rows

## Project structure

- `index.html` — markup + route container (`#home`, `#segments`, `#register`, `#success`, `#control-panel`)
- `styles.css` — styling
- `script.js` — UI logic + Supabase calls (insert/select/update/delete)
- `supabase-config.js` — Supabase Project URL + anon key (public)
- `assets/` — images + `assets.js` constants

## Run locally

From the project folder:

```bash
python -m http.server 5173
```

Then open `http://localhost:5173/`.

## Supabase setup (production-ready basics)

### 1) Create a Supabase project

In Supabase Dashboard:

- **Project URL**: Settings → API → Project URL
- **Anon key**: Settings → API → Project API keys → `anon public`

Paste them into `supabase-config.js`:

```js
window.SUPABASE_URL = "https://YOURPROJECT.supabase.co";
window.SUPABASE_ANON_KEY = "YOUR_ANON_KEY";
```

### 2) Create database table

Run this in Supabase SQL Editor:

```sql
create table if not exists public.registrations (
  id text primary key,
  name text not null,
  email text not null,
  phone text not null,
  dob date null,
  institution text not null,
  classyear text null,
  district text null,
  segment text not null,
  segmentname text not null,
  team text null,
  txn text not null,
  bkash text null,
  note text null,
  timestamp timestamptz not null default now(),
  status text not null default 'pending'
);
```

### 3) RLS policies (public submit + authenticated admin)

This site is designed so:

- **Anyone** can submit the registration form (public insert).
- Only **authenticated** users (admins) can view/update/delete registrations in the Control Panel.

Run:

```sql
alter table public.registrations enable row level security;

-- Public form submission (anyone visiting the site)
drop policy if exists "public insert registrations" on public.registrations;
create policy "public insert registrations"
on public.registrations
for insert
to public
with check (true);

-- Admin control panel (authenticated users)
drop policy if exists "auth read registrations" on public.registrations;
create policy "auth read registrations"
on public.registrations
for select
to authenticated
using (true);

drop policy if exists "auth update registrations" on public.registrations;
create policy "auth update registrations"
on public.registrations
for update
to authenticated
using (true)
with check (true);

drop policy if exists "auth delete registrations" on public.registrations;
create policy "auth delete registrations"
on public.registrations
for delete
to authenticated
using (true);
```

### 4) Create an admin user (Control Panel login)

Supabase Dashboard → Authentication → Users → **Add user** → set email + password.

Then open:

- `/#control-panel`

and sign in with that admin email/password.

## Deploy to GitHub Pages

GitHub repo → Settings → Pages:

- Source: **Deploy from a branch**
- Branch: `main`
- Folder: `/ (root)`

## Security notes (important)

- `supabase-config.js` is **public**. The **anon** key is meant to be public.
- Never commit a **service_role** key.
- If you want stricter admin access than “any authenticated user”, use role/claim based RLS (recommended for large/public deployments).

