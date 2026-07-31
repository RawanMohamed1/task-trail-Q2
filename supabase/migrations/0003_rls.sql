-- RLS is enabled by default on new Supabase tables. This app has no auth in v1
-- (see README), so policies here just allow the anon key to read/update freely
-- rather than leaving the tables fully locked out.

alter table enquiries enable row level security;
alter table consultants enable row level security;

create policy "Allow public read on enquiries" on enquiries
  for select using (true);

create policy "Allow public update on enquiries" on enquiries
  for update using (true);

create policy "Allow public read on consultants" on consultants
  for select using (true);
