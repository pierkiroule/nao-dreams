import { DREAM_CONFIG } from "../config/dream";

const labels = {
  ocean: "un océan immobile",
  forest: "une forêt renversée",
  desert: "un désert de lumière",
  mountain: "une montagne endormie",

  whale: "une baleine",
  fox: "un renard",
  owl: "une chouette",
  butterfly: "un papillon",

  key: "une clé",
  feather: "une plume",
  lantern: "une lanterne",
  mirror: "un miroir",

  mist: "dans la brume",
  moonlight: "sous un clair de lune",
  "warm-rain": "sous une pluie chaude",
  silence: "dans un silence profond",
};

function wait(duration) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });
}

export async function generateDreamBubble(selections) {
  await wait(DREAM_CONFIG.localGenerationDelay);

  const [first, second, third] = selections.symbols ?? [];
  const landscape = labels[first] ?? "un paysage inconnu";
  const presence = labels[second] ?? "une présence";
  const object = labels[third] ?? "un objet oublié";
  const atmosphere = "dans la nuit";

  return [
    `${atmosphere}, ${presence} naviguait au-dessus de ${landscape}.`,
    `Elle transportait ${object}, sans savoir qui l'avait déposé là.`,
    "À l'horizon, une île apparaissait chaque fois qu'un rêveur fermait les yeux.",
  ].join(" ");
}
