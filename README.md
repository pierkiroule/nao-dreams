# NOA DREAMS

## Someone chose you.

NOA DREAMS est un cadavre exquis onirique pensé pour accompagner une noix physique munie d’un QR code ou d’un tag NFC. Chaque personne choisit **un seul emoji** : son fragment rejoint un rêve collectif, puis la noix continue son voyage.

## Parcours

1. Invitation — « Someone chose you. »
2. Constellation — une constellation de 12 signes, un seul choix.
3. Intégration — le signe est absorbé par Noa.
4. Transmission — partage du lien avec la prochaine personne.
5. Progression — nombre de fragments et révélation du rêve au seuil défini.

## Mode démo local

`USE_LOCAL_DEMO` est activé dans `src/services/dreamRepository.js`. L’application fonctionne sans authentification, clé ni réseau : elle initialise localement un rêve avec 7 fragments, ajoute le signe du joueur dans `localStorage`, puis rend le rêve disponible à la révélation au 8e fragment.

`LocalDreamRepository` est la couche actuellement active. `SupabaseDreamRepository` reste volontairement un emplacement réservé pour la connexion future.

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
