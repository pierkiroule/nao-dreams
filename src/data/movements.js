export const movements = [
  ["apaisement", "🕊️", "Apaisement"], ["direction", "🧭", "Direction"], ["courage", "🔥", "Courage"], ["nouveau_depart", "🌱", "Nouveau départ"],
  ["soutien", "🤝", "Soutien"], ["idee", "💡", "Idée"], ["lien", "🔗", "Lien"], ["lacher_prise", "🌊", "Lâcher-prise"],
].map(([id, icon, label]) => ({ id, icon, label }));
export const movementLabel = (id) => movements.find((item) => item.id === id)?.label ?? id;
