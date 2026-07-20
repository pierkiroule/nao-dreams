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
