# L’inconscient partagé de NAO

`NestedGraphJourney` remplace la sélection séquentielle par un unique espace de
constellation conservé pendant les trois profondeurs. Les positions sont calculées
à partir de `networkId`, du parent et de la profondeur : revenir en arrière restaure
donc exactement la même composition sans simulation physique.

La couche `bubbleNetworkService` ne récupère que les six racines ou les six enfants
nécessaires. Les statistiques sont optionnelles : `resonanceScore` et
`cooccurrenceCount` produisent respectivement une variation de taille et de lien
bornée, ou un rendu neutre lorsqu’elles sont absentes.

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
