const sensoryNeeds = [
  { id: "ocean", label: "Océan", emoji: "🌊" },
  { id: "forest", label: "Forêt", emoji: "🌲" },
  { id: "moon", label: "Lune", emoji: "🌙" },
  { id: "fire", label: "Feu", emoji: "🔥" },
  { id: "garden", label: "Jardin", emoji: "🌷" },
  { id: "bird", label: "Oiseau", emoji: "🕊️" },
];

const secondLevel = [
  ["calm", "Calme", "🫧"], ["shelter", "Refuge", "🏠"], ["wonder", "Émerveillement", "✨"],
  ["tenderness", "Tendresse", "💗"], ["freedom", "Liberté", "🪶"], ["courage", "Courage", "🦁"],
];

const thirdLevel = [
  ["mist", "Brume", "🌫️"], ["whale", "Baleine", "🐋"], ["lantern", "Lanterne", "🏮"],
  ["feather", "Plume", "🪶"], ["key", "Clé", "🗝️"], ["butterfly", "Papillon", "🦋"],
];

function makeChildren(values) {
  return values.map(([id, label, emoji]) => ({
    id,
    label,
    emoji,
    children: thirdLevel.map(([leafId, leafLabel, leafEmoji]) => ({
      id: leafId,
      label: leafLabel,
      emoji: leafEmoji,
    })),
  }));
}

export const dreamResources = {
  network: {
    id: null,
    question: "Quel émoji résonne le plus avec tes besoins du moment ?",
    maxDepth: 3,
    roots: sensoryNeeds.map((need) => ({
      ...need,
      children: makeChildren(secondLevel),
    })),
  },
};
