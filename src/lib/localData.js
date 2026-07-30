export const LOCAL_DATA_VERSION = 3;
export const STORAGE_VERSION_KEY = "nao-dream-storage-version";
export const DREAM_DRAFTS_KEY = "nao-dream-drafts-v3";

export const LEGACY_STORAGE_KEYS = [
  "nao-discoveries", "nao-dream-discoveries", "nao-pending-sync", "nao-sync-queue",
  "nao-dream-drafts-v2", "nao-active-dream-bubble", "nao-journeys", "nao-bubbles", "dream-bubbles", "journey-store", "discovery-store",
];

export const LEGACY_DATABASE_NAMES = ["nao-dream", "nao-discoveries", "nao-dream-cache", "nao-offline"];

const development = import.meta.env?.DEV;
const storage = () => globalThis.localStorage;

export async function removeLegacyNaoDatabases() {
  if (!globalThis.indexedDB) return;
  await Promise.all(LEGACY_DATABASE_NAMES.map(name => new Promise(resolve => {
    const request = indexedDB.deleteDatabase(name);
    request.onsuccess = request.onerror = request.onblocked = () => resolve();
  })));
}

export async function migrateLocalStorage() {
  const target = storage();
  if (!target || Number(target.getItem(STORAGE_VERSION_KEY) || 0) >= LOCAL_DATA_VERSION) return;
  LEGACY_STORAGE_KEYS.forEach(key => target.removeItem(key));
  await removeLegacyNaoDatabases();
  target.setItem(STORAGE_VERSION_KEY, String(LOCAL_DATA_VERSION));
  if (development) console.info(`[NAO] Stockage local migré vers la version ${LOCAL_DATA_VERSION}.`);
}

export async function resetNaoTestData() {
  const target = storage();
  target?.removeItem(DREAM_DRAFTS_KEY);
  LEGACY_STORAGE_KEYS.forEach(key => target?.removeItem(key));
  await removeLegacyNaoDatabases();
  target?.setItem(STORAGE_VERSION_KEY, String(LOCAL_DATA_VERSION));
  globalThis.dispatchEvent?.(new CustomEvent("nao:dream-drafts-reset"));
}
