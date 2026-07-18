# NAO Dreams

## Supabase

The app synchronizes a started journey to Supabase after every state change. Local
storage remains the source used to restore an in-progress journey if the visitor is
offline or Supabase is not configured.

1. Run `supabase/migrations/20260718000000_create_dream_journeys.sql` in the
   Supabase SQL editor (or through your Supabase migration workflow).
2. In Vercel, add the following environment variables to the required environments:
   - `VITE_SUPABASE_URL`: `https://lzkuwiutppzxmglsvvol.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: the project's publishable key (the legacy
     anon key also works when set as `VITE_SUPABASE_ANON_KEY`).
3. Redeploy the application. Vite exposes only variables prefixed with `VITE_` to
   the browser; never place a Supabase service-role key in these variables.

Copy `.env.example` to `.env.local` for local development. The app continues to work
without those variables, but remote synchronization is skipped.

## Scripts

- `npm run dev` — start the Vite development server.
- `npm run build` — produce a production build.
- `npm run lint` — run Oxlint.
