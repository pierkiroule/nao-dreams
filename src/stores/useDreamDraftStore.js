import { useSyncExternalStore } from "react";
import { DREAM_DRAFTS_KEY } from "../lib/localData";

let dreams = [];
const listeners = new Set();

function load() {
  try { dreams = JSON.parse(localStorage.getItem(DREAM_DRAFTS_KEY) || "[]"); }
  catch { dreams = []; }
}
function persist() { localStorage.setItem(DREAM_DRAFTS_KEY, JSON.stringify(dreams)); listeners.forEach(listener => listener()); }
function replace(id, values) { dreams=dreams.map(dream=>dream.id===id?{...dream,...values,updatedAt:new Date().toISOString()}:dream);persist(); }

if (globalThis.localStorage) load();
globalThis.addEventListener?.("nao:dream-drafts-reset",()=>{dreams=[];listeners.forEach(listener=>listener())});

export const dreamDraftStore = {
  subscribe(listener){listeners.add(listener);return()=>listeners.delete(listener)},
  getSnapshot(){return dreams},
  addDream(values){const now=new Date().toISOString(),dream={...values,id:values.id||crypto.randomUUID(),createdAt:values.createdAt||now,updatedAt:now,syncStatus:values.syncStatus||"local"};dreams=[...dreams,dream];persist();return dream},
  updateDream(id,values){replace(id,values)},
  removeDream(id){dreams=dreams.filter(dream=>dream.id!==id);persist()},
  markPending(id){replace(id,{syncStatus:"pending",syncError:undefined})},
  markSynced(id){replace(id,{syncStatus:"synced",syncError:undefined})},
  markSyncError(id,message){replace(id,{syncStatus:"error",syncError:message})},
  clearLocalDreams(){dreams=[];persist()},
  getPendingDreams(){return dreams.filter(dream=>["local","pending","error"].includes(dream.syncStatus))},
};

export function useDreamDraftStore(){return useSyncExternalStore(dreamDraftStore.subscribe,dreamDraftStore.getSnapshot,dreamDraftStore.getSnapshot)}
