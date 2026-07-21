# NAO SOUCY•°

**Recycle ton souci. Révèle sa résonance.**

NAO SOUCY•° est une expérience mobile locale-first liée à une noix NFC. Sans demander de texte intime, elle transforme une empreinte émotionnelle (émotions, thèmes et mouvement recherché) en un Écho du Réseau gratuit, puis en une Résonance inspirante déblocable avec un crédit.

## Lancer le projet

```bash
npm install
npm run dev
```

## Éléments simulés dans ce MVP

- Le réseau et ses statistiques sont générés localement par `echoService`.
- Les Résonances sont composées depuis des templates locaux.
- Les achats de crédits sont une simulation locale, stockée dans `localStorage`.
- L’identifiant de la noix est fixe dans ce prototype ; une puce NFC ne doit contenir à terme qu’une URL ou un identifiant aléatoire.

L’interface ne collecte que des catégories fermées. Elle n’envoie ni texte libre, ni nom, ni localisation précise.

## Prochaines intégrations

1. Remplacer les services mock par une table Supabase d’empreintes agrégées et dissociées de l’identité.
2. Connecter les packs de crédits à Stripe Checkout et vérifier les crédits côté serveur.
3. Brancher une API IA sur `generateResonance` avec des garde-fous rédactionnels : aucune interprétation médicale, thérapeutique ou certaine.
