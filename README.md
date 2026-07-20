# NAO Dreams

## Une constellation. Douze symboles. Un seul choix. Un rêve impossible.

NAO compose localement une scène surréaliste courte à partir d'un unique émoji.
Le générateur n'appelle aucun modèle ni service externe : un seed et des patrons
éditoriaux locaux rendent chaque rêve rejouable. Il ne produit ni interprétation,
ni conseil, ni analyse symbolique.

Les anciens parcours `journeys` / `journey_choices` et le graphe de bulles sont
**dépréciés** : ils sont conservés en base pour ne pas effacer l'historique, mais
ne participent plus à l'expérience. La migration
`202607190003_simplify_to_constellation_dreams.sql` crée les tables actives
`constellations`, `constellation_emojis` et `dreams`, leurs index et leurs RLS.
Une migration destructive distincte, après export et validation de production,
pourra retirer les réseaux, racines, liens, statistiques et graines historiques.

## Supabase

On first launch, the app creates an anonymous Supabase Auth session,
generates a pseudonym, and stores only an approximate location. The anonymous
session is kept in browser storage; a player who clears it or changes device cannot
recover their universe until a permanent sign-in method is added.

Before deploying, configure Supabase:

1. In **Authentication → Providers**, enable **Anonymous sign-ins**.
2. Configure the `profiles` trigger to create the profile when an Auth user is
   created. The app only updates that trigger-created row from the frontend.
3. Run the constellation migration. It lets authenticated anonymous users read
   active constellations and emojis, create dreams owned by `anonymous_id = auth.uid()`,
   and read only their own dreams. The browser uses the publishable/anon key only.
4. If the API reports that `public.profiles` is missing although the table exists,
   reload the PostgREST schema cache in the SQL editor:
   `notify pgrst, 'reload schema';`
5. In Vercel, add the following environment variables to the required environments:
   - `VITE_SUPABASE_URL`: `https://lzkuwiutppzxmglsvvol.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: the project's publishable key (the legacy
     anon key also works when set as `VITE_SUPABASE_ANON_KEY`).
6. Redeploy the application. Vite exposes only variables prefixed with `VITE_` to
   the browser; never place a Supabase service-role key in these variables.

Copy `.env.example` to `.env.local` for local development. The app continues to work
without those variables, but remote synchronization is skipped.

## Scripts

- `npm run dev` — start the Vite development server.
- `npm run build` — produce a production build.
- `npm run lint` — run Oxlint.
