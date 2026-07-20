import { APP_CONFIG } from "../config/app";
import { JOURNEY_STATUS } from "../config/constants";

export const STEPS = { HOME: "home", CHOOSE: "choose", REVEAL: "reveal", ACCOUNT: "account" };
export const EVENTS = { CREATE_PROFILE: "create_profile", OPEN_ACCOUNT: "open_account", CLOSE_ACCOUNT: "close_account", START_DREAM: "start_dream", REVEAL_DREAM: "reveal_dream", RESTART: "restart" };

export const initialJourney = {
  id: null, naoId: APP_CONFIG.defaultNaoId, seriesId: APP_CONFIG.defaultSeriesId,
  constellation: null, selectedEmoji: null, dream: "", generationSeed: null, templateKey: null, status: JOURNEY_STATUS.IDLE,
  receivedAt: null, createdAt: null, passedAt: null,
};

export const initialAppState = { step: STEPS.HOME, profile: null, journey: initialJourney };
