import {
  createJourney,
  completeDreamJourney,
  completePassage,
} from "../domain/Journey";
import { JOURNEY_STATUS } from "../config/constants";
import {
  EVENTS,
  STEPS,
  initialAppState,
} from "./state";

export function journeyReducer(state, action) {
  switch (action.type) {
    case EVENTS.SCAN:
      return {
        step: STEPS.RECEIVE,
        journey: createJourney({
          naoId: action.payload?.naoId,
          seriesId: action.payload?.seriesId,
        }),
      };

    case EVENTS.EMBARK:
      return {
        ...state,
        step: STEPS.LAUNCH,
        journey: {
          ...state.journey,
          status: JOURNEY_STATUS.CHOOSING_RESOURCES,
        },
      };

    case EVENTS.START_CROSSING:
      return {
        step: STEPS.CROSSING,
        journey: completeDreamJourney(
          state.journey,
          action.payload.selections,
          action.payload.dream,
        ),
      };

    case EVENTS.FINISH_CROSSING:
      return {
        ...state,
        step: STEPS.REVEAL,
      };

    case EVENTS.OPEN_DREAM_DEPTH:
      return {
        ...state,
        step: STEPS.DREAM_DEPTH,
      };

    case EVENTS.CONTINUE_TO_PASS:
      return {
        ...state,
        step: STEPS.PASS,
        journey: {
          ...state.journey,
          status: JOURNEY_STATUS.READY_TO_PASS,
        },
      };

    case EVENTS.CONFIRM_PASS:
      return {
        step: STEPS.CONFIRMATION,
        journey: completePassage(state.journey),
      };

    case EVENTS.OPEN_OCEAN:
      return {
        ...state,
        step: STEPS.OCEAN,
      };

    case EVENTS.RESTART:
      return initialAppState;

    default:
      return state;
  }
}
