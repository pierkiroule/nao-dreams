begin;

create table if not exists public.dream_seeds (
  id uuid primary key,
  journey_id uuid not null unique references public.journeys(id) on delete cascade,
  network_id uuid not null references public.bubble_networks(id) on delete restrict,
  bubble_1_id uuid not null references public.dream_bubbles(id),
  bubble_2_id uuid not null references public.dream_bubbles(id),
  bubble_3_id uuid not null references public.dream_bubbles(id),
  phrase text not null check (char_length(phrase) between 8 and 500),
  generation_mode text not null check (generation_mode in ('authored', 'generated', 'hybrid', 'fallback')),
  created_at timestamptz not null default now()
);

create table if not exists public.dream_seed_reflections (
  id uuid primary key default gen_random_uuid(),
  dream_seed_id uuid not null references public.dream_seeds(id) on delete cascade,
  journey_id uuid not null references public.journeys(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null check (char_length(content) between 1 and 1000),
  is_shareable boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (journey_id, dream_seed_id)
);

alter table public.dream_seeds enable row level security;
alter table public.dream_seed_reflections enable row level security;
grant select, insert on public.dream_seeds to authenticated;
grant select, insert, update on public.dream_seed_reflections to authenticated;

create policy "owners read their dream seeds" on public.dream_seeds for select to authenticated
using (exists (select 1 from public.journeys where journeys.id = dream_seeds.journey_id and journeys.user_id = auth.uid()));
create policy "owners create their dream seeds" on public.dream_seeds for insert to authenticated
with check (exists (select 1 from public.journeys where journeys.id = dream_seeds.journey_id and journeys.user_id = auth.uid()));
create policy "owners manage private reflections" on public.dream_seed_reflections for all to authenticated
using (user_id = auth.uid()) with check (user_id = auth.uid() and is_shareable = false);

commit;
