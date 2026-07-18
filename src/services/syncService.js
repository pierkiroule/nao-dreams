import { getSupabaseClient, isSupabaseConnected } from "../api/supabase";
import { JOURNEY_STATUS } from "../config/constants";

const TABLE_NAME = "dream_journeys";

function toJourneyRecord(journey) {
  return {
    journey_id: journey.id,
    nao_id: journey.naoId,
    series_id: journey.seriesId,
    selections: journey.selections,
    dream: journey.dream,
    status: journey.status,
    received_at: journey.receivedAt,
    created_at: journey.createdAt,
    passed_at: journey.passedAt,
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
    .upsert(toJourneyRecord(journey), { onConflict: "journey_id" });

  if (error) {
    throw error;
  }

  return { synced: true };
}
