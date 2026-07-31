# Marlow & Finch — Enquiry Portal (Q2)

An internal portal for Marlow & Finch consultants to see incoming enquiries, filter down to the
ones that matter to them, and move each one along without touching the automation behind it.
Built for the Relay Systems AI & Automation Specialist trial task, Question 2.

**Live:** https://task-trail-q2.vercel.app
**Repo:** https://github.com/RawanMohamed1/task-trail-Q2

---

## What it does

- Lists every enquiry, newest first
- Filters by **status** (pill buttons with live counts: New, Contacted, Placed, Closed)
- Filters by **assigned consultant** (including an "Unassigned" option)
- Free-text **search** across contact name, company, role, location, and consultant
- Lets a consultant **change an enquiry's status** directly from the table, no separate page

The data here is separate mock data, not a live feed from the Q1 workflow — the task explicitly
allows either, and mock data made it possible to build a broader, more realistic-looking spread
of enquiries than the three Q1 samples alone would give.

---

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS 4**
- **Supabase** (Postgres + Row Level Security), accessed via `@supabase/supabase-js`
- Deployed on **Vercel**

---

## Schema

See [`supabase/migrations/`](supabase/migrations/) for the actual SQL. Summary:

```
consultants
  id            uuid, primary key
  name          text
  email         text, unique

enquiries
  id              uuid, primary key
  contact_name    text
  contact_email   text, nullable
  contact_phone   text, nullable
  company         text, nullable
  role_sought     text, nullable
  location        text, nullable
  salary_budget   integer, nullable
  urgency         text, nullable
  source          enum: email | webform | chat
  status          enum: new | contacted | placed | closed
  consultant_id   uuid, references consultants(id), nullable
  summary         text, nullable
  raw_text        text, nullable
  created_at      timestamptz, default now()
```

Two tables, one foreign key. `enquiries.consultant_id` is nullable — an enquiry can sit
unassigned, which the UI surfaces as its own filter option rather than treating it as an error
state.

Row Level Security is enabled on both tables ([`0003_rls.sql`](supabase/migrations/0003_rls.sql)).
Since this app has no authentication in v1, the policies allow the public (anon) key to read both
tables and update `enquiries` — see the trade-off comment on this in the code.

---

## Trade-offs (see inline comments in the code for these)

- **`src/components/enquiry-board.tsx`** — status changes are applied to the UI optimistically,
  before the Supabase write confirms, then rolled back if the write fails. For a small internal
  tool where one or two people touch a record at a time, the odds of a conflicting write are low
  enough that feeling instant is worth more than being maximally defensive.
- **`src/app/page.tsx`** — the page is set to always fetch fresh (`revalidate = 0`) rather than
  use Next.js's default caching. A tool consultants check throughout the day needs to reflect the
  latest status changes; the small performance cost of skipping the cache is worth the
  correctness.
- **`supabase/migrations/0003_rls.sql`** — RLS policies are wide open (any request can read
  everything, and update enquiries) rather than scoped to a logged-in user, because there's no
  login system in this version at all. This is explicitly a v1 trade-off, not an oversight — see
  below.

---

## What I left out, and what I insisted on keeping

**Left out:** authentication. Anyone with the URL can view and update enquiries right now. For a
trial-task v1 handed to a small team that already trusts each other on a shared tool, that's an
acceptable gap to leave for a fast follow-up rather than something to solve up front — but it's
the first thing I'd add before this went anywhere near a real client's data.

**Kept:** the two-table schema, even though a single flat table with a `consultant_name` text
column would have been faster to build. Keeping `consultants` as its own table means the founder
can add or rename a consultant in one place without touching every enquiry row, and it's the kind
of small structural decision that's cheap to get right early and expensive to retrofit later.

---

## Running it locally

```bash
npm install
cp .env.example .env.local   # fill in your own Supabase project URL + anon key
npm run dev
```

Run the SQL in [`supabase/migrations/`](supabase/migrations/) against your own Supabase project
(in order) before starting the app, or the tables won't exist yet.
