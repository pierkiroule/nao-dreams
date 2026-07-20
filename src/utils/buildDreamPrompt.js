export function buildDreamPrompt(contributions) {
  const fragments = contributions.map(({ emoji, label }) => `${emoji} (${label})`).join(", ");
  return `Écris un récit onirique surréaliste de 250 à 400 mots à partir de ces fragments : ${fragments}. Donne un titre, crée une continuité sensible entre les signes, n'ajoute aucune explication psychologique, aucun diagnostic ni interprétation imposée. Termine par une dernière phrase ouverte.`;
}
