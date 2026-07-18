import { STEPS } from "./state";

export const JOURNEY_STEPS = [
  STEPS.HOME,
  STEPS.RECEIVE,
  STEPS.LAUNCH,
  STEPS.CROSSING,
  STEPS.REVEAL,
  STEPS.DREAM_DEPTH,
  STEPS.PASS,
  STEPS.CONFIRMATION,
  STEPS.OCEAN,
];

export function getJourneyProgress(step) {
  const index = JOURNEY_STEPS.indexOf(step);
  const safeIndex = index >= 0 ? index : 0;
  const current = safeIndex + 1;
  const total = JOURNEY_STEPS.length;

  return {
    current,
    total,
    percentage: Math.round((current / total) * 100),
  };
}
