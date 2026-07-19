# NAO Dreams

## Supabase

The app creates a profile from the pseudonym entered on the home page, then saves
its started journeys in the existing `public.journeys` table. Local storage remains
the source used to restore an in-progress journey if the visitor is offline.

1. Apply the account migrations, in order, in the Supabase SQL editor (or through
   your Supabase migration workflow):
   - `supabase/migrations/20260718010000_create_profiles.sql`
   - `supabase/migrations/20260719000000_link_profiles_to_journeys.sql`
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
