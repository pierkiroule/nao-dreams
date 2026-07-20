import { DEMO_JOURNEY_ID, DREAM_REVEAL_THRESHOLD } from "./dreamRepository";
const KEY = "noa-dreams-local-journey-v2";
const now = () => new Date().toISOString();
function seed() { const symbols = ["🌙", "🌀", "🪶", "🚪", "🌊", "🦋", "🕯️"]; return { journey: { id: DEMO_JOURNEY_ID, status: "active", createdAt: now(), revealThreshold: DREAM_REVEAL_THRESHOLD, contributionCount: symbols.length }, contributions: symbols.map((emoji, position) => ({ id: `demo-${position}`, journeyId: DEMO_JOURNEY_ID, constellationId: "demo", emoji, label: "Fragment du voyage", position, createdAt: now() })) }; }
function read() { try { return JSON.parse(localStorage.getItem(KEY)) || seed(); } catch { return seed(); } }
function write(value) { localStorage.setItem(KEY, JSON.stringify(value)); return value; }
export const LocalDreamRepository = {
  async getJourney() { return read().journey; },
  async getContributions() { return read().contributions; },
  async addContribution(contribution) { const data = read(); data.contributions.push(contribution); data.journey.contributionCount += 1; if (data.journey.contributionCount >= data.journey.revealThreshold) data.journey.status = "ready"; write(data); },
  async reset() { write(seed()); return read().journey; },
};
