import { getSupabaseClient, isSupabaseConnected } from "../api/supabase";
import { JOURNEY_STATUS } from "../config/constants";

/** Persists only completed one-symbol dreams. Historic journeys remain untouched. */
export async function syncDream(journey) {
  if (!journey?.id || journey.status !== JOURNEY_STATUS.DREAM_REVEALED) return { synced: false, reason: "dream_not_revealed" };
  if (!isSupabaseConnected()) return { synced: false, reason: "supabase_not_configured" };
  const client = getSupabaseClient();
  const { data, error: authError } = await client.auth.getUser();
  if (authError) throw authError;
  if (!data?.user?.id) throw new Error("Aucune session Supabase active.");
  const { error } = await client.from("dreams").upsert({
    id: journey.id, anonymous_id: data.user.id, constellation_id: journey.constellation?.id,
    selected_emoji_id: journey.selectedEmoji?.id, dream_text: journey.dream,
    template_key: journey.templateKey, generation_seed: journey.generationSeed,
  }, { onConflict: "id" });
  if (error) throw error;
  return { synced: true };
}
