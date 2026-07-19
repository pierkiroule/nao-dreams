import { getSupabaseClient, isSupabaseConnected } from "../api/supabase";
import { JOURNEY_STATUS } from "../config/constants";

const TABLE_NAME = "journeys";

function toJourneyRecord(journey, profile) {
  return {
    id: journey.id,
    locale: "fr",
    completed: journey.status === JOURNEY_STATUS.PASSED,
    profile_id: profile?.id ?? null,
    created_at: journey.receivedAt,
  };
}

export async function syncJourney(journey, profile) {
  if (!journey?.id || journey.status === JOURNEY_STATUS.IDLE) {
    return { synced: false, reason: "journey_not_started" };
  }

  if (!isSupabaseConnected()) {
    return { synced: false, reason: "supabase_not_configured" };
  }

  const { error } = await getSupabaseClient()
    .from(TABLE_NAME)
    .upsert(toJourneyRecord(journey, profile), { onConflict: "id" });

  if (error) {
    throw error;
  }

  return { synced: true };
}
