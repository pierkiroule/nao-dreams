import { createJourney, completeDreamJourney } from "../domain/Journey";
import { EVENTS, STEPS, initialAppState } from "./state";

export function journeyReducer(state, action) {
  switch (action.type) {
    case EVENTS.CREATE_PROFILE: return { ...state, profile: action.payload.profile };
    case EVENTS.OPEN_ACCOUNT: return { ...state, step: STEPS.ACCOUNT };
    case EVENTS.CLOSE_ACCOUNT: return { ...state, step: STEPS.HOME };
    case EVENTS.START_DREAM: return { ...state, step: STEPS.CHOOSE, journey: createJourney(action.payload) };
    case EVENTS.REVEAL_DREAM: return { ...state, step: STEPS.REVEAL, journey: completeDreamJourney(state.journey, action.payload) };
    case EVENTS.RESTART: return { ...initialAppState, profile: state.profile };
    default: return state;
  }
}
