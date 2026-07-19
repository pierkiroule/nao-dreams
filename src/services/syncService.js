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

export async function createOrResumeJourney(journey, networkId) {
  if (!isSupabaseConnected()) return journey.id;
  const client = getSupabaseClient();
  const { data, error } = await client.auth.getUser();
  if (error) throw error;
  if (!data?.user?.id) throw new Error("Aucune session Supabase active.");
  const { error: saveError } = await client.from(TABLE_NAME).upsert({
    ...toJourneyRecord({ ...journey, networkId }, data.user.id),
    network_id: networkId,
  }, { onConflict: "id" });
  if (saveError) throw saveError;
  return journey.id;
}

export async function replaceJourneyChoice(journeyId, choices) {
  if (!isSupabaseConnected()) return;
  const client = getSupabaseClient();
  const { error: deleteError } = await client.from("journey_choices").delete().eq("journey_id", journeyId);
  if (deleteError) throw deleteError;
  if (!choices.length) return;
  const { error } = await client.from("journey_choices").insert(choices.map((choice, index) => ({
    journey_id: journeyId,
    bubble_id: choice.bubbleId,
    step: index + 1,
  })));
  if (error) throw error;
}

export async function saveJourneyChoice(journeyId, choices) {
  return replaceJourneyChoice(journeyId, choices);
}

// Exposures capture the six bubbles that were actually presented at a step. This
// keeps the graph metrics honest: a selection rate can distinguish "chosen" from
// "shown", rather than only counting the final three choices.
export async function syncJourneyExposures({ journeyId, networkId, step, nodes }) {
  if (!isSupabaseConnected() || !journeyId || !networkId || !nodes?.length) return;
  const client = getSupabaseClient();
  const { data: existing, error: readError } = await client.from("journey_exposures")
    .select("id,bubble_id,position,selected")
    .eq("journey_id", journeyId)
    .eq("step", step);
  if (readError) throw readError;

  const known = new Set((existing ?? []).map((exposure) => `${exposure.bubble_id}:${exposure.position}`));
  const missing = nodes
    .map((node, index) => ({ journey_id: journeyId, network_id: networkId, bubble_id: node.id, step, position: index + 1, selected: false }))
    .filter((exposure) => !known.has(`${exposure.bubble_id}:${exposure.position}`));
  if (!missing.length) return;
  const { error } = await client.from("journey_exposures").insert(missing);
  if (error) throw error;
}

export async function markJourneyExposureSelected({ journeyId, step, bubbleId }) {
  if (!isSupabaseConnected() || !journeyId || !bubbleId) return;
  const client = getSupabaseClient();
  const { data, error: readError } = await client.from("journey_exposures")
    .select("id")
    .eq("journey_id", journeyId)
    .eq("step", step)
    .eq("bubble_id", bubbleId)
    .limit(1);
  if (readError) throw readError;
  if (!data?.[0]?.id) return;
  const { error } = await client.from("journey_exposures").update({ selected: true }).eq("id", data[0].id);
  if (error) throw error;
}

export async function completeJourney(journey) {
  return syncJourney(journey);
}
