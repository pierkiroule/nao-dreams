import { getSupabaseClient, isSupabaseConnected } from "../api/supabase";
import { dreamResources } from "../data/resources";
import { assertSixNodes } from "../components/graphMath";

function normalizeBubble(bubble, position, stats) {
  return {
    id: bubble.id,
    emoji: bubble.emoji,
    label: bubble.text ?? bubble.label,
    position,
    resonanceScore: stats?.resonance_score ?? bubble.resonance_score ?? bubble.selection_rate ?? bubble.resonanceScore,
    selectionRate: stats?.resonance_score ?? bubble.selection_rate ?? bubble.selectionRate,
    selectionCount: stats?.selection_count,
    journeyCount: stats?.journey_count,
  };
}

function localChildren(parentId) {
  const find = (nodes) => nodes.find((node) => node.id === parentId);
  const root = find(dreamResources.network.roots);
  if (root) return root.children ?? [];
  for (const rootNode of dreamResources.network.roots) {
    const child = find(rootNode.children ?? []);
    if (child) return child.children ?? [];
  }
  return [];
}

export async function getPublishedNetwork() {
  if (!isSupabaseConnected()) return { ...dreamResources.network, isLocal: true };
  try {
    const client = getSupabaseClient();
    const { data, error } = await client.from("bubble_networks")
      .select("id,question,max_depth").eq("status", "published")
      .order("created_at", { ascending: false }).limit(1);
    if (error) throw error;
    if (!data?.[0]) throw new Error("Aucun réseau de bulles publié n’est disponible.");
    return { id: data[0].id, question: data[0].question, maxDepth: data[0].max_depth, isLocal: false };
  } catch (error) {
    // A configured Supabase project can legitimately have no published graph yet.
    // Never block the launch experience in that state: the embedded network is a
    // complete, six-node-per-level fallback and preserves the same journey flow.
    console.warn("Réseau distant indisponible, utilisation du réseau embarqué.", error);
    return { ...dreamResources.network, isLocal: true };
  }
}

async function getOccurrenceStats(client, networkId, bubbleIds) {
  if (!bubbleIds.length) return new Map();
  try {
    const { data, error } = await client.from("bubble_occurrence_stats")
      .select("bubble_id,selection_count,journey_count,resonance_score")
      .eq("network_id", networkId).in("bubble_id", bubbleIds);
    if (error) throw error;
    return new Map((data ?? []).map((stat) => [stat.bubble_id, stat]));
  } catch (error) {
    // Stats are an optional post-migration layer. Navigation must remain usable
    // while historical data is being backfilled.
    console.warn("Statistiques de résonance indisponibles, rendu neutre.", error);
    return new Map();
  }
}

async function fetchBubbles(client, networkId, references) {
  // The lightweight REST client has no `in` builder. Six individual reads keep
  // the payload bounded and preserve RLS; this is deliberately not a full graph fetch.
  const results = await Promise.all(references.map(({ bubble_id, position }) =>
    client.from("dream_bubbles").select("id,emoji,text,resonance_score,selection_rate")
      .eq("id", bubble_id).limit(1).then(({ data, error }) => {
        if (error) throw error;
        return data?.[0] ? normalizeBubble(data[0], position) : null;
      }),
  ));
  const bubbles = results.filter(Boolean);
  const stats = await getOccurrenceStats(client, networkId, bubbles.map((bubble) => bubble.id));
  return bubbles.map((bubble) => normalizeBubble(bubble, bubble.position, stats.get(bubble.id)));
}

export async function getRootNodes(networkId) {
  if (!isSupabaseConnected() || !networkId) {
    return assertSixNodes(dreamResources.network.roots.map((node, position) => normalizeBubble(node, position)), "Les racines locales");
  }
  const client = getSupabaseClient();
  const { data, error } = await client.from("bubble_network_roots")
    .select("bubble_id,position").eq("network_id", networkId).order("position").limit(6);
  if (error) throw error;
  return assertSixNodes(await fetchBubbles(client, networkId, data ?? []), "Les racines du réseau");
}

export async function getChildNodes(networkId, parentId) {
  if (!isSupabaseConnected() || !networkId) {
    return assertSixNodes(localChildren(parentId).map((node, position) => normalizeBubble(node, position)), "Cette branche locale");
  }
  const client = getSupabaseClient();
  const { data, error } = await client.from("bubble_links")
    .select("child_id,position").eq("network_id", networkId).eq("parent_id", parentId)
    .eq("active", true).order("position").limit(6);
  if (error) throw error;
  return assertSixNodes(await fetchBubbles(client, networkId, data ?? []), "Cette branche du réseau");
}

export async function getNetworkEdges(networkId, visibleNodeIds) {
  if (!isSupabaseConnected() || !networkId || visibleNodeIds.length < 2) return [];
  try {
    const client = getSupabaseClient();
    const select = "bubble_a_id,bubble_b_id,cooccurrence_count,transition_count,strength_score";
    const [asFirst, asSecond] = await Promise.all([
      client.from("bubble_cooccurrence_stats").select(select).eq("network_id", networkId).in("bubble_a_id", visibleNodeIds),
      client.from("bubble_cooccurrence_stats").select(select).eq("network_id", networkId).in("bubble_b_id", visibleNodeIds),
    ]);
    if (asFirst.error) throw asFirst.error;
    if (asSecond.error) throw asSecond.error;
    const visible = new Set(visibleNodeIds);
    const unique = new Map();
    [...(asFirst.data ?? []), ...(asSecond.data ?? [])].forEach((edge) => {
      if (!visible.has(edge.bubble_a_id) || !visible.has(edge.bubble_b_id)) return;
      unique.set(`${edge.bubble_a_id}:${edge.bubble_b_id}`, {
        sourceId: edge.bubble_a_id,
        targetId: edge.bubble_b_id,
        cooccurrenceCount: edge.cooccurrence_count,
        strength: edge.strength_score,
        transitionCount: edge.transition_count,
      });
    });
    return [...unique.values()];
  } catch (error) {
    console.warn("Cooccurrences indisponibles, liens structurels uniquement.", error);
    return [];
  }
}

// Compatibility adapter for callers outside the immersive journey.
export async function getResonanceNetwork() {
  try {
    const network = await getPublishedNetwork();
    return { ...network, roots: await getRootNodes(network.id) };
  } catch (error) {
    console.warn("Réseau distant indisponible, utilisation du réseau embarqué.", error);
    return { ...dreamResources.network, isLocal: true };
  }
}
