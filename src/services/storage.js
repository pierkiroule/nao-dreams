const STORAGE_KEY = "nao-dreams-journey";

export function saveJourney(journey) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(journey));
}

export function loadJourney() {
  const rawValue = localStorage.getItem(STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function clearJourney() {
  localStorage.removeItem(STORAGE_KEY);
}
