import { STORAGE_KEYS } from "../config/constants";

const APP_VERSION = 2;

export function saveAppState(state) {
  try {
    localStorage.setItem(
      STORAGE_KEYS.APP_STATE,
      JSON.stringify({
        version: APP_VERSION,
        state,
      }),
    );
  } catch (error) {
    console.warn(
      "Impossible de sauvegarder le parcours.",
      error,
    );
  }
}

export function loadAppState(fallbackState) {
  try {
    const rawValue = localStorage.getItem(
      STORAGE_KEYS.APP_STATE,
    );

    if (!rawValue) {
      return fallbackState;
    }

    const savedValue = JSON.parse(rawValue);

    if (
      savedValue.version !== APP_VERSION ||
      !savedValue.state?.step ||
      !savedValue.state?.journey
    ) {
      clearAppState();
      return fallbackState;
    }

    return savedValue.state;
  } catch (error) {
    console.warn("Parcours local invalide.", error);
    clearAppState();
    return fallbackState;
  }
}

export function clearAppState() {
  localStorage.removeItem(STORAGE_KEYS.APP_STATE);
}
