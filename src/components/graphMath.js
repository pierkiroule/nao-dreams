export const GRAPH_NODE_COUNT = 6;

export function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

export function getVisualScale(resonanceScore) {
  if (!Number.isFinite(resonanceScore)) return 1;
  return clamp(0.92 + clamp(resonanceScore, 0, 1) * 0.18, 0.92, 1.1);
}

export function getLinkVisualStrength(count, maximum = count) {
  if (!Number.isFinite(count) || count <= 0 || !Number.isFinite(maximum) || maximum <= 0) {
    return { opacity: 0.2, width: 1 };
  }
  const normalized = clamp(Math.log1p(count) / Math.log1p(maximum), 0, 1);
  return { opacity: 0.18 + normalized * 0.35, width: 1 + normalized * 1.3 };
}

function seeded(seed) {
  let value = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    value ^= seed.charCodeAt(index);
    value = Math.imul(value, 16777619);
  }
  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

// Stable, label-safe positions. The six anchors prevent overlap while the seed
// provides a small parent-specific shift without a force simulation.
export function getNetworkPositions(networkId, parentId, depth) {
  const anchors = [[50, 17], [22, 34], [78, 34], [19, 70], [50, 82], [81, 70]];
  const random = seeded(`${networkId ?? "local"}:${parentId ?? "root"}:${depth}`);
  return anchors.map(([left, top], index) => ({
    index,
    left: clamp(left + (random() - 0.5) * 5, 12, 88),
    top: clamp(top + (random() - 0.5) * 4, 12, 86),
  }));
}

export function assertSixNodes(nodes, context) {
  if (nodes.length !== GRAPH_NODE_COUNT) {
    throw new Error(`${context} doit contenir exactement six résonances (reçu : ${nodes.length}).`);
  }
  return nodes;
}
