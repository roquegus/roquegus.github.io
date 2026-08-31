-- Calle Nueve Studio — initial schema
-- Run this in the Supabase SQL editor

create table if not exists public.projects (
  id             uuid default gen_random_uuid() primary key,
  user_id        uuid references auth.users(id) on delete cascade not null,
  name           text not null default 'Untitled Project',
  design_tokens  jsonb not null default '{}',
  order_info     jsonb not null default '{}',
  active_preset  text not null default 'Classic Calle Nueve',
  custom_presets jsonb not null default '{}',
  created_at     timestamptz default now() not null,
  updated_at     timestamptz default now() not null
);

-- Auto-update updated_at
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.touch_updated_at();

-- Row-level security: users only see their own projects
alter table public.projects enable row level security;

create policy "users_own_projects"
  on public.projects for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Index for fast per-user listing
create index if not exists projects_user_id_updated_at
  on public.projects (user_id, updated_at desc);
