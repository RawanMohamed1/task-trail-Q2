insert into consultants (name, email) values
  ('Layla Hassan', 'layla@marlowfinch.co.uk'),
  ('Ollie Bright', 'ollie@marlowfinch.co.uk');

insert into enquiries (contact_name, contact_email, contact_phone, company, role_sought, location, salary_budget, urgency, source, status, consultant_id, summary, raw_text)
values
  ('Naomi Clarke', 'naomi.clarke@example.com', '07700 900123', 'Fenwick & Co', 'Senior Recruitment Consultant', 'London', 42000, 'immediate',
   'email', 'new', (select id from consultants where name = 'Layla Hassan'),
   'Looking to grow the London desk, wants someone billing already, start ASAP.',
   'Hi, following on from our call — we need a senior recruitment consultant in London, ideally someone already billing, budget around 42k, start as soon as possible.'),

  ('Callum Reid', 'c.reid@example.com', null, null, 'Warehouse Team Lead', 'Leeds', 30000, 'immediate',
   'webform', 'new', null,
   'Two warehouse team lead roles, Leeds, urgent, budget 30k.',
   'We need 2 warehouse team leads in Leeds asap, budget ~30k, immediate start.'),

  ('Priyanka Shah', 'p.shah@example.com', '07822 445678', 'Hallmark Finance', 'Finance Manager', 'Birmingham', 52000, 'soon',
   'chat', 'contacted', (select id from consultants where name = 'Ollie Bright'),
   'Finance Manager, Birmingham, hybrid, wants to hire within 6 weeks.',
   'Hi, are you the finance recruitment team? Looking for a Finance Manager, hybrid Birmingham, permanent.'),

  ('Ryan Sutton', 'ryan.sutton@example.com', null, 'Sutton & Reed Logistics', 'Operations Director', 'Manchester', 68000, 'soon',
   'email', 'contacted', (select id from consultants where name = 'Dan Whitfield'),
   'Senior logistics hire, Manchester, wants to move quickly on the right candidate.',
   'We are looking for an Operations Director to join us in Manchester, budget up to 68k, keen to move quickly.'),

  ('Freya Douglas', 'freya.d@example.com', '07911 223344', null, 'HR Business Partner', 'Bristol', 45000, 'unspecified',
   'chat', 'new', null,
   'HR Business Partner enquiry, Bristol, no firm timeline given yet.',
   'Hi, do you help with HR hires? We might need an HR Business Partner in Bristol at some point this year.'),

  ('Marcus Webb', 'marcus.webb@example.com', null, 'Northgate Retail', 'Store Manager', 'Leeds', 33000, 'immediate',
   'webform', 'placed', (select id from consultants where name = 'Sam Okafor'),
   'Store Manager role filled after three interview rounds.',
   'Need a Store Manager for our Leeds branch, immediate start, budget around 33k.'),

  ('Isla Fraser', 'isla.fraser@example.com', '07733 556677', 'Fraser Dental Group', 'Practice Manager', 'Edinburgh', 38000, 'soon',
   'email', 'placed', (select id from consultants where name = 'Layla Hassan'),
   'Practice Manager placed, started within a month of first contact.',
   'Looking for a Practice Manager for our Edinburgh clinic, ideally within the month.'),

  ('Harun Malik', 'harun.malik@example.com', null, null, null, null, null, 'unspecified',
   'webform', 'closed', null,
   'Asked about invoice payment terms — not a hiring enquiry.',
   'Hi, quick question about the invoice you sent last month, can you confirm the payment terms?'),

  ('Chloe Bennett', 'chloe.bennett@example.com', '07655 998877', 'Bennett Interiors', 'Junior Designer', 'Bristol', 24000, 'soon',
   'chat', 'closed', null,
   'Enquiry went cold after initial contact, no response from client.',
   'Hi, might be looking for a junior designer soon, will confirm details later.'),

  ('Oscar Whitmore', 'oscar.w@example.com', null, 'Whitmore Capital', 'Compliance Officer', 'London', 60000, 'immediate',
   'email', 'contacted', (select id from consultants where name = 'Ollie Bright'),
   'Compliance Officer, London, urgent regulatory deadline driving the hire.',
   'We need a Compliance Officer urgently, London based, budget up to 60k, driven by an upcoming audit.');
