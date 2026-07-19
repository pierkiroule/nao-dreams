import { getSupabaseClient, isSupabaseConnected } from "../api/supabase";
import { dreamResources } from "../data/resources";

function toNode(bubble, linksByParent, bubblesById) {
  return {
    id: bubble.id,
    emoji: bubble.emoji,
    label: bubble.text,
    isLeaf: bubble.is_leaf,
    children: (linksByParent.get(bubble.id) ?? [])
      .map(({ child_id }) => bubblesById.get(child_id))
      .filter(Boolean)
      .map((child) => toNode(child, linksByParent, bubblesById)),
  };
}

export async function getResonanceNetwork() {
  if (!isSupabaseConnected()) {
    return dreamResources.network;
  }

  try {
    const client = getSupabaseClient();
    const { data: networks, error: networkError } = await client
    .from("bubble_networks")
    .select("id,question,max_depth")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(1);

    if (networkError) throw networkError;
    const network = networks?.[0];
    if (!network) throw new Error("Aucun réseau de bulles publié n’est disponible.");

    const [{ data: roots, error: rootsError }, { data: links, error: linksError }, { data: bubbles, error: bubblesError }] = await Promise.all([
      client.from("bubble_network_roots").select("bubble_id,position").eq("network_id", network.id).order("position"),
      client.from("bubble_links").select("parent_id,child_id,position").eq("network_id", network.id).eq("active", true).order("position"),
      client.from("dream_bubbles").select("id,emoji,text,is_leaf,depth,position"),
    ]);

    if (rootsError) throw rootsError;
    if (linksError) throw linksError;
    if (bubblesError) throw bubblesError;

    const bubblesById = new Map((bubbles ?? []).map((bubble) => [bubble.id, bubble]));
    const linksByParent = new Map();
    for (const link of links ?? []) {
      linksByParent.set(link.parent_id, [...(linksByParent.get(link.parent_id) ?? []), link]);
    }

    const networkRoots = (roots ?? [])
      .map(({ bubble_id }) => bubblesById.get(bubble_id))
      .filter(Boolean)
      .map((bubble) => toNode(bubble, linksByParent, bubblesById));

    if (!networkRoots.length) {
      throw new Error("Le réseau publié ne contient aucune bulle racine.");
    }

    return {
      id: network.id,
      question: network.question,
      maxDepth: network.max_depth,
      roots: networkRoots,
    };
  } catch (error) {
    console.warn("Réseau distant indisponible, utilisation du réseau embarqué.", error);
    return dreamResources.network;
  }
}
