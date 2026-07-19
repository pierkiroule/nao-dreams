begin;

-- The client records all six choices displayed at each step before marking the
-- selected bubble. Keep this data private to the journey owner while allowing
-- the aggregate jobs to calculate shown-to-selected resonance later.
alter table public.journey_exposures enable row level security;

grant select, insert, update on public.journey_exposures to authenticated;

create policy "owners read journey exposures"
on public.journey_exposures for select to authenticated
using (exists (
  select 1 from public.journeys
  where journeys.id = journey_exposures.journey_id
    and journeys.user_id = auth.uid()
));

create policy "owners create journey exposures"
on public.journey_exposures for insert to authenticated
with check (exists (
  select 1 from public.journeys
  where journeys.id = journey_exposures.journey_id
    and journeys.user_id = auth.uid()
));

create policy "owners update journey exposures"
on public.journey_exposures for update to authenticated
using (exists (
  select 1 from public.journeys
  where journeys.id = journey_exposures.journey_id
    and journeys.user_id = auth.uid()
))
with check (exists (
  select 1 from public.journeys
  where journeys.id = journey_exposures.journey_id
    and journeys.user_id = auth.uid()
));

commit;
