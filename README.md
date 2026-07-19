# NAO Dreams

## Supabase

The app uses the existing `public.profiles` and `public.journeys` tables supplied by
your project. On first launch, the app creates an anonymous Supabase Auth session,
generates a pseudonym, and stores only an approximate location. The anonymous
session is kept in browser storage; a player who clears it or changes device cannot
recover their universe until a permanent sign-in method is added.

Before deploying, configure Supabase:

1. In **Authentication → Providers**, enable **Anonymous sign-ins**.
2. Ensure the `anon` role can insert into `public.profiles` and insert/update
   `public.journeys` with RLS policies appropriate to your project.
3. If the API reports that `public.profiles` is missing although the table exists,
   reload the PostgREST schema cache in the SQL editor:
   `notify pgrst, 'reload schema';`
4. In Vercel, add the following environment variables to the required environments:
   - `VITE_SUPABASE_URL`: `https://lzkuwiutppzxmglsvvol.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: the project's publishable key (the legacy
     anon key also works when set as `VITE_SUPABASE_ANON_KEY`).
5. Redeploy the application. Vite exposes only variables prefixed with `VITE_` to
   the browser; never place a Supabase service-role key in these variables.

Copy `.env.example` to `.env.local` for local development. The app continues to work
without those variables, but remote synchronization is skipped.

## Scripts

- `npm run dev` — start the Vite development server.
- `npm run build` — produce a production build.
- `npm run lint` — run Oxlint.
