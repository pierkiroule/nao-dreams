alter table public.journeys
  add column if not exists profile_id uuid references public.profiles(id);

create index if not exists journeys_profile_id_idx
  on public.journeys(profile_id);

alter table public.journeys enable row level security;

create policy "Public clients can create journeys"
  on public.journeys for insert to anon
  with check (true);

create policy "Public clients can update journeys"
  on public.journeys for update to anon
  using (true)
  with check (true);
