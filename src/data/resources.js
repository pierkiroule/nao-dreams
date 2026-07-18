const terminalAtmospheres = [
  ["brume", "🌫️", "Brume"],
  ["lune", "🌙", "Clair de lune"],
  ["pluie", "🌧️", "Pluie chaude"],
];

function node(id, emoji, label, children = []) {
  return { id, emoji, label, children };
}

function makeObjects(prefix) {
  return [
    node(`${prefix}-cle`, "🗝️", "Clé", terminalAtmospheres.map(([id, emoji, label]) => node(`${prefix}-${id}`, emoji, label))),
    node(`${prefix}-plume`, "🪶", "Plume", terminalAtmospheres.map(([id, emoji, label]) => node(`${prefix}-${id}`, emoji, label))),
    node(`${prefix}-lanterne`, "🏮", "Lanterne", terminalAtmospheres.map(([id, emoji, label]) => node(`${prefix}-${id}`, emoji, label))),
  ];
}

function makePresences(prefix) {
  return [
    node(`${prefix}-baleine`, "🐋", "Baleine", makeObjects(`${prefix}-baleine`)),
    node(`${prefix}-renard`, "🦊", "Renard", makeObjects(`${prefix}-renard`)),
    node(`${prefix}-chouette`, "🦉", "Chouette", makeObjects(`${prefix}-chouette`)),
  ];
}

function makeLandscapes(prefix) {
  return [
    node(`${prefix}-ocean`, "🌊", "Océan", makePresences(`${prefix}-ocean`)),
    node(`${prefix}-foret`, "🌲", "Forêt", makePresences(`${prefix}-foret`)),
    node(`${prefix}-montagne`, "⛰️", "Montagne", makePresences(`${prefix}-montagne`)),
  ];
}

export const dreamGraph = [
  node("metamorphose", "🦋", "Métamorphose", makeLandscapes("metamorphose")),
  node("memoire", "🫧", "Mémoire", makeLandscapes("memoire")),
  node("voyage", "🧭", "Voyage", makeLandscapes("voyage")),
];

export const sensationNodes = [
  node("apaisement", "🫶", "Apaisement"),
  node("mystere", "✨", "Mystère"),
  node("elan", "💫", "Élan"),
];

export const dreamLevels = ["theme", "landscape", "presence", "object", "atmosphere"];

export const dreamQuestions = {
  theme: "Quel thème résonne avec ton rêve ?",
  landscape: "Quel paysage résonne avec ton rêve ?",
  presence: "Quel animal ou quelle présence te rejoint ?",
  object: "Quel objet dérive vers toi ?",
  atmosphere: "Choisis trois atmosphères pour ton rêve.",
  sensation: "Quelle sensation veux-tu laisser au rêve ?",
};

export function findGraphNode(id, nodes = dreamGraph) {
  for (const current of nodes) {
    if (current.id === id) return current;
    const found = findGraphNode(id, current.children);
    if (found) return found;
  }
  return null;
}

export function findSensation(id) {
  return sensationNodes.find((item) => item.id === id) ?? null;
}
