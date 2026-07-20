import { APP_CONFIG } from "../config/app";
import { JOURNEY_STATUS } from "../config/constants";

export function createJourney({
  naoId = APP_CONFIG.defaultNaoId,
  seriesId = APP_CONFIG.defaultSeriesId,
} = {}) {
  return {
    id: crypto.randomUUID(),
    naoId,
    seriesId,
    constellation: null,
    selectedEmoji: null,
    dream: "",
    status: JOURNEY_STATUS.CHOOSING,
    receivedAt: new Date().toISOString(),
    createdAt: null,
    passedAt: null,
  };
}

export function completeDreamJourney(
  journey,
  { constellation, selectedEmoji, dream, generationSeed, templateKey },
) {
  return {
    ...journey,
    constellation,
    selectedEmoji,
    dream: dream.text,
    generationSeed,
    templateKey,
    status: JOURNEY_STATUS.DREAM_REVEALED,
    createdAt: new Date().toISOString(),
  };
}
