begin;

create table if not exists public.dream_seeds (
  id uuid primary key,
  journey_id uuid not null unique references public.journeys(id) on delete cascade,
  network_id uuid not null references public.bubble_networks(id) on delete restrict,
  bubble_1_id uuid not null references public.dream_bubbles(id),
  bubble_2_id uuid not null references public.dream_bubbles(id),
  bubble_3_id uuid not null references public.dream_bubbles(id),
  text text not null check (char_length(btrim(text)) between 1 and 1000),
  source text not null default 'fallback' check (source in ('authored', 'composed', 'generated', 'fallback')),
  created_at timestamptz not null default now()
);

create table if not exists public.dream_echoes (
  id uuid primary key default gen_random_uuid(),
  dream_seed_id uuid not null references public.dream_seeds(id) on delete cascade,
  journey_id uuid not null references public.journeys(id) on delete cascade,
  echo text not null check (char_length(btrim(echo)) between 1 and 1000),
  created_at timestamptz not null default now()
);

alter table public.dream_seeds enable row level security;
alter table public.dream_echoes enable row level security;
grant select, insert on public.dream_seeds, public.dream_echoes to authenticated;

create policy "owners read their dream seeds" on public.dream_seeds for select to authenticated
using (exists (select 1 from public.journeys where journeys.id = dream_seeds.journey_id and journeys.user_id = auth.uid()));
create policy "owners create their dream seeds" on public.dream_seeds for insert to authenticated
with check (exists (select 1 from public.journeys where journeys.id = dream_seeds.journey_id and journeys.user_id = auth.uid()));
create policy "owners manage private dream echoes" on public.dream_echoes for all to authenticated
using (exists (select 1 from public.journeys where journeys.id = dream_echoes.journey_id and journeys.user_id = auth.uid()))
with check (exists (select 1 from public.journeys where journeys.id = dream_echoes.journey_id and journeys.user_id = auth.uid()));

commit;
