import { DEMO_JOURNEY_ID, DREAM_REVEAL_THRESHOLD } from "./dreamRepository";
import { initialScene } from "../utils/dreamScene";
const KEY = "noa-dreams-local-journey-v3";
const now = () => new Date().toISOString();
function seed() { const symbols=["🌙","🌀","🪶","🚪","🌊","🦋","🕯️"]; return { journey:{ id:DEMO_JOURNEY_ID,status:"active",createdAt:now(),revealThreshold:DREAM_REVEAL_THRESHOLD,contributionCount:symbols.length,currentScene:initialScene(),nextConstellationId:"presences" }, contributions:symbols.map((emoji,position)=>({id:`demo-${position}`,journeyId:DEMO_JOURNEY_ID,constellationId:"demo",emoji,label:"Fragment du voyage",position,createdAt:now()})) }; }
function read() { try { return JSON.parse(localStorage.getItem(KEY)) || seed(); } catch { return seed(); } }
function write(value) { localStorage.setItem(KEY,JSON.stringify(value)); return value; }
export const LocalDreamRepository = {
 async getJourney(){ return read().journey; }, async getContributions(){ return read().contributions; },
 async addContribution(contribution, scene){ const data=read(); data.contributions.push(contribution); data.journey.contributionCount+=1; data.journey.currentScene=scene; if(data.journey.contributionCount>=data.journey.revealThreshold)data.journey.status="ready"; write(data); return data.journey; },
 async enrichContribution(id, echo, nextConstellationId){ const data=read(); const contribution=data.contributions.find((item)=>item.id===id); if(contribution){ contribution.echo=echo; contribution.nextConstellationId=nextConstellationId; } data.journey.nextConstellationId=nextConstellationId; write(data); return data.journey; },
 async reset(){ write(seed()); return read().journey; },
};
