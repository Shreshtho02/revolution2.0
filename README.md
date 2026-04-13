# Revolution 2.0 (GSCCC) — GitHub Pages + Supabase

Static, multi-page-in-one HTML site (hash routing) designed for GitHub Pages, with form submissions stored in Supabase.

## Structure

- `index.html`: site markup (routes: `#home`, `#segments`, `#register`, `#success`, `#control-panel`)
- `styles.css`: styling
- `script.js`: UI logic + Supabase integration
- `supabase-config.js`: **you fill this** with your Supabase Project URL + anon key
- `assets/`
  - `assets.js`: defines `IMG_*` constants used by the UI
  - `images/`: decoded images used by the UI

## Supabase setup

### 1) Create a project

Create a Supabase project, then copy:

- **Project URL**: Supabase Dashboard → Settings → API → Project URL
- **Anon key**: Supabase Dashboard → Settings → API → Project API keys → `anon public`

Paste both into `supabase-config.js`:

```js
window.SUPABASE_URL = "https://YOURPROJECT.supabase.co";
window.SUPABASE_ANON_KEY = "YOUR_ANON_KEY";
```

### 2) Create the `registrations` table

In Supabase SQL Editor, run:

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

Note: the frontend sends `classYear` and `segmentName`. Postgres folds unquoted identifiers to lowercase, so the columns are `classyear` and `segmentname`.

### 3) Enable Row Level Security (RLS) and policies

This project uses:

- **Anon**: can insert new registrations
- **Authenticated admin** (Supabase Auth user): can read/update/delete registrations (for the Control Panel)

Run:

```sql
alter table public.registrations enable row level security;

-- Public form submission
create policy "public insert registrations"
on public.registrations
for insert
to public
with check (true);

-- Control panel (any authenticated user)
create policy "auth read registrations"
on public.registrations
for select
to authenticated
using (true);

create policy "auth update registrations"
on public.registrations
for update
to authenticated
using (true)
with check (true);

create policy "auth delete registrations"
on public.registrations
for delete
to authenticated
using (true);
```

If you want only specific admins to have access, replace the `authenticated` policies with a role/claim-based approach (recommended for production).

### 4) Create an admin user (for the Control Panel)

The Control Panel uses **Supabase Auth**.

- Supabase Dashboard → Authentication → Users → **Add user**
- Set an email + password

Then open the site at `#control-panel` and log in using that email/password.

## Local development

Any static server works. Examples:

### Option A: Python

```bash
python -m http.server 5173
```

Open `http://localhost:5173/`.

### Option B: Node

```bash
npx serve .
```

## Deploy to GitHub Pages

1. Create a GitHub repo and push this folder contents.
2. GitHub repo → Settings → Pages
3. **Build and deployment**:
   - Source: Deploy from a branch
   - Branch: `main` (or your branch), folder `/ (root)`
4. Your site will be served from GitHub Pages and `index.html` will be the entry point.

## Notes / operational guidance

- `supabase-config.js` is public on GitHub Pages. That’s expected: the **anon** key is meant to be public.
- Do **not** put a Supabase service-role key into this repo.
- For real production security, keep RLS strict and prefer role/claim-based admin policies.

