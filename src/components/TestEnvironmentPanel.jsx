import { useEffect, useState } from "react";
import { resetNaoTestData } from "../lib/localData";
import { getNaoAccess, getSupabaseStatus, subscribeSupabaseStatus, testSupabaseConnection } from "../lib/supabase";
import { getLastDreamSyncAt, startDreamSyncListeners, subscribeDreamSync, syncPendingDreams } from "../services/dreamSyncService";
import { useDreamDraftStore } from "../stores/useDreamDraftStore";

const testToolsEnabled=import.meta.env.DEV||import.meta.env.VITE_ENABLE_TEST_TOOLS==="true";
const relativeDate=value=>!value?"Jamais":Date.now()-new Date(value).getTime()<60_000?"À l’instant":new Date(value).toLocaleString("fr-FR",{dateStyle:"short",timeStyle:"short"});

export default function TestEnvironmentPanel(){
  const dreams=useDreamDraftStore(),[connection,setConnection]=useState(getSupabaseStatus),[access,setAccess]=useState("checking"),[lastSync,setLastSync]=useState(getLastDreamSyncAt),[error,setError]=useState("");
  const pending=dreams.filter(dream=>["local","pending","error"].includes(dream.syncStatus)).length,hasSyncError=dreams.some(dream=>dream.syncStatus==="error"),busy=connection.state==="connecting"||connection.state==="syncing";
  const refresh=async()=>{setError("");setAccess("checking");try{await testSupabaseConnection();const result=await getNaoAccess();setAccess(result.access?.access_status==="active"?"active":"inactive");await syncPendingDreams();setLastSync(getLastDreamSyncAt())}catch(reason){setAccess("error");setError(reason?.message||"Vérification impossible.")}};
  useEffect(()=>{const stopStatus=subscribeSupabaseStatus(setConnection),stopSync=subscribeDreamSync(({lastSyncAt})=>setLastSync(lastSyncAt)),stopNetwork=startDreamSyncListeners();refresh();return()=>{stopStatus();stopSync();stopNetwork()}},[]);
  const connected=connection.state==="connected"||connection.state==="synced",connectionLabel=busy?"Vérification…":connected?"Connecté":connection.state==="disabled"||!navigator.onLine?"Hors connexion":"Erreur";
  const syncLabel=busy?"Synchronisation…":hasSyncError?"Erreur de synchronisation":pending?`${pending} rêve${pending>1?"s":""} en attente`:"À jour";
  const reset=async()=>{if(!confirm("Les rêves locaux non synchronisés seront supprimés. La session Supabase sera conservée. Continuer ?"))return;await resetNaoTestData();setError("");setLastSync(null);await refresh()};
  return <section className="test-panel" aria-labelledby="test-panel-title"><div className="test-heading"><p id="test-panel-title">ENVIRONNEMENT DE TEST</p><button onClick={refresh} disabled={busy}>{busy?"Test…":"Retester"}</button></div><dl><div><dt><i className={`status-dot ${connected?"connected":connection.state}`}/>Supabase</dt><dd>{connectionLabel}</dd></div><div><dt><i className={`status-dot ${access}`}/>Accès NAO</dt><dd>{access==="checking"?"Vérification…":access==="active"?"Activé":access==="inactive"?"Non activé":"Erreur"}</dd></div><div><dt><i className={`status-dot ${hasSyncError?"error":pending?"pending":"synced"}`}/>Synchronisation</dt><dd>{syncLabel}</dd></div><div><dt><i className="status-dot local"/>Rêves locaux</dt><dd>{dreams.length}</dd></div><div><dt>Dernière synchronisation</dt><dd>{relativeDate(lastSync)}</dd></div></dl>{error&&<p className="test-error" role="alert">{error}</p>}{testToolsEnabled&&<button className="test-reset" onClick={reset}>Réinitialiser les données de test</button>}</section>;
}
