import { DREAM_CONFIG } from "../config/dream";
import { findGraphNode, findSensation } from "../data/resources";

function wait(duration) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });
}

export async function generateDreamBubble(selections) {
  await wait(DREAM_CONFIG.localGenerationDelay);

  const selected = Object.fromEntries((selections.path ?? []).map((entry) => [entry.level, entry.id]));
  const landscape = findGraphNode(selected.landscape)?.label ?? "un paysage inconnu";
  const presence = findGraphNode(selected.presence)?.label ?? "une présence";
  const object = findGraphNode(selected.object)?.label ?? "un objet oublié";
  const atmosphere = (selections.path ?? []).filter((entry) => entry.level === "atmosphere").map((entry) => findGraphNode(entry.id)?.label).filter(Boolean).join(", ") || "dans la nuit";
  const sensation = findSensation(selections.sensation)?.label ?? "Mystère";

  return [
    `Dans ${atmosphere}, ${presence} naviguait au-dessus de ${landscape}.`,
    `Elle transportait ${object}, sans savoir qui l'avait déposé là.`,
    `À l'horizon, une île apparaissait avec une sensation de ${sensation.toLowerCase()}.`,
  ].join(" ");
}
