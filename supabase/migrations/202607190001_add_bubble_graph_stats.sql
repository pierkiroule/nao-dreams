begin;

alter table public.journey_choices
  add column if not exists created_at timestamptz not null default now();

create index if not exists journey_choices_journey_idx on public.journey_choices(journey_id);
create index if not exists journey_choices_bubble_idx on public.journey_choices(bubble_id);
create index if not exists journey_choices_journey_step_idx on public.journey_choices(journey_id, step);

create table if not exists public.bubble_occurrence_stats (
  network_id uuid not null references public.bubble_networks(id) on delete cascade,
  bubble_id uuid not null references public.dream_bubbles(id) on delete cascade,
  selection_count bigint not null default 0 check (selection_count >= 0),
  journey_count bigint not null default 0 check (journey_count >= 0),
  resonance_score double precision not null default 0 check (resonance_score between 0 and 1),
  first_selected_at timestamptz,
  last_selected_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (network_id, bubble_id)
);

create table if not exists public.bubble_cooccurrence_stats (
  network_id uuid not null references public.bubble_networks(id) on delete cascade,
  bubble_a_id uuid not null references public.dream_bubbles(id) on delete cascade,
  bubble_b_id uuid not null references public.dream_bubbles(id) on delete cascade,
  cooccurrence_count bigint not null default 0 check (cooccurrence_count >= 0),
  transition_count bigint not null default 0 check (transition_count >= 0),
  strength_score double precision not null default 0 check (strength_score between 0 and 1),
  first_observed_at timestamptz,
  last_observed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (network_id, bubble_a_id, bubble_b_id),
  constraint bubble_cooccurrence_order_check check (bubble_a_id < bubble_b_id)
);

create index if not exists bubble_cooccurrence_a_idx on public.bubble_cooccurrence_stats(network_id, bubble_a_id);
create index if not exists bubble_cooccurrence_b_idx on public.bubble_cooccurrence_stats(network_id, bubble_b_id);
create index if not exists bubble_cooccurrence_strength_idx on public.bubble_cooccurrence_stats(network_id, strength_score desc);

-- Only aggregate, published-network data is exposed to anonymous-auth players.
-- The refresh function is intentionally not granted to browser roles.
alter table public.bubble_occurrence_stats enable row level security;
alter table public.bubble_cooccurrence_stats enable row level security;
grant select on public.bubble_occurrence_stats, public.bubble_cooccurrence_stats to authenticated;

create policy "authenticated users read published occurrence stats"
on public.bubble_occurrence_stats for select to authenticated
using (exists (
  select 1 from public.bubble_networks network
  where network.id = bubble_occurrence_stats.network_id and network.status = 'published'
));

create policy "authenticated users read published cooccurrence stats"
on public.bubble_cooccurrence_stats for select to authenticated
using (exists (
  select 1 from public.bubble_networks network
  where network.id = bubble_cooccurrence_stats.network_id and network.status = 'published'
));

create or replace function public.refresh_bubble_graph_stats(target_network_id uuid default null)
returns void language plpgsql security definer set search_path = public as $$
begin
  delete from bubble_occurrence_stats where target_network_id is null or network_id = target_network_id;
  insert into bubble_occurrence_stats (network_id, bubble_id, selection_count, journey_count, resonance_score, first_selected_at, last_selected_at)
  with counts as (
    select j.network_id, jc.bubble_id, count(*)::bigint selection_count,
      count(distinct jc.journey_id)::bigint journey_count, min(jc.created_at) first_selected_at, max(jc.created_at) last_selected_at
    from journey_choices jc join journeys j on j.id = jc.journey_id
    where j.network_id is not null and (target_network_id is null or j.network_id = target_network_id)
    group by j.network_id, jc.bubble_id
  ), maximums as (
    select network_id, greatest(max(journey_count), 1)::double precision max_count from counts group by network_id
  )
  select c.network_id, c.bubble_id, c.selection_count, c.journey_count,
    case when m.max_count <= 1 then 1 else ln(1 + c.journey_count::double precision) / ln(1 + m.max_count) end,
    c.first_selected_at, c.last_selected_at
  from counts c join maximums m using (network_id);

  delete from bubble_cooccurrence_stats where target_network_id is null or network_id = target_network_id;
  insert into bubble_cooccurrence_stats (network_id, bubble_a_id, bubble_b_id, cooccurrence_count, transition_count, strength_score, first_observed_at, last_observed_at)
  with pairs as (
    select j.network_id, least(a.bubble_id, b.bubble_id) bubble_a_id, greatest(a.bubble_id, b.bubble_id) bubble_b_id,
      a.journey_id, case when abs(a.step - b.step) = 1 then 1 else 0 end is_transition,
      greatest(a.created_at, b.created_at) observed_at
    from journey_choices a join journey_choices b on b.journey_id = a.journey_id and a.step < b.step
    join journeys j on j.id = a.journey_id
    where j.network_id is not null and (target_network_id is null or j.network_id = target_network_id)
  ), counts as (
    select network_id, bubble_a_id, bubble_b_id, count(distinct journey_id)::bigint cooccurrence_count,
      sum(is_transition)::bigint transition_count, min(observed_at) first_observed_at, max(observed_at) last_observed_at
    from pairs group by network_id, bubble_a_id, bubble_b_id
  ), maximums as (
    select network_id, greatest(max(cooccurrence_count), 1)::double precision max_count from counts group by network_id
  )
  select c.network_id, c.bubble_a_id, c.bubble_b_id, c.cooccurrence_count, c.transition_count,
    case when m.max_count <= 1 then 1 else ln(1 + c.cooccurrence_count::double precision) / ln(1 + m.max_count) end,
    c.first_observed_at, c.last_observed_at
  from counts c join maximums m using (network_id);
end;
$$;

revoke all on function public.refresh_bubble_graph_stats(uuid) from public;

commit;
