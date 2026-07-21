# NOA DU FUTUR

## Une noix, cinq interprètes, deux rêves

NOA est une petite noix qui voyage de main en main. Elle porte un rêve du futur, encore secret, que cinq personnes aident à réveiller. Personne ne crée ce rêve seul : chaque passeur répond à deux énigmes bienveillantes, puis ses intuitions font naître **l’Écho**, une interprétation collective du rêve originel.

## Parcours d’un passeur

1. Rencontre — Noa demande de l’aider à réveiller son rêve.
2. Énigmes — deux intuitions parmi plusieurs symboles ; aucune réponse n’est présentée comme fausse.
3. Score — Noa révèle un score d’intuition personnel et encourage le passeur.
4. Progression — les cinq contributions sont comptées sans révéler le rêve secret.
5. Transmission — Noa repart physiquement vers une autre personne.
6. Révélation — après le cinquième passeur, le rêve originel et l’Écho collectif apparaissent ; le dernier passeur choisit celui qui poursuivra le prochain cycle.

## Mode démo local

`USE_LOCAL_DEMO` est activé dans `src/services/dreamRepository.js`. Aucun compte, réseau ou clé n’est nécessaire. Un rêve secret est toujours chargé dès la création du voyage, puis cinq passages locaux permettent de le réveiller.

`createSeededJourney()` crée un voyage jouable avec son fragment-source. `resetDemoJourneyWithSeed()` réinitialise le cycle de démonstration. `LocalDreamRepository` reste l’implémentation active et `SupabaseDreamRepository` est réservé à une synchronisation future.

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
