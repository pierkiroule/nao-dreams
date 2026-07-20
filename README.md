# NAO Dreams

## Un réseau poétique. Jusqu’à huit signes. Un rêve co-créé.

NAO Dreams propose un parcours onirique sans thème préalable : la personne compose une constellation de 1 à 8 émojis dans un réseau de 16 signes, choisit le titre qui résonne, peut déposer une résonance personnelle et invite des graines de rêves antérieurs avant la génération simulée.

La dernière étape simule une génération IA et l’utilisation de crédits : 3 crédits sont consommés sur un solde initial de 12, puis le solde restant est affiché avec le rêve.

## Développement

```bash
npm install
npm run dev
```

## Vérifications

```bash
npm test
npm run lint
npm run build
```

## Supabase (optionnel)

Le client peut synchroniser les rêves terminés lorsqu’il est configuré avec Supabase. Les migrations historiques sont conservées dans `supabase/migrations`.
