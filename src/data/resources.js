const emoji = (id, symbol, keywords, associations) => ({
  id,
  emoji: symbol,
  keywords,
  metadata: { nouns: associations, verbs: [], places: [], objects: [], transformations: [] },
});

// A constellation is deliberately small: it is a single place to wander, not a graph to solve.
export const constellations = [
  {
    id: "forest",
    name: "Forêt",
    emoji: "🌲",
    emojis: [
      emoji("mushroom", "🍄", ["chapeau", "sous-bois"], ["des parapluies miniatures", "une cave à nuages"]), emoji("fox", "🦊", ["roux", "queue"], ["un manteau qui miaule"]), emoji("owl", "🦉", ["nuit", "regard"], ["un violon sans cordes"]), emoji("acorn", "🌰", ["graine", "bois"], ["un escalier de poche"]), emoji("deer", "🦌", ["bois", "clairière"], ["un train très lent"]), emoji("fern", "🌿", ["feuille", "vert"], ["une carte marine"]), emoji("snail", "🐌", ["spirale", "lent"], ["un orchestre de miettes"]), emoji("key", "🗝️", ["porte", "métal"], ["une serrure qui baille"]), emoji("rain", "🌧️", ["gouttes", "ciel"], ["des poissons transparents"]), emoji("moon", "🌙", ["lune", "argent"], ["une lampe renversée"]), emoji("feather", "🪶", ["plume", "air"], ["une échelle légère"]), emoji("firefly", "✨", ["lueur", "insecte"], ["un alphabet qui flotte"]),
    ],
  },
  {
    id: "ocean",
    name: "Océan",
    emoji: "🌊",
    emojis: [
      emoji("whale", "🐋", ["grand", "bleu"], ["shell", "moon"], ["une horloge qui respire", "un pull rayé"]),
      emoji("shell", "🐚", ["spirale", "plage"], ["whale", "pearl"], ["une oreille de velours", "une porte minuscule"]),
      emoji("octopus", "🐙", ["tentacules", "encre"], ["fish", "anchor"], ["huit gants de cuisine", "une machine à écrire"]),
      emoji("fish", "🐟", ["nage", "écailles"], ["octopus", "coral"], ["un journal plié", "des chaussures de verre"]),
      emoji("coral", "🪸", ["récif", "rose"], ["fish", "pearl"], ["une bibliothèque qui ondule", "des branches en sucre"]),
      emoji("pearl", "🫧", ["bulle", "blanc"], ["shell", "coral"], ["une lune à mâcher", "un bouton de pluie"]),
      emoji("anchor", "⚓", ["fer", "fond"], ["octopus", "boat"], ["une racine polie", "un éléphant de poche"]),
      emoji("boat", "⛵", ["voile", "voyage"], ["anchor", "moon"], ["un drap gonflé", "des roues de savon"]),
      emoji("moon", "🌙", ["lune", "marée"], ["whale", "boat"], ["un citron silencieux", "une fenêtre immergée"]),
      emoji("starfish", "⭐", ["étoile", "sable"], ["crab", "shell"], ["un biscuit céleste", "cinq petites portes"]),
      emoji("crab", "🦀", ["pinces", "côté"], ["starfish", "anchor"], ["un violoncelle rouge", "une boîte à secrets"]),
      emoji("jellyfish", "🪼", ["flotte", "transparent"], ["fish", "pearl"], ["un lustre mou", "des cloches endormies"]),
    ],
  },
  {
    id: "sky",
    name: "Ciel",
    emoji: "☁️",
    emojis: [
      emoji("cloud", "☁️", ["blanc", "flotte"], ["kite", "moon"], ["un canapé qui neige", "une valise ouverte"]),
      emoji("kite", "🪁", ["vent", "fil"], ["cloud", "bird"], ["un poisson carré", "une lettre géante"]),
      emoji("bird", "🕊️", ["aile", "vol"], ["kite", "sun"], ["une tasse à bec", "un gant qui chante"]),
      emoji("sun", "☀️", ["jaune", "chaud"], ["bird", "rainbow"], ["une roue de fromage", "un œil qui cligne"]),
      emoji("rainbow", "🌈", ["couleurs", "arc"], ["sun", "balloon"], ["un escalier liquide", "sept rubans mouillés"]),
      emoji("balloon", "🎈", ["air", "rouge"], ["rainbow", "moon"], ["un cœur sans corps", "une ampoule timide"]),
      emoji("moon", "🌙", ["nuit", "argent"], ["cloud", "balloon"], ["une assiette froide", "un poisson en papier"]),
      emoji("star", "⭐", ["brille", "nuit"], ["rocket", "moon"], ["une épingle à cheveux", "un bonbon qui veille"]),
      emoji("rocket", "🚀", ["départ", "espace"], ["star", "planet"], ["une bouilloire rapide", "un crayon en feu"]),
      emoji("planet", "🪐", ["anneaux", "loin"], ["rocket", "telescope"], ["une toupie immense", "un chapeau tournant"]),
      emoji("telescope", "🔭", ["voir", "loin"], ["planet", "star"], ["un œil sur trépied", "un tunnel de confiture"]),
      emoji("lightning", "⚡", ["éclair", "rapide"], ["cloud", "rainbow"], ["une fermeture éclair du ciel", "un serpent lumineux"]),
    ],
  },
];

// IDs are globally unique, matching the persisted constellation_emojis primary key.
constellations.forEach((constellation) => {
  constellation.emojis.forEach((item) => { item.id = `${constellation.id}-${item.id}`; });
});

export function getConstellation(id) {
  return constellations.find((constellation) => constellation.id === id);
}
