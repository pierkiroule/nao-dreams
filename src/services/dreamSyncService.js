import { dreamDraftStore } from "../stores/useDreamDraftStore";
import { getNaoAccess, isSupabaseConfigured, upsertDreamComposition } from "../lib/supabase";

let syncInProgress = false;
let lastSyncAt = null;
const listeners = new Set();

function notify(result){lastSyncAt=new Date().toISOString();listeners.forEach(listener=>listener({result,lastSyncAt}))}
export function subscribeDreamSync(listener){listeners.add(listener);return()=>listeners.delete(listener)}
export function getLastDreamSyncAt(){return lastSyncAt}

export async function saveLocalDream(values) {
  const dream=dreamDraftStore.addDream({...values,syncStatus:"local"});
  try {
    const { user,access }=await getNaoAccess();
    if(user&&access?.access_status==="active"){dreamDraftStore.markPending(dream.id);await syncPendingDreams()}
  } catch { /* Le rêve reste local jusqu’à la prochaine vérification. */ }
  return dream;
}

export async function syncPendingDreams() {
  if (syncInProgress) return { attempted:0,succeeded:0,failed:0,errors:[] };
  const pending=dreamDraftStore.getPendingDreams(),result={attempted:0,succeeded:0,failed:0,errors:[]};
  if (!pending.length) { notify(result); return result; }
  if (!isSupabaseConfigured||!navigator.onLine) return result;
  syncInProgress=true;
  try {
    const { user,access }=await getNaoAccess();
    if (!user||access?.access_status!=="active") return result;
    for (const dream of pending) {
      result.attempted++;
      try {
        if (!dream.fragmentIds&&(!Array.isArray(dream.cultureIds)||dream.cultureIds.length!==3)) throw new Error("Trois cultures sont requises.");
        await upsertDreamComposition(dream);
        dreamDraftStore.markSynced(dream.id);result.succeeded++;
      } catch(error) { const message=error?.message||"Synchronisation impossible.";dreamDraftStore.markSyncError(dream.id,message);result.failed++;result.errors.push({localId:dream.id,message}); }
    }
    notify(result);return result;
  } finally { syncInProgress=false; }
}

export function startDreamSyncListeners() {
  let timeout;
  const online=()=>{clearTimeout(timeout);timeout=setTimeout(()=>syncPendingDreams(),800)};
  addEventListener("online",online);
  if (dreamDraftStore.getPendingDreams().length) syncPendingDreams();
  return()=>{clearTimeout(timeout);removeEventListener("online",online)};
}
