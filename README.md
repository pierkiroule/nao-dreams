# NAO DREAM

**La noix qui voyage dans les rêves du monde.**

Nao Dream est une expérience culturelle locale-first liée à une noix NFC. En moins de 45 secondes, une personne choisit quelques emojis et thèmes puis rencontre, par correspondance éditoriale, un récit onirique situé. Il ne s'agit ni d'une interprétation psychologique, ni d'une divination.

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
- `src/lib/db.js` : stockage IndexedDB (`journeys`, `contributions`, `discoveries`, `unlocks`, `settings`).
- `src/app/App.jsx` : parcours court, voyage, atlas, partage et ouverture premium simulée.
- `src/content/editorialGuidelines.md` : règles de rigueur culturelle.

Aucun compte, backend, appel IA, Supabase, géolocalisation ou paiement réel n'est utilisé. Le partage natif et l'export PNG sont réalisés dans le navigateur.
