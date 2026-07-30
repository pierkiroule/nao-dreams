alter table public.dream_compositions
  add column if not exists session_id text,
  add column if not exists emoji_ids text[],
  add column if not exists seed text,
  add column if not exists fragment_ids text[],
  add column if not exists pattern_id text,
  add column if not exists library_version integer default 2,
  add column if not exists revealed_count integer default 0,
  add column if not exists completed_at timestamptz,
  add column if not exists resonance_type text,
  add column if not exists resonance_word text,
  add column if not exists released_at timestamptz;
