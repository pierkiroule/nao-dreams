import type {DreamBubble,StoredDreamBubble} from "../types/dream.ts";
export const DREAM_SESSION_KEY="nao-active-dream-bubble-v2";
export const DREAM_HISTORY_KEY="nao-recent-dream-fragments-v2";
export function readDreamHistory(){try{return JSON.parse(localStorage.getItem(DREAM_HISTORY_KEY)||"[]").slice(-100) as string[]}catch{return[]}}
export function rememberDreamFragments(ids:string[]){const history=[...readDreamHistory(),...ids].slice(-100);localStorage.setItem(DREAM_HISTORY_KEY,JSON.stringify(history));return history}
export function saveDreamSession(value:StoredDreamBubble){localStorage.setItem(DREAM_SESSION_KEY,JSON.stringify(value));return value}
export function restoreDreamSession():StoredDreamBubble|null{try{const value=JSON.parse(localStorage.getItem(DREAM_SESSION_KEY)||"null");return value?.emojiIds?.length===3&&value?.seed?value:null}catch{return null}}
export function clearDreamSession(){localStorage.removeItem(DREAM_SESSION_KEY)}
export function makeStoredBubble(bubble:DreamBubble,sessionId:string):StoredDreamBubble{return{id:bubble.id,sessionId,emojiIds:bubble.emojiIds,seed:bubble.seed,fragmentIds:bubble.fragmentIds,patternId:bubble.patternId,createdAt:bubble.createdAt,revealedCount:0}}
