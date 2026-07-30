const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, "");
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;
const SESSION_KEY = "nao-supabase-session";
const STATUS_EVENT = "nao:supabase-status";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);
let currentStatus = { state: isSupabaseConfigured ? "idle" : "disabled", message: isSupabaseConfigured ? "Connexion à vérifier" : "Mode local", checkedAt: null };

function setStatus(state, message) {
  currentStatus = { state, message, checkedAt: new Date().toISOString() };
  globalThis.dispatchEvent?.(new CustomEvent(STATUS_EVENT, { detail: currentStatus }));
  return currentStatus;
}

export function getSupabaseStatus() { return currentStatus; }
export function subscribeSupabaseStatus(listener) {
  const handler = event => listener(event.detail);
  globalThis.addEventListener?.(STATUS_EVENT, handler);
  return () => globalThis.removeEventListener?.(STATUS_EVENT, handler);
}

async function api(path, { method = "GET", body, token, headers = {} } = {}) {
  const response = await fetch(`${SUPABASE_URL}${path}`, { method, headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token || SUPABASE_KEY}`, "Content-Type": "application/json", ...headers }, body: body === undefined ? undefined : JSON.stringify(body) });
  if (!response.ok) {
    const error = new Error(`Supabase ${response.status}: ${await response.text()}`);
    setStatus("error", error.message);
    throw error;
  }
  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function readSession() { try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; } }

async function session() {
  const saved = readSession();
  if (saved?.access_token && saved?.expires_at * 1000 > Date.now() + 60_000) return saved;
  if (saved?.refresh_token) {
    try {
      const refreshed = await api("/auth/v1/token?grant_type=refresh_token", { method: "POST", body: { refresh_token: saved.refresh_token } });
      localStorage.setItem(SESSION_KEY, JSON.stringify(refreshed));
      return refreshed;
    } catch { localStorage.removeItem(SESSION_KEY); }
  }
  const created = await api("/auth/v1/signup", { method: "POST", body: {} });
  if (!created?.access_token || !created?.user?.id) throw new Error("L’authentification anonyme Supabase doit être activée.");
  localStorage.setItem(SESSION_KEY, JSON.stringify(created));
  return created;
}

export async function getAuthenticatedUser() {
  if (!isSupabaseConfigured) return null;
  const auth = await session();
  return auth?.user || null;
}

async function rest(table, { query, returning = false, ...options } = {}) {
  const auth = await session();
  const prefer = [options.headers?.Prefer, returning && "return=representation"].filter(Boolean).join(",");
  return api(`/rest/v1/${table}${query ? `?${query}` : ""}`, { ...options, token: auth.access_token, headers: { ...options.headers, ...(prefer ? { Prefer: prefer } : {}) } });
}

export async function getNaoAccess() {
  const user = await getAuthenticatedUser();
  if (!user) return { user: null, access: null };
  const rows = await rest("user_access", { query: `select=access_status,access_level,activated_at&user_id=eq.${encodeURIComponent(user.id)}&limit=1` });
  return { user, access: rows?.[0] || null };
}

export async function upsertDreamComposition(dream) {
  const { user, access } = await getNaoAccess();
  if (!user) throw new Error("Aucun utilisateur Supabase authentifié.");
  if (access?.access_status !== "active") throw new Error("L’accès NAO n’est pas activé.");
  const cultureSlugs=Array.isArray(dream.cultureIds)?dream.cultureIds:[];
  const cultures=cultureSlugs.length?await rest("dream_cultures",{query:`select=id,slug&slug=in.(${cultureSlugs.map(encodeURIComponent).join(",")})&active=eq.true&status=eq.published`}):[];
  const cultureIds=cultureSlugs.map(slug=>cultures?.find(culture=>culture.slug===slug)?.id);
  if(cultureIds.some(id=>!id))throw new Error("Une ou plusieurs cultures ne sont pas disponibles.");
  const existing = await rest("dream_compositions", { query: `select=id&user_id=eq.${encodeURIComponent(user.id)}&client_id=eq.${encodeURIComponent(dream.id)}&limit=1` });
  let compositionId = existing?.[0]?.id;
  if (!compositionId) {
    try {
      const rows = await rest("dream_compositions", { method: "POST", returning: true, body: { user_id:user.id,client_id:dream.id,title:dream.title.slice(0,150),dream_text:dream.dreamText.slice(0,3000),composition_mode:"rules",visibility:"private",locale:"fr" } });
      compositionId = rows?.[0]?.id;
    } catch (error) {
      const concurrent = await rest("dream_compositions", { query: `select=id&user_id=eq.${encodeURIComponent(user.id)}&client_id=eq.${encodeURIComponent(dream.id)}&limit=1` });
      if (!concurrent?.[0]) throw error;
      compositionId = concurrent[0].id;
    }
  }
  if (!compositionId) throw new Error("La composition n’a pas pu être enregistrée.");
  if (!cultureIds.length) return compositionId;
  await rest("composition_cultures", { method:"DELETE", query:`composition_id=eq.${encodeURIComponent(compositionId)}` });
  await rest("composition_cultures", { method:"POST", body:cultureIds.map((cultureId,index)=>({composition_id:compositionId,culture_id:cultureId,selection_order:index+1})) });
  return compositionId;
}

export async function testSupabaseConnection() {
  if (!isSupabaseConfigured) return setStatus("disabled", "Variables Supabase absentes");
  setStatus("connecting", "Test de la connexion…");
  try {
    await session();
    await rest("dream_cultures", { query: "select=id&limit=1" });
    return setStatus("connected", "Supabase connecté");
  } catch (error) {
    setStatus("error", error.message);
    throw error;
  }
}

export async function registerNutScan(publicCode) {
  if (!isSupabaseConfigured) return null;
  const cacheKey = `nao-scan-${publicCode}`, cached = localStorage.getItem(cacheKey);
  if (cached) return JSON.parse(cached);
  const auth = await session(), locale = navigator.language?.split("-")[0] || "fr";
  await rest("profiles", { method: "POST", body: { id: auth.user.id, locale }, query: "on_conflict=id", headers: { Prefer: "resolution=merge-duplicates" } });
  const nuts = await rest("nao_nuts", { query: `select=id&public_code=eq.${encodeURIComponent(publicCode)}&status=eq.active&limit=1` });
  if (!nuts?.[0]) throw new Error(`La noix ${publicCode} est absente ou inactive.`);
  const scans = await rest("nut_scans", { method: "POST", returning: true, body: { nut_id: nuts[0].id, user_id: auth.user.id, locale, activated_application: true } });
  const value = { userId: auth.user.id, nutId: nuts[0].id, scanId: scans[0].id };
  await rest("user_access", { method: "POST", query: "on_conflict=user_id", headers: { Prefer: "resolution=ignore-duplicates" }, body: { user_id: value.userId, activation_nut_id: value.nutId, activation_scan_id: value.scanId, access_status: "active", access_level: "free" } });
  localStorage.setItem(cacheKey, JSON.stringify(value));
  setStatus("synced", "Scan synchronisé");
  return value;
}
