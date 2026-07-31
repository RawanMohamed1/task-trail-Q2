insert into consultants (name, email) values
  ('Priya Nair', 'priya@marlowfinch.co.uk'),
  ('Dan Whitfield', 'dan@marlowfinch.co.uk'),
  ('Sam Okafor', 'sam@marlowfinch.co.uk');

insert into enquiries (contact_name, contact_email, company, role_sought, location, salary_budget, urgency, source, status, consultant_id, summary)
values
  ('Meera Kapoor', 'meera.kapoor@example.com', 'Delta Logistics', 'Warehouse Supervisor', 'Manchester', 34000, 'immediate',
   'email', 'new', (select id from consultants where name = 'Dan Whitfield'),
   'Needs a warehouse supervisor to start within two weeks, budget around 34k.'),

  ('Josh Bellamy', 'josh.b@example.com', null, 'Financial Controller', 'Bristol', 55000, 'soon',
   'webform', 'contacted', (select id from consultants where name = 'Priya Nair'),
   'Hybrid role, permanent, looking to hire within the month.'),

  ('Aisha Rahman', 'aisha.rahman@example.com', 'Northline Retail', 'Account Manager', 'Leeds', 41000, 'soon',
   'chat', 'contacted', (select id from consultants where name = 'Sam Okafor'),
   'Enquired via chat widget, wants someone with retail account management background.'),

  ('Tom Ferris', null, null, null, null, null, 'unspecified',
   'webform', 'closed', null,
   'Asked to resend the terms document — not a hiring enquiry.'),

  ('Ben Carrick', 'ben.carrick@example.com', 'Vantage Freight', 'Operations Manager', 'Leeds', 47000, 'immediate',
   'email', 'placed', (select id from consultants where name = 'Dan Whitfield'),
   'Filled successfully after two rounds of interviews.'),

  ('Grace Idowu', 'grace.idowu@example.com', null, 'Management Accountant', 'Bristol', 48000, 'immediate',
   'chat', 'new', (select id from consultants where name = 'Priya Nair'),
   'Wants a permanent, hybrid management accountant, urgent need.');
