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
- `src/lib/db.js` : cache local IndexedDB (`journeys`, `contributions`, `discoveries`, `unlocks`, `settings`).
- `src/lib/supabase.js` : authentification anonyme, activation de la noix et synchronisation des compositions avec Supabase.
- `src/app/App.jsx` : parcours court, voyage, atlas, partage et ouverture premium simulée.
- `src/content/editorialGuidelines.md` : règles de rigueur culturelle.

Supabase est activé lorsque `VITE_SUPABASE_URL` et `VITE_SUPABASE_PUBLISHABLE_KEY` sont présents. L'application crée alors une session anonyme, enregistre le profil, le scan NFC et l'accès utilisateur, puis sauvegarde chaque découverte dans `dream_compositions`, `composition_cultures` et `dream_resonances`. IndexedDB reste utilisé comme cache local afin que le parcours continue en cas de perte de réseau. Aucun appel IA, aucune géolocalisation et aucun paiement réel ne sont utilisés.

Dans Supabase, l'authentification anonyme doit être activée et les politiques RLS doivent autoriser un utilisateur authentifié à gérer son propre `profiles`, `nut_scans`, `user_access`, `dream_compositions` et `dream_resonances`, ainsi qu'à lire les noix actives et les cultures publiées. La table `nao_nuts` doit contenir le code public `NAO-DREAM-001`, et les `slug` publiés de `dream_cultures` doivent correspondre aux identifiants des cartes de `src/data/dreamCultures.js`.

La navigation principale se limite à trois destinations : **Explorer**, le bouton central **Scanner**, et **Mon Nao**. Ce dernier prend la forme d'un passeport local présentant le niveau d'exploration, les découvertes, l'accès à l'Atlas, l'export des données et la simulation Premium.
