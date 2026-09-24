-- Shops that carry (or might carry) the souvenir decks, and every visit to them.
-- Applied to the Supabase project on 2026-09-24 (migration "shops_and_visits").
create table if not exists public.shops (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null default auth.uid(),
  created_at timestamptz not null default now(),
  name text not null,
  area text,
  address text,
  contact text,
  phone text,
  email text,
  -- prospect, sample_left, stocking, no
  status text not null default 'prospect',
  -- wholesale, swap, consignment
  terms text not null default 'wholesale',
  resale_cert boolean not null default false,
  next_visit date,
  notes text
);

create table if not exists public.shop_visits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null default auth.uid(),
  shop_id uuid references public.shops(id) on delete cascade not null,
  visited_on date not null default current_date,
  delivered integer not null default 0,
  -- decks counted on the shelf before delivering; null when not counted
  left_on_shelf integer,
  amount numeric(10,2) not null default 0,
  paid boolean not null default false,
  note text
);

create index if not exists shop_visits_shop_id on public.shop_visits (shop_id, visited_on desc);

alter table public.shops enable row level security;
alter table public.shop_visits enable row level security;

create policy "users_own_shops" on public.shops
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "users_own_shop_visits" on public.shop_visits
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

grant select, insert, update, delete on public.shops, public.shop_visits to authenticated;
