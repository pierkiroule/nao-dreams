export async function prepareNextPass() { localStorage.removeItem("nao-soucy-active-fingerprint"); return { readyAt: new Date().toISOString() }; }
