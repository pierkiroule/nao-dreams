const titles = ["La nuit qui gardait la route", "L'odyssée des signes silencieux", "Le passage où tout recommence"];
const scenes = [
  "Dans le bleu profond d'une nuit sans bord, {a} veillait près d'un rivage de verre. {b} arriva sans bruit, et l'air changea de température.",
  "Personne ne savait où menait le chemin. {a} en suivait la lueur, jusqu'à ce que {b} ouvre dans le ciel une porte plus vaste que le jour.",
  "Chaque rêve déposait une trace sur la peau du monde. {a} la recueillit, puis {b} emporta le secret vers un horizon qui respirait.",
];
export function generateLocalDream(contributions) {
 const symbols = contributions.map(({ emoji }) => emoji); const a = symbols[0] || "🌙"; const b = symbols[1] || "🌀"; const c = symbols[2] || "✨"; const index = symbols.length % scenes.length;
 return { title: titles[index], text: `${scenes[index].replace("{a}", a).replace("{b}", b)} Au loin, ${c} gardait une lumière pour le prochain voyageur.`, symbols };
}
