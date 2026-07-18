export function trackEvent(eventName, properties = {}) {
  if (import.meta.env.DEV) {
    console.debug("[NAO analytics]", eventName, properties);
  }
}
