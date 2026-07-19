import { APP_CONFIG } from "../config/app";
import { JOURNEY_STATUS } from "../config/constants";

export const STEPS = { HOME: "home", CHOOSE: "choose", SCENES: "scenes", REVEAL: "reveal", PASS: "pass", ACCOUNT: "account" };
export const EVENTS = { CREATE_PROFILE: "create_profile", OPEN_ACCOUNT: "open_account", CLOSE_ACCOUNT: "close_account", START_DREAM: "start_dream", SHOW_SCENES: "show_scenes", REVEAL_DREAM: "reveal_dream", OPEN_PASS: "open_pass", PASS_DREAM: "pass_dream", RESTART: "restart" };

export const initialJourney = {
  id: null, naoId: APP_CONFIG.defaultNaoId, seriesId: APP_CONFIG.defaultSeriesId,
  selections: {}, scenes: [], networkId: null, dream: "", passedTo: null, status: JOURNEY_STATUS.IDLE,
  receivedAt: null, createdAt: null, passedAt: null,
};

export const initialAppState = { step: STEPS.HOME, profile: null, journey: initialJourney };
