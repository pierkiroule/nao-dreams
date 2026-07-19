const names = [
  "Renard",
  "Luciole",
  "Cerf",
  "Plume",
  "Hibou",
  "Dauphin",
  "Corbeau",
  "Papillon",
  "Loutre",
  "Comète",
];

const qualifiers = [
  "Nocturne",
  "Lointaine",
  "de Brume",
  "Solaire",
  "Secret",
  "d'Ambre",
  "Flottante",
  "d'Opale",
  "Silencieux",
  "des Marées",
];

export function generatePseudonym() {
  const name = names[Math.floor(Math.random() * names.length)];
  const qualifier = qualifiers[Math.floor(Math.random() * qualifiers.length)];
  const number = Math.floor(1000 + Math.random() * 9000);

  return `${name} ${qualifier} ${number}`;
}
