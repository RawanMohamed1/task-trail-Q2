create type enquiry_status as enum ('new', 'contacted', 'placed', 'closed');
create type enquiry_source as enum ('email', 'webform', 'chat');

create table consultants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique
);

create table enquiries (
  id uuid primary key default gen_random_uuid(),
  contact_name text not null,
  contact_email text,
  contact_phone text,
  company text,
  role_sought text,
  location text,
  salary_budget integer,
  urgency text,
  source enquiry_source not null default 'webform',
  status enquiry_status not null default 'new',
  consultant_id uuid references consultants (id),
  summary text,
  raw_text text,
  created_at timestamptz not null default now()
);

create index enquiries_status_idx on enquiries (status);
create index enquiries_consultant_id_idx on enquiries (consultant_id);
