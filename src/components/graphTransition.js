export const TRANSITION_STATES = {
  IDLE: "idle",
  FOCUSING: "focusing",
  ENTERING: "entering",
  REVEALING: "revealing",
  COMPLETED: "completed",
};

export const TRANSITION_DURATIONS = { focusing: 300, entering: 650, revealing: 650 };

export function nextTransitionState(state) {
  if (state === TRANSITION_STATES.FOCUSING) return TRANSITION_STATES.ENTERING;
  if (state === TRANSITION_STATES.ENTERING) return TRANSITION_STATES.REVEALING;
  if (state === TRANSITION_STATES.REVEALING) return TRANSITION_STATES.IDLE;
  return state;
}
