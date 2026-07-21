import { DEMO_JOURNEY_ID, DREAM_REVEAL_THRESHOLD } from "./dreamRepository.js";
const KEY = "noa-dreams-local-journey-v4";
const now = () => new Date().toISOString();

export function createSeededJourney({ seedEmoji, seedLabel, openingScene, constellationId = "passages", revealThreshold = DREAM_REVEAL_THRESHOLD }) {
  const createdAt = now();
  const journey = { id: DEMO_JOURNEY_ID, status: "active", createdAt, revealThreshold, contributionCount: 1, currentScene: openingScene };
  const seed = { id: "seed-001", journeyId: journey.id, emoji: seedEmoji, label: seedLabel, openingScene, constellationId, position: 0, createdAt, isSeed: true };
  return { journey, seed, contributions: [seed] };
}
function seed() { return createSeededJourney({ seedEmoji: "🚪", seedLabel: "Ce qui s'ouvre", openingScene: "Une porte flotte au milieu d'une mer immobile.", constellationId: "passages" }); }
function read() { try { return JSON.parse(localStorage.getItem(KEY)) || seed(); } catch { return seed(); } }
function write(value) { localStorage.setItem(KEY, JSON.stringify(value)); return value; }
export const LocalDreamRepository = {
  async getJourney() { return read().journey; },
  async getContributions() { return read().contributions; },
  async addContribution(contribution, scene) { const data = read(); data.contributions.push(contribution); data.journey.contributionCount += 1; data.journey.currentScene = scene; if (data.journey.contributionCount >= data.journey.revealThreshold) data.journey.status = "ready"; write(data); return data.journey; },
  async saveEcho(id, echo) { const data = read(); const contribution = data.contributions.find((item) => item.id === id); if (contribution) contribution.echo = echo; write(data); return data.journey; },
  async resetDemoJourneyWithSeed() { const data = seed(); write(data); return data.journey; },
};
export async function resetDemoJourneyWithSeed() { return LocalDreamRepository.resetDemoJourneyWithSeed(); }
