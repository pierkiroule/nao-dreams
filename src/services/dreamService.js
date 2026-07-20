export const FORBIDDEN_TERMS = ["tu es", "cela signifie", "tu devrais", "ton inconscient", "ce symbole représente", "ce rêve révèle", "apprends à", "invite à"];

function seededRandom(seed) {
  let value = 0;
  for (const character of String(seed)) value = (value * 31 + character.charCodeAt(0)) >>> 0;
  return () => ((value = (value * 1664525 + 1013904223) >>> 0) / 4294967296);
}

function pick(items, random) {
  return items[Math.floor(random() * items.length)];
}

function pluralize(count, singular, plural = `${singular}s`) {
  return count > 1 ? plural : singular;
}

const sensorySettings = [
  { light: "l'heure bleue", air: "une odeur de pin, de sel et de terre humide", ground: "la fraîcheur du sol remonte doucement sous tes pas", horizon: "une clairière lumineuse se dessine au loin" },
  { light: "le premier matin", air: "l'air clair a le goût d'une pluie récente", ground: "des herbes hautes frôlent tes chevilles", horizon: "un chemin pâle s'ouvre vers les collines" },
  { light: "la fin d'après-midi", air: "un souffle tiède mêle le bois chauffé et les feuilles froissées", ground: "la lumière dorée tremble sur le sentier", horizon: "une ligne d'eau reflète un ciel encore ouvert" },
  { light: "une nuit calme", air: "l'air frais porte un parfum de mousse et de pierre", ground: "le silence rend chaque pas plus présent", horizon: "des fenêtres lointaines scintillent comme des promesses" },
];

const gentleMovements = [
  "avance sans hâte", "prend le temps de respirer", "suit une lueur tranquille", "écoute le monde se déposer", "laisse ses pensées trouver leur rythme",
];

const possibilities = [
  "Ce qui vient peut prendre une forme simple, fidèle à ton élan.",
  "Tu sens qu'un espace neuf existe déjà, prêt à accueillir ton prochain geste.",
  "Devant toi, l'horizon ne demande rien : il laisse simplement de la place à ce qui compte.",
  "Quelque chose de doux se met en mouvement, à la mesure de tes désirs.",
];

/** Creates a grounded, sensory and open-ended dream scene without interpretation. */
export function generateDream({ chosenEmoji, constellation = [], seed = crypto.randomUUID() }) {
  if (!chosenEmoji?.emoji) throw new Error("Un émoji sélectionné est nécessaire.");
  const random = seededRandom(seed);
  const companions = constellation.filter((item) => item.id !== chosenEmoji.id);
  const companion = companions.length ? pick(companions, random) : { emoji: "✨", label: "lumière" };
  const setting = pick(sensorySettings, random);
  const movement = pick(gentleMovements, random);
  const possibility = pick(possibilities, random);
  const chosenName = chosenEmoji.label ?? "signe";
  const companionName = companion.label ?? "lumière";
  const text = `À ${setting.light}, ${chosenEmoji.emoji} — ${chosenName} — et ${companion.emoji} — ${companionName} — t'accompagnent près d'un passage tranquille. ${setting.air}; ${setting.ground}. Tu ${movement}, tandis que ${setting.horizon}. ${possibility}`;
  return { text, seed, templateKey: "sensory-open-horizon" };
}

const titleOpenings = ["Le chemin de", "Le matin avec", "Au seuil de", "La lumière après", "L'horizon de", "Le jardin secret de"];
const titleEndings = ["vers l'horizon", "qui devient un départ", "et la lumière à venir", "au bord d'un nouveau souffle", "là où le jour s'ouvre", "pour ce qui veut grandir"];

export function generateDreamTitles({ emojis, seed = crypto.randomUUID() }) {
  const random = seededRandom(seed);
  const names = emojis.map((item) => item.label).filter(Boolean);
  return Array.from({ length: 3 }, (_, index) => {
    const name = names.length ? names[Math.floor(random() * names.length)] : "la nuit";
    const opening = titleOpenings[(index + Math.floor(random() * titleOpenings.length)) % titleOpenings.length];
    return `${opening} ${name} ${pick(titleEndings, random)}`;
  });
}

export function generateCoCreativeDream({ emojis, title, resonance, seedCount, seed = crypto.randomUUID() }) {
  const base = generateDream({
    chosenEmoji: emojis[0] ?? { id: "moon", emoji: "🌙", label: "lune" },
    constellation: emojis,
    seed,
  });
  const sharedTrace = seedCount
    ? `${seedCount} ${pluralize(seedCount, "trace", "traces")} de rêveurs précédents se mêlent au paysage : une chaleur discrète, comme si d'autres pas avaient déjà rendu le chemin plus accueillant.`
    : "Le paysage reste ouvert, avec toute la place nécessaire pour ton propre élan.";
  const personalEcho = resonance.trim()
    ? ` Ta résonance — « ${resonance.trim()} » — devient un détail précieux du paysage, présent sans jamais l'enfermer.`
    : "";
  return {
    ...base,
    text: `${title}. ${base.text} ${sharedTrace}${personalEcho}`,
    templateKey: "co-creative-sensory-horizon",
  };
}
