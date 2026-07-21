const KEY = "nao-soucy-credits";
export const packs = [{ id: "five", credits: 5, price: "2,99 €" }, { id: "fifteen", credits: 15, price: "6,99 €" }, { id: "fifty", credits: 50, price: "19,99 €" }];
export function getCreditBalance() { return Number(localStorage.getItem(KEY) ?? 1); }
export function purchaseCreditPack(packId) { const pack = packs.find((item) => item.id === packId); if (!pack) throw new Error("Pack inconnu"); const balance = getCreditBalance() + pack.credits; localStorage.setItem(KEY, String(balance)); return balance; }
export function consumeCredit() { const balance = getCreditBalance(); if (!balance) return false; localStorage.setItem(KEY, String(balance - 1)); return true; }
