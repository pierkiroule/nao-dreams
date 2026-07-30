export function hashSeed(seed:string){let h=2166136261;for(const char of seed){h^=char.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
export function seededRandom(seed:string){let state=hashSeed(seed)||1;return()=>{state+=0x6D2B79F5;let t=state;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
export function seededId(seed:string){return `bubble-${hashSeed(seed).toString(36)}`}
