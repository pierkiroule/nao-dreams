const fallbackPhrases = [
  "Au fond de la brume, une couleur cherchait encore son nom.",
  "Il existe des nuits où l’eau se souvient du ciel avant le ciel lui-même.",
  "La lumière avait laissé son empreinte sur une porte que personne n’avait encore ouverte.",
  "Certaines graines attendent d’entendre un chant avant d’ouvrir les yeux.",
];

export function resolveDreamPhrase(bubbleIds) {
  const index = bubbleIds.join("").split("").reduce((total, character) => total + character.charCodeAt(0), 0) % fallbackPhrases.length;
  return fallbackPhrases[index];
}
