const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, "");
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;
const SESSION_KEY = "nao-supabase-session";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

async function api(path, { method = "GET", body, token, headers = {} } = {}) {
  const response = await fetch(`${SUPABASE_URL}${path}`, { method, headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token || SUPABASE_KEY}`, "Content-Type": "application/json", ...headers }, body: body === undefined ? undefined : JSON.stringify(body) });
  if (!response.ok) throw new Error(`Supabase ${response.status}: ${await response.text()}`);
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

async function rest(table, { query, returning = false, ...options } = {}) {
  const auth = await session();
  const prefer = [options.headers?.Prefer, returning && "return=representation"].filter(Boolean).join(",");
  return api(`/rest/v1/${table}${query ? `?${query}` : ""}`, { ...options, token: auth.access_token, headers: { ...options.headers, ...(prefer ? { Prefer: prefer } : {}) } });
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
  return value;
}

export async function saveComposition(publicCode, input, card) {
  if (!isSupabaseConfigured) return null;
  const activation = await registerNutScan(publicCode);
  const cultures = await rest("dream_cultures", { query: `select=id&slug=eq.${encodeURIComponent(card.id)}&active=eq.true&status=eq.published&limit=1` });
  if (!cultures?.[0]) throw new Error(`La culture publiée « ${card.id} » est absente de Supabase.`);
  const rawText = (input.message || `${input.emojis.join(" ")} · ${input.tags.join(" · ")}`).trim();
  const dreamText = rawText.length >= 10 ? rawText : `${rawText} · Nao Dream`;
  const compositions = await rest("dream_compositions", { method: "POST", returning: true, body: { user_id: activation.userId, activation_scan_id: activation.scanId, title: card.title.slice(0, 150), dream_text: dreamText.slice(0, 3000), composition_mode: "rules", visibility: "private", locale: "fr" } });
  const composition = compositions[0];
  await rest("composition_cultures", { method: "POST", body: { composition_id: composition.id, culture_id: cultures[0].id, selection_order: 1 } });
  const values = [...input.emojis.map(value => ({ resonance_type: "emoji", value })), ...input.tags.map(value => ({ resonance_type: "tag", value }))];
  if (values.length) await rest("dream_resonances", { method: "POST", body: values.map(item => ({ ...item, composition_id: composition.id, user_id: activation.userId })) });
  return { compositionId: composition.id, scanId: activation.scanId };
}
