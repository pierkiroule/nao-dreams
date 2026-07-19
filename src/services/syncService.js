import { getSupabaseClient, isSupabaseConnected } from "../api/supabase";
import { JOURNEY_STATUS } from "../config/constants";

const TABLE_NAME = "journeys";

function toJourneyRecord(journey, userId) {
  return {
    id: journey.id,
    user_id: userId,
    locale: "fr",
    network_id: journey.networkId,
    completed: journey.status === JOURNEY_STATUS.PASSED,
    created_at: journey.receivedAt,
  };
}

async function syncJourneyChoices(client, journey) {
  const bubbleIds = journey.selections?.bubbleIds;
  if (!journey.networkId || !bubbleIds?.length) return;

  const { data: existing, error: existingError } = await client
    .from("journey_choices")
    .select("id")
    .eq("journey_id", journey.id)
    .limit(1);

  if (existingError) throw existingError;
  if (existing?.length) return;

  const { error } = await client.from("journey_choices").insert(
    bubbleIds.map((bubbleId, index) => ({
      journey_id: journey.id,
      bubble_id: bubbleId,
      step: index + 1,
    })),
  );

  if (error) throw error;
}

export async function syncJourney(journey) {
  if (!journey?.id || journey.status === JOURNEY_STATUS.IDLE) {
    return { synced: false, reason: "journey_not_started" };
  }

  if (!isSupabaseConnected()) {
    return { synced: false, reason: "supabase_not_configured" };
  }

  const client = getSupabaseClient();
  const { data: authData, error: authError } = await client.auth.getUser();

  if (authError) {
    throw authError;
  }

  if (!authData?.user?.id) {
    throw new Error("Aucune session Supabase active.");
  }

  const { error } = await client
    .from(TABLE_NAME)
    .upsert(toJourneyRecord(journey, authData.user.id), { onConflict: "id" });

  if (error) {
    throw error;
  }

  await syncJourneyChoices(client, journey);

  return { synced: true };
}
