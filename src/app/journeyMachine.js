import { createJourney, completeDreamJourney } from "../domain/Journey";
import { EVENTS, STEPS, initialAppState } from "./state";

export function journeyReducer(state, action) {
  switch (action.type) {
    case EVENTS.CREATE_PROFILE: return { ...state, profile: action.payload.profile };
    case EVENTS.OPEN_ACCOUNT: return { ...state, step: STEPS.ACCOUNT };
    case EVENTS.CLOSE_ACCOUNT: return { ...state, step: STEPS.HOME };
    case EVENTS.START_DREAM: return { ...state, step: STEPS.CHOOSE, journey: createJourney(action.payload) };
    case EVENTS.SAVE_CONSTELLATION: return { ...state, step: STEPS.TITLES, journey: { ...state.journey, selectedEmojis: action.payload.emojis, constellation: { ...state.journey.constellation, emojis: action.payload.emojis }, dreamTitles: action.payload.titles } };
    case EVENTS.SAVE_TITLE: return { ...state, step: STEPS.SEEDS, journey: { ...state.journey, chosenTitle: action.payload.title, personalResonance: action.payload.resonance } };
    case EVENTS.SAVE_SEEDS: return { ...state, step: STEPS.GENERATING, journey: { ...state.journey, seedCount: action.payload.seedCount } };
    case EVENTS.REVEAL_DREAM: return { ...state, step: STEPS.REVEAL, journey: completeDreamJourney(state.journey, action.payload) };
    case EVENTS.RESTART: return { ...initialAppState, profile: state.profile };
    default: return state;
  }
}
