import { getSupabaseClient, isSupabaseConnected } from "../api/supabase";
import { JOURNEY_STATUS } from "../config/constants";

const TABLE_NAME = "journeys";

function toJourneyRecord(journey) {
  return {
    id: journey.id,
    locale: "fr",
    completed: journey.status === JOURNEY_STATUS.PASSED,
    created_at: journey.receivedAt,
  };
}

export async function syncJourney(journey) {
  if (!journey?.id || journey.status === JOURNEY_STATUS.IDLE) {
    return { synced: false, reason: "journey_not_started" };
  }

  if (!isSupabaseConnected()) {
    return { synced: false, reason: "supabase_not_configured" };
  }

  const { error } = await getSupabaseClient()
    .from(TABLE_NAME)
    .upsert(toJourneyRecord(journey), { onConflict: "id" });

  if (error) {
    throw error;
  }

  return { synced: true };
}
