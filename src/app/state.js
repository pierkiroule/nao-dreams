import { APP_CONFIG } from "../config/app";
import { JOURNEY_STATUS } from "../config/constants";

export const STEPS = {
  HOME: "home",
  RECEIVE: "receive",
  LAUNCH: "launch",
  CROSSING: "crossing",
  REVEAL: "reveal",
  DREAM_DEPTH: "dream_depth",
  PASS: "pass",
  CONFIRMATION: "confirmation",
  OCEAN: "ocean",
};

export const EVENTS = {
  SCAN: "scan",
  EMBARK: "embark",
  START_CROSSING: "start_crossing",
  FINISH_CROSSING: "finish_crossing",
  OPEN_DREAM_DEPTH: "open_dream_depth",
  CONTINUE_TO_PASS: "continue_to_pass",
  CONFIRM_PASS: "confirm_pass",
  OPEN_OCEAN: "open_ocean",
  RESTART: "restart",
};

export const initialJourney = {
  id: null,
  naoId: APP_CONFIG.defaultNaoId,
  seriesId: APP_CONFIG.defaultSeriesId,
  selections: {},
  dream: "",
  status: JOURNEY_STATUS.IDLE,
  receivedAt: null,
  createdAt: null,
  passedAt: null,
};

export const initialAppState = {
  step: STEPS.HOME,
  journey: initialJourney,
};
