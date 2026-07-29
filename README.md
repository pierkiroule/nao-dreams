# NAO DREAM

**La noix qui voyage dans les rêves du monde.**

Nao Dream est un atlas anthropologique et culturel local-first lié à une noix NFC. En moins de 45 secondes, une personne choisit quelques emojis et thèmes puis rencontre, par correspondance éditoriale, un récit ou un usage du rêve situé. Il ne s'agit ni d'une interprétation psychologique, ni d'une divination : l'expérience invite à voyager à travers les cultures du rêve.

## Lancer le projet

```bash
npm install
npm run dev
```

Le build de production est généré avec `npm run build` et les tests avec `npm test`.

## Architecture du MVP

- `src/data/dreamCultures.js` : 36 cartes culturelles locales, tags et symboles.
- `src/lib/resonanceEngine.js` : score stable de correspondance et bonus de diversité.
- `src/lib/resonanceText.js` : formulations locales et prudentes.
- `src/stores/useDreamDraftStore.js` : brouillons de rêves locaux V2, conservés hors ligne et synchronisés de façon explicite.
- `src/services/dreamSyncService.js` : synchronisation idempotente des compositions vers Supabase.
- `src/lib/localData.js` : migration versionnée et réinitialisation ciblée des données de test.
- `src/lib/supabase.js` : authentification anonyme, activation de la noix et synchronisation des compositions avec Supabase.
- `src/app/App.jsx` : parcours court, voyage, atlas, partage et ouverture premium simulée.
- `src/content/editorialGuidelines.md` : règles de rigueur culturelle.
- `src/components/nao/` : expérience du Grand O•° — fond vivant, noix-bateau, bulles, cercle culturel, tissage et lecture.
- `src/styles/nao.css` : palette, rythme, responsive mobile-first et animations contemplatives centralisés.

Supabase est activé lorsque `VITE_SUPABASE_URL` et `VITE_SUPABASE_PUBLISHABLE_KEY` sont présents. L'application conserve la session anonyme, vérifie séparément l'activation dans `user_access`, puis synchronise les rêves dans `dream_compositions` et exactement trois associations `composition_cultures`. Le `client_id` rend chaque envoi idempotent. Les rêves non synchronisés restent dans le stockage local V2. Aucun appel IA, aucune géolocalisation et aucun paiement réel ne sont utilisés.

Les indicateurs de connexion, d’accès et de synchronisation restent visibles sur la page d’accueil dans tous les environnements. Le bouton destructif de réinitialisation reste réservé au développement ; pour l’autoriser explicitement dans un autre environnement de test, définir `VITE_ENABLE_TEST_TOOLS=true`. La migration SQL de `supabase/migrations/` doit être appliquée avant d'activer la synchronisation V2.

Le panneau de test vérifie séparément Supabase, la session et l'activation dans `user_access`. Le bouton **Retester** relance ces contrôles puis une unique tentative de synchronisation des seuls rêves V2 réellement en attente.

La page d’accueil suit une odyssée en quatre temps : entrée dans le Grand O•°, choix tactile de trois échos culturels, tissage, puis lecture et résonance. Les pages historiques restent accessibles par l’action secondaire **Explorer autrement** afin de préserver les fonctionnalités métier existantes.

Dans Supabase, l'authentification anonyme doit être activée et les politiques RLS doivent autoriser un utilisateur authentifié à gérer son propre `profiles`, `nut_scans`, `user_access`, `dream_compositions` et `dream_resonances`, ainsi qu'à lire les noix actives et les cultures publiées. La table `nao_nuts` doit contenir le code public `NAO-DREAM-001`, et les `slug` publiés de `dream_cultures` doivent correspondre aux identifiants des cartes de `src/data/dreamCultures.js`.

La navigation principale se limite à trois destinations : **Explorer**, le bouton central **Scanner**, et **Mon Nao**. Ce dernier prend la forme d'un passeport local présentant le niveau d'exploration, les découvertes, l'accès à l'Atlas, l'export des données et la simulation Premium.
