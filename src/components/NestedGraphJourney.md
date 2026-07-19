# L’inconscient partagé de NAO

`NestedGraphJourney` remplace la sélection séquentielle par un unique espace de
constellation conservé pendant les trois profondeurs. Les positions sont calculées
à partir de `networkId`, du parent et de la profondeur : revenir en arrière restaure
donc exactement la même composition sans simulation physique.

La couche `bubbleNetworkService` ne récupère que les six racines ou les six enfants
nécessaires. Les statistiques sont optionnelles : `resonanceScore` et
`cooccurrenceCount` produisent respectivement une variation de taille et de lien
bornée, ou un rendu neutre lorsqu’elles sont absentes.

La migration `supabase/migrations/202607190001_add_bubble_graph_stats.sql` ajoute
la couche vivante : les occurrences sont calculées par emoji et les paires de
symboles choisies dans un même journey produisent les cooccurrences. `bubble_links`
reste exclusivement le graphe éditorial de navigation. Après migration, exécuter
`select public.refresh_bubble_graph_stats();` (ou planifier ce recalcul côté serveur).

Le parcours narratif est complété par `dream_seeds` (phrase projective liée au
trio) et `dream_seed_reflections` (texte personnel privé, non partageable par
défaut). La migration `202607190002_add_dream_seeds_and_private_reflections.sql`
doit être appliquée après celle des statistiques. La phrase de fallback est stable
pour un même trio, ne contient ni conseil ni interprétation, et le texte libre
n’est jamais transmis aux événements analytiques.

Lorsqu’un projet Supabase est configuré mais qu’aucun réseau n’est encore publié
(ou que la lecture est temporairement indisponible), le réseau embarqué complet est
utilisé automatiquement. L’utilisateur peut donc toujours démarrer son parcours;
l’incident distant est conservé dans la console pour l’exploitation.

Le rendu CSS avec perspective est le fallback universel et reste entièrement
accessible : les six contrôles DOM sont les cibles clavier/tactiles. Three.js et
React Three Fiber n’ont pas pu être ajoutés dans cet environnement car le registre
de paquets refuse ces dépendances (HTTP 403). La séparation `graphMath` /
`graphTransition` permet d’ajouter ultérieurement un `GraphCanvas` Fiber sans
modifier la logique de données ni de parcours.
