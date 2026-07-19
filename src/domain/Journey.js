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
    selections: {},
    dream: "",
    status: JOURNEY_STATUS.RECEIVED,
    receivedAt: new Date().toISOString(),
    createdAt: null,
    passedAt: null,
  };
}

export function completeDreamJourney(
  journey,
  selections,
  dream,
) {
  return {
    ...journey,
    selections,
    dream,
    status: JOURNEY_STATUS.DREAM_REVEALED,
    createdAt: new Date().toISOString(),
  };
}

export function completePassage(journey) {
  return {
    ...journey,
    status: JOURNEY_STATUS.PASSED,
    passedAt: new Date().toISOString(),
  };
}
