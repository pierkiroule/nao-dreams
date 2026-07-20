export function buildDreamPrompt(contributions) {
  const fragments = contributions.map(({ emoji, label, echo }) => `${emoji} (${label}${echo ? `, écho privé : ${echo}` : ""})`).join(", ");
  return `Écris un récit onirique surréaliste de 250 à 400 mots à partir de ces fragments : ${fragments}. Donne un titre, crée une continuité sensible entre les signes, n'ajoute aucune explication psychologique, aucun diagnostic ni interprétation imposée. Intègre les échos privés avec délicatesse. Termine par une dernière phrase ouverte.`;
}
