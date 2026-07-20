import { events, impossibleActions, objects, places, transformations, witnesses } from "../data/dreamLexicon.js";

export const FORBIDDEN_TERMS = ["tu es", "cela signifie", "tu devrais", "ton inconscient", "ce symbole représente", "ce rêve révèle", "apprends à", "invite à"];

function seededRandom(seed) {
  let value = 0;
  for (const character of String(seed)) value = (value * 31 + character.charCodeAt(0)) >>> 0;
  return () => ((value = (value * 1664525 + 1013904223) >>> 0) / 4294967296);
}

function pick(items, random) { return items[Math.floor(random() * items.length)]; }

const templates = [
  ({ chosen, action, place, event }) => `Dans ${place}, ${chosen} ${action}, jusqu'à ce que ${event}.`,
  ({ chosen, witness, object, transformation }) => `${witness} demanda à ${chosen} de garder ${object}, mais ${chosen} devint ${transformation}.`,
  ({ chosen, subject, action, place }) => `Cette nuit-là, ${place} se trouvait à l'intérieur de ${chosen}. ${subject} y ${action}.`,
  ({ chosen, witness, object, event }) => `${chosen} gardait ${object} pendant que ${witness} comptait les silences. Puis ${event}.`,
  ({ chosen, subject, action, transformation }) => `Chaque fois que ${chosen} ${action}, ${subject} devenait ${transformation}.`,
  ({ chosen, place, object, event }) => `Personne ne remarqua que ${chosen} avait remplacé ${object} dans ${place}. Alors ${event}.`,
  ({ chosen, witness, action, place }) => `Sous ${chosen}, ${witness} ${action} dans ${place}.`,
  ({ chosen, subject, transformation, event }) => `${subject} suivait ${chosen} comme une porte. Au bout du couloir, ${chosen} était ${transformation} et ${event}.`,
  ({ chosen, object, action, witness }) => `${chosen} ${action} avec ${object}; ${witness} fit semblant de ne rien voir.`,
  ({ chosen, place, transformation, event }) => `Au réveil, ${place} avait la forme de ${chosen}. ${chosen} portait ${transformation}, et ${event}.`,
  ({ chosen, subject, object, action }) => `${subject} posa ${object} sur ${chosen}, qui ${action}.`,
  ({ chosen, witness, place, event }) => `${witness} trouva ${chosen} endormi dans ${place}. Sans bruit, ${event}.`,
];

/** Creates one short, non-interpretive surreal scene without any network request. */
export function generateDream({ chosenEmoji, constellation = [], seed = crypto.randomUUID() }) {
  if (!chosenEmoji?.emoji) throw new Error("Un émoji sélectionné est nécessaire.");
  const random = seededRandom(seed);
  const companions = constellation.filter((item) => item.id !== chosenEmoji.id);
  const complementary = companions.length ? pick(companions, random).emoji : "🌙";
  const context = { chosen: chosenEmoji.emoji, subject: complementary, action: pick(impossibleActions, random), place: pick(places, random), object: pick(objects, random), transformation: pick(transformations, random), event: pick(events, random), witness: pick(witnesses, random) };
  const templateIndex = Math.floor(random() * templates.length);
  const text = templates[templateIndex](context);
  return { text, seed, templateKey: `surreal-${templateIndex + 1}` };
}

const titleBeginnings = ["La chambre où", "Le jour où", "Sous la peau de", "L'archive secrète de", "Le bateau qui attend", "La constellation de"];
const titleEndings = ["la lune apprend à nager", "les lucioles gardent la porte", "un silence devient bleu", "les marées se souviennent", "le vent écrit ton nom", "les objets rêvent encore"];

export function generateDreamTitles({ emojis, seed = crypto.randomUUID() }) {
  const random = seededRandom(seed);
  const names = emojis.map((item) => item.label).filter(Boolean);
  return Array.from({ length: 3 }, (_, index) => {
    const companion = names.length ? names[Math.floor(random() * names.length)] : "la nuit";
    return `${titleBeginnings[(index + Math.floor(random() * titleBeginnings.length)) % titleBeginnings.length]} ${companion} : ${titleEndings[Math.floor(random() * titleEndings.length)]}`;
  });
}

export function generateCoCreativeDream({ emojis, title, resonance, seedCount, seed = crypto.randomUUID() }) {
  const base = generateDream({ chosenEmoji: emojis[0] ?? { id: "moon", emoji: "🌙" }, constellation: emojis, seed });
  const chorus = seedCount ? `${seedCount} graine${seedCount > 1 ? "s" : ""} de rêveur${seedCount > 1 ? "s" : ""} ancien${seedCount > 1 ? "s" : ""} murmuraient au loin.` : "Le rêve gardait encore toute sa place pour ta propre marée.";
  const echo = resonance.trim() ? ` Ta résonance — « ${resonance.trim()} » — traversait la scène comme un fil d'argent.` : "";
  return { ...base, text: `${title}. ${base.text} ${chorus}${echo}` };
}
