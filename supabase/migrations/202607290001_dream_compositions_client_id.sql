alter table public.dream_compositions
add column if not exists client_id uuid;

create unique index if not exists dream_compositions_user_client_unique_idx
on public.dream_compositions(user_id, client_id)
where client_id is not null;
