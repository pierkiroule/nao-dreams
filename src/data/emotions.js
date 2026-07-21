export const emotions = [
  ["inquietude", "😟", "Inquiétude"], ["peur", "😨", "Peur"], ["tristesse", "😔", "Tristesse"], ["colere", "😡", "Colère"], ["vide", "😶", "Vide"],
  ["debordement", "😵", "Débordement"], ["solitude", "🥺", "Solitude"], ["decouragement", "😞", "Découragement"], ["frustration", "😤", "Frustration"], ["espoir_fragile", "🌱", "Espoir fragile"],
].map(([id, icon, label]) => ({ id, icon, label }));
export const emotionLabel = (id) => emotions.find((item) => item.id === id)?.label ?? id;
