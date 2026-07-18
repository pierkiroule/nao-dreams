create table public.profiles (
  id uuid primary key,
  pseudonym text not null check (char_length(pseudonym) between 2 and 24),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Public clients can create profiles"
  on public.profiles for insert to anon
  with check (true);
