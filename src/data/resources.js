const emoji = (id, symbol, label, keywords) => ({
  id: `network-${id}`,
  emoji: symbol,
  label,
  keywords,
});

// A single shared sky: no theme is chosen before entering the network.
export const networkEmojis = [
  emoji("moon", "🌙", "lune", ["nuit", "marée"]),
  emoji("shell", "🐚", "coquillage", ["écoute", "spirale"]),
  emoji("bird", "🕊️", "oiseau", ["aile", "souffle"]),
  emoji("key", "🗝️", "clé", ["seuil", "secret"]),
  emoji("mushroom", "🍄", "champignon", ["sous-bois", "abri"]),
  emoji("whale", "🐋", "baleine", ["profondeur", "chant"]),
  emoji("star", "⭐", "étoile", ["lueur", "vœu"]),
  emoji("boat", "⛵", "voile", ["voyage", "horizon"]),
  emoji("fox", "🦊", "renard", ["trace", "roux"]),
  emoji("cloud", "☁️", "nuage", ["flotte", "brume"]),
  emoji("pearl", "🫧", "bulle", ["fragile", "respiration"]),
  emoji("feather", "🪶", "plume", ["air", "légèreté"]),
  emoji("anchor", "⚓", "ancre", ["fond", "attache"]),
  emoji("kite", "🪁", "cerf-volant", ["vent", "fil"]),
  emoji("firefly", "✨", "luciole", ["étincelle", "veille"]),
  emoji("planet", "🪐", "planète", ["lointain", "orbite"]),
];

export const networkLinks = [
  [0, 1], [0, 2], [0, 6], [1, 4], [1, 10], [2, 3], [2, 9], [3, 8],
  [3, 12], [4, 5], [4, 8], [5, 7], [5, 10], [6, 7], [6, 14], [7, 12],
  [8, 11], [9, 13], [9, 15], [10, 14], [11, 13], [12, 15], [13, 14], [14, 15],
];
