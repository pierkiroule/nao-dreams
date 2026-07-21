# NOA DREAMS

## Someone chose you.

NOA DREAMS est un cadavre exquis onirique pensé pour accompagner une noix physique munie d’un QR code ou d’un tag NFC. Chaque voyage est lancé par un **fragment-source** déposé par son créateur ; chaque personne devine d’abord une trace déjà présente, puis choisit **un seul emoji** pour poursuivre le rêve collectif.

## Parcours

1. Accueil — une micro-scène déjà commencée par le fragment-source.
2. Intuition — le joueur tente de deviner un signe antérieur.
3. Réponse — la trace est révélée, puis le joueur ajoute son propre signe.
4. Conséquence — le rêve répond immédiatement ; un écho privé est facultatif.
5. Progression et transmission — le nombre de signes est visible, sans révéler le rêve entier.
6. Révélation finale — le récit apparaît au seuil défini.

## Mode démo local

`USE_LOCAL_DEMO` est activé dans `src/services/dreamRepository.js`. L’application fonctionne sans authentification, clé ni réseau : elle initialise localement un voyage avec son fragment-source 🚪, ajoute les signes dans `localStorage`, puis rend le rêve disponible à la révélation au 10e fragment total. Chaque contribution conserve une conséquence et un écho privé éventuel.

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
