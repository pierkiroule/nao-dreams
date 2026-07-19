export const dreamPassers = [
  "Aube", "Basile", "Céleste", "Dune", "Églantine", "Félix",
  "Givre", "Hana", "Iris", "Jules", "Kumo", "Lila",
].map((name, index) => ({
  id: name.toLowerCase(),
  name,
  position: index + 1,
}));

export function getNextPasser(position) {
  return dreamPassers[position % dreamPassers.length];
}
