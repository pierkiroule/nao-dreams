import { APP_CONFIG } from "../config/app";
import { JOURNEY_STATUS } from "../config/constants";

export function createJourney({ naoId = APP_CONFIG.defaultNaoId, seriesId = APP_CONFIG.defaultSeriesId } = {}) {
  return { id: crypto.randomUUID(), naoId, seriesId, constellation: { id: "poetic-network", name: "Réseau poétique" }, selectedEmoji: null, selectedEmojis: [], dreamTitles: [], chosenTitle: "", personalResonance: "", seedCount: 0, creditsBefore: 12, creditCost: 3, creditsRemaining: 12, dream: "", status: JOURNEY_STATUS.CHOOSING, receivedAt: new Date().toISOString(), createdAt: null, passedAt: null };
}

export function completeDreamJourney(journey, { dream, generationSeed, templateKey }) {
  return { ...journey, selectedEmoji: journey.selectedEmojis[0] ?? null, dream: dream.text, generationSeed, templateKey, creditsRemaining: journey.creditsBefore - journey.creditCost, status: JOURNEY_STATUS.DREAM_REVEALED, createdAt: new Date().toISOString() };
}
