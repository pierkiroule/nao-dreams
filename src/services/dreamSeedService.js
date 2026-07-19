import { getSupabaseClient, isSupabaseConnected } from "../api/supabase";

import { resolveDreamPhrase } from "./dreamPhrases";

export async function createOrResumeDreamSeed({ journeyId, networkId, bubbleIds }) {
  const phrase = resolveDreamPhrase(bubbleIds);
  const localSeed = { id: crypto.randomUUID(), journeyId, networkId, bubbleIds, phrase, generationMode: "fallback" };
  if (!isSupabaseConnected()) return localSeed;
  const client = getSupabaseClient();
  const { data: existing, error: readError } = await client.from("dream_seeds")
    .select("id,journey_id,network_id,bubble_1_id,bubble_2_id,bubble_3_id,phrase,generation_mode")
    .eq("journey_id", journeyId).limit(1);
  if (readError) throw readError;
  if (existing?.[0]) {
    const seed = existing[0];
    return { id: seed.id, journeyId: seed.journey_id, networkId: seed.network_id, bubbleIds: [seed.bubble_1_id, seed.bubble_2_id, seed.bubble_3_id], phrase: seed.phrase, generationMode: seed.generation_mode };
  }
  const record = { id: localSeed.id, journey_id: journeyId, network_id: networkId, bubble_1_id: bubbleIds[0], bubble_2_id: bubbleIds[1], bubble_3_id: bubbleIds[2], phrase, generation_mode: "fallback" };
  const { error } = await client.from("dream_seeds").insert(record);
  if (error) throw error;
  return localSeed;
}

export async function saveDreamReflection({ dreamSeedId, journeyId, content }) {
  if (!content.trim() || !isSupabaseConnected()) return { saved: false };
  const client = getSupabaseClient();
  const { data: authData, error: authError } = await client.auth.getUser();
  if (authError) throw authError;
  if (!authData?.user?.id) throw new Error("Aucune session Supabase active.");
  const { error } = await client.from("dream_seed_reflections").upsert({
    journey_id: journeyId,
    dream_seed_id: dreamSeedId,
    user_id: authData.user.id,
    content: content.trim(),
    is_shareable: false,
    updated_at: new Date().toISOString(),
  }, { onConflict: "journey_id,dream_seed_id" });
  if (error) throw error;
  return { saved: true };
}
