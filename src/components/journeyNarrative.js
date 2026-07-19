export const SELECTION_PROMPTS = [
  "Choisis un emoji qui résonne le plus pour toi.",
  "Choisis maintenant le second emoji qui résonne pour toi.",
  "Puis laisse apparaître le troisième.",
];

export const SCREEN_RESONANCE = ["Premier choix sur trois", "Deuxième choix sur trois", "Troisième choix sur trois"];
export const MAX_REFLECTION_LENGTH = 1000;

export function nextNarrativePhase(pathLength) {
  return pathLength === 3 ? "revealing_trio" : ["selecting_first", "selecting_second", "selecting_third"][pathLength];
}
