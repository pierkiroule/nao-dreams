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
    case EVENTS.CREATE_PROFILE:
      return {
        ...state,
        profile: action.payload.profile,
      };

    case EVENTS.OPEN_ACCOUNT:
      return {
        ...state,
        step: STEPS.ACCOUNT,
      };

    case EVENTS.CLOSE_ACCOUNT:
      return {
        ...state,
        step: STEPS.HOME,
      };

    case EVENTS.SCAN:
      return {
        ...state,
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
        ...state,
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
        ...state,
        step: STEPS.CONFIRMATION,
        journey: completePassage(state.journey),
      };

    case EVENTS.OPEN_OCEAN:
      return {
        ...state,
        step: STEPS.OCEAN,
      };

    case EVENTS.RESTART:
      return {
        ...initialAppState,
        profile: state.profile,
      };

    default:
      return state;
  }
}
