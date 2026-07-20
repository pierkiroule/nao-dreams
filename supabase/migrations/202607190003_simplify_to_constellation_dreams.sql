begin;

create table if not exists public.constellations (
  id text primary key,
  slug text not null unique,
  name text not null,
  description text,
  position integer not null default 1,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.constellation_emojis (
  id text primary key,
  constellation_id text not null references public.constellations(id) on delete cascade,
  emoji text not null,
  label text not null,
  position integer not null check (position >= 1 and position <= 12),
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (constellation_id, emoji),
  unique (constellation_id, position)
);

create table if not exists public.dreams (
  id uuid primary key default gen_random_uuid(),
  anonymous_id uuid not null references auth.users(id) on delete cascade,
  constellation_id text references public.constellations(id) on delete set null,
  selected_emoji_id text references public.constellation_emojis(id) on delete set null,
  dream_text text not null check (char_length(dream_text) between 1 and 700),
  template_key text not null,
  generation_seed text not null,
  created_at timestamptz not null default now()
);

alter table public.dreams add column if not exists anonymous_id uuid references auth.users(id) on delete cascade;
alter table public.dreams add column if not exists constellation_id text references public.constellations(id) on delete set null;
alter table public.dreams add column if not exists selected_emoji_id text references public.constellation_emojis(id) on delete set null;
alter table public.dreams add column if not exists dream_text text;
alter table public.dreams add column if not exists template_key text;
alter table public.dreams add column if not exists generation_seed text;

create index if not exists dreams_anonymous_created_idx on public.dreams(anonymous_id, created_at desc);
create index if not exists constellation_emojis_active_idx on public.constellation_emojis(constellation_id, position) where is_active;

alter table public.constellations enable row level security;
alter table public.constellation_emojis enable row level security;
alter table public.dreams enable row level security;
grant select on public.constellations, public.constellation_emojis to authenticated;
grant select, insert on public.dreams to authenticated;

do $$ begin
  create policy "authenticated users read active constellations" on public.constellations for select to authenticated using (is_active);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "authenticated users read active constellation emojis" on public.constellation_emojis for select to authenticated using (is_active);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "owners read dreams" on public.dreams for select to authenticated using (anonymous_id = auth.uid());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "owners create dreams" on public.dreams for insert to authenticated with check (anonymous_id = auth.uid());
exception when duplicate_object then null; end $$;

insert into public.constellations (id, slug, name, description, position) values
  ('forest', 'foret', 'Forêt nocturne', 'Une clairière qui ne dort jamais.', 1),
  ('ocean', 'ocean', 'Océan', 'Un fond marin sans fond.', 2),
  ('sky', 'ciel', 'Ciel', 'Un ciel qui a oublié la gravité.', 3)
on conflict (id) do update set name = excluded.name, description = excluded.description, position = excluded.position;

insert into public.constellation_emojis (id, constellation_id, emoji, label, position) values
  ('forest-mushroom','forest','🍄','champignon',1),('forest-fox','forest','🦊','renard',2),('forest-owl','forest','🦉','chouette',3),('forest-acorn','forest','🌰','gland',4),('forest-deer','forest','🦌','cerf',5),('forest-fern','forest','🌿','fougère',6),('forest-snail','forest','🐌','escargot',7),('forest-key','forest','🗝️','clé',8),('forest-rain','forest','🌧️','pluie',9),('forest-moon','forest','🌙','lune',10),('forest-feather','forest','🪶','plume',11),('forest-firefly','forest','✨','luciole',12),
  ('ocean-whale','ocean','🐋','baleine',1),('ocean-shell','ocean','🐚','coquillage',2),('ocean-octopus','ocean','🐙','poulpe',3),('ocean-fish','ocean','🐟','poisson',4),('ocean-coral','ocean','🪸','corail',5),('ocean-pearl','ocean','🫧','bulle',6),('ocean-anchor','ocean','⚓','ancre',7),('ocean-boat','ocean','⛵','bateau',8),('ocean-moon','ocean','🌙','lune',9),('ocean-starfish','ocean','⭐','étoile',10),('ocean-crab','ocean','🦀','crabe',11),('ocean-jellyfish','ocean','🪼','méduse',12),
  ('sky-cloud','sky','☁️','nuage',1),('sky-kite','sky','🪁','cerf-volant',2),('sky-bird','sky','🕊️','oiseau',3),('sky-sun','sky','☀️','soleil',4),('sky-rainbow','sky','🌈','arc-en-ciel',5),('sky-balloon','sky','🎈','ballon',6),('sky-moon','sky','🌙','lune',7),('sky-star','sky','⭐','étoile',8),('sky-rocket','sky','🚀','fusée',9),('sky-planet','sky','🪐','planète',10),('sky-telescope','sky','🔭','télescope',11),('sky-lightning','sky','⚡','éclair',12)
on conflict (id) do update set emoji = excluded.emoji, label = excluded.label, position = excluded.position;

-- Deprecated but intentionally retained: journeys, journey_choices, bubble_networks,
-- bubble_network_roots, bubble_links, dream_bubbles, graph statistics, dream_seeds,
-- and dream_seed_reflections. A later destructive migration may remove them after export.
commit;
