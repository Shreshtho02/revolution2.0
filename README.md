<div align="center">

# Revolution 2.0 — GSCCC

**National Cultural Event Portal**  
Govt. Science College Cultural Club (GSCCC), Dhaka

[![Live Site](https://img.shields.io/badge/Live%20Site-revolution2.0-CC1B1B?style=for-the-badge&logo=github)](https://shreshtho02.github.io/revolution2.0/)
![Built with](https://img.shields.io/badge/Stack-HTML%20%7C%20CSS%20%7C%20JS-111?style=for-the-badge)
![Backend](https://img.shields.io/badge/Backend-Supabase-3ECF8E?style=for-the-badge&logo=supabase)
![Hosted on](https://img.shields.io/badge/Host-GitHub%20Pages-181717?style=for-the-badge&logo=github)

</div>

---

## Overview

Revolution 2.0 is the official online registration and information portal for GSCCC's annual national cultural event. It handles the full participant journey — browsing segments, submitting registrations with bKash payment verification, and receiving confirmation — entirely client-side with Supabase as the backend.

Built with zero dependencies (plain HTML, CSS, vanilla JS) and deployed via GitHub Pages. The admin dashboard runs in-browser behind Supabase authentication.

---

## Segments

| Code | Name | Type | Mode |
|------|------|------|------|
| `pen` | Ink & Fire | Solo | Online (submission) |
| `pic` | Rebel's Lens | Solo | Online (submission) |
| `voice` | Voice of Revolution | Solo | Online (submission) |
| `mic` | Bijoyer Shur | Solo — Cat A / B | Online (submission) |
| `poem` | Verses of Revolt | Solo | Online (submission) |
| `dance` | Step to Glory | Solo | Online (submission) |
| `art` | Strokes of Rebellion | Solo | Online (submission) |
| `quiz` | Knowledge Rebellion | Solo | Offline |

**Singing (Bijoyer Shur)** has two categories:
- **Category A** — Class 8 to 10
- **Category B** — Class 11 to 12 / HSC Batch 26

All other segments, including Quiz, have no category split.

---

## Registration Fee

**৳50 per segment** via bKash Send Money to `01811221844` (Personal).  
Participants pay the total in a single transaction (e.g., 3 segments = ৳150), enter their TrxID, and upload the payment screenshot. A PDF invoice is generated client-side on successful submission.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JS (ES2020) |
| Fonts | Bebas Neue, Crimson Pro, Space Mono (Google Fonts) |
| Icons | Font Awesome 6 |
| Backend / DB | Supabase (PostgreSQL + Auth + Storage) |
| File Storage | Supabase Storage (payment screenshots) |
| Hosting | GitHub Pages |
| Invoice | Canvas API — client-side PDF generation |

---

## Local Development

```bash
git clone https://github.com/shreshtho02/revolution2.0.git
cd revolution2.0
python -m http.server 5173
```

Open `http://localhost:5173`. No build step, no package manager, no bundler.

---

## Deployment

```bash
git add .
git commit -m "update"
git push origin main
```

GitHub Pages auto-deploys from `main` → root (`/`).  
Enable at: **Repo → Settings → Pages → Branch: main / (root)**

---

## Supabase Setup

### 1. Project credentials

Edit `supabase-config.js`:

```javascript
window.SUPABASE_URL      = "https://your-project-id.supabase.co";
window.SUPABASE_ANON_KEY = "your-anon-key-here";
```

### 2. Registrations table

```sql
CREATE TABLE registrations (
  id          TEXT        PRIMARY KEY,
  name        TEXT        NOT NULL,
  email       TEXT        NOT NULL,
  phone       TEXT        NOT NULL,
  dob         DATE,
  institution TEXT        NOT NULL,
  classyear   TEXT,
  segment     TEXT        NOT NULL,
  segmentname TEXT        NOT NULL,
  ca_ref      TEXT,
  txn         TEXT        NOT NULL,
  bkash       TEXT,
  note        TEXT,
  status      TEXT        DEFAULT 'pending',
  timestamp   TIMESTAMPTZ DEFAULT NOW()
);
```

**Column notes:**
- `segment` — comma-separated codes for multi-segment registrations (e.g., `"mic,art"`)
- `segmentname` — human-readable label including singing category if applicable (e.g., `"Bijoyer Shur (Cat A), Strokes of Rebellion"`)
- `ca_ref` — optional Cultural Ambassador referral name
- `status` — one of `pending`, `approved`, `rejected`; managed from the admin dashboard
- No `photo` column — participant photo upload was removed from this version

### 3. Row Level Security

```sql
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Public: submit registrations
CREATE POLICY "public_insert" ON registrations
  FOR INSERT WITH CHECK (true);

-- Authenticated (admin): full read/write
CREATE POLICY "auth_select" ON registrations
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "auth_update" ON registrations
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "auth_delete" ON registrations
  FOR DELETE USING (auth.role() = 'authenticated');
```

### 4. Storage bucket — payment screenshots

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-screenshots', 'payment-screenshots', true);

CREATE POLICY "anon_upload_screenshots" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'payment-screenshots' AND auth.role() = 'anon'
  );

CREATE POLICY "public_read_screenshots" ON storage.objects
  FOR SELECT USING (bucket_id = 'payment-screenshots');
```

### 5. Admin user

**Supabase Dashboard → Authentication → Users → Add user**  
Create one user with a strong password. This account logs into the `/control-panel` dashboard.

---

## Admin Dashboard

Navigate to `/#control-panel` (not linked in public nav — direct URL only).

| Feature | Description |
|---------|-------------|
| Login | Supabase email/password auth |
| Registrations table | Searchable, filterable by segment and status |
| Status management | Approve / reject registrations inline |
| CSV export | Full data export for offline processing |
| Screenshots | View and download bKash screenshots per registration |
| Invoice download | Re-generate invoice PDF for any registration |
| Sample data | Insert test registrations for UI validation |

---

## Database Schema Reference

| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `id` | TEXT | ✅ | Unique ID — format `REV2026-XXXX` |
| `name` | TEXT | ✅ | Participant full name |
| `email` | TEXT | ✅ | Contact email |
| `phone` | TEXT | ✅ | Contact phone |
| `dob` | DATE | — | Date of birth |
| `institution` | TEXT | ✅ | School or college name |
| `classyear` | TEXT | ✅ | e.g. `Class 10`, `HSC Batch 26` |
| `segment` | TEXT | ✅ | Comma-separated segment codes |
| `segmentname` | TEXT | ✅ | Display label with singing category if applicable |
| `ca_ref` | TEXT | — | Cultural Ambassador referral name (optional) |
| `txn` | TEXT | ✅ | bKash Transaction ID |
| `bkash` | TEXT | — | bKash number used for payment |
| `note` | TEXT | — | Participant notes + screenshot storage URL |
| `status` | TEXT | ✅ | `pending` / `approved` / `rejected` |
| `timestamp` | TIMESTAMPTZ | ✅ | Auto-set on insert |

---

## Common Issues

**Submission blocked — RLS error**  
→ The `public_insert` policy is missing or disabled. Re-run the RLS policy SQL above.

**Screenshot upload fails**  
→ Verify the `payment-screenshots` bucket exists and `anon_upload_screenshots` policy is active.

**Admin dashboard shows no data**  
→ Confirm Supabase session is active and `auth_select` policy is in place.

**Invoice PDF blank or misaligned**  
→ The invoice canvas uses `assets/images/img_invoice.jpeg` as its background. Ensure the file is present and served from the server root.

---

## Project Structure

```
revolution2.0/
├── index.html          # Single-page application shell
├── script.js           # All application logic
├── styles.css          # All styling
├── supabase-config.js  # Supabase credentials (keep out of version control)
├── invoice.html        # Invoice preview / print page
├── assets/
│   ├── assets.js       # Base64-encoded logo assets
│   └── images/         # PNG/JPEG assets
└── README.md
```

---

## Credits

Developed by **Sudipta Saha Shreshtho** — Sub Organizing Secretary, GSCCC  
© 2026 Govt. Science College Cultural Club (GSCCC) — Revolution 2.0. All Rights Reserved.