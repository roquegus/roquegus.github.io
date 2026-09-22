-- Custom-deck requests from the form at callenueve.com/custom.
-- Applied to the Supabase project on 2026-09-21 (migration "inquiries_for_custom_deck_requests").
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  company text,
  email text not null,
  phone text,
  quantity text,
  deck_type text,
  message text,
  source text default 'callenueve.com/custom',
  handled boolean not null default false
);

alter table public.inquiries enable row level security;

-- The website form posts with the anon key; it may only insert.
create policy "anon can insert inquiries" on public.inquiries
  for insert to anon with check (true);

-- Signed-in Studio users read the leads and mark them handled.
create policy "authenticated can read inquiries" on public.inquiries
  for select to authenticated using (true);
create policy "authenticated can update inquiries" on public.inquiries
  for update to authenticated using (true) with check (true);

grant insert on public.inquiries to anon;
grant select, update on public.inquiries to authenticated;
