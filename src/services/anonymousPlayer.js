import { getSupabaseClient, isSupabaseConnected } from "../api/supabase";
import { generatePseudonym } from "../lib/generatePseudonym";
import { getApproximateLocation } from "../lib/getApproximateLocation";

const PROFILE_COLUMNS = "id,pseudonym,display_name,location_label";
const MAX_PSEUDONYM_ATTEMPTS = 3;

function toPlayer(profile, isNewPlayer) {
  return {
    userId: profile.id,
    pseudonym: profile.pseudonym ?? profile.display_name ?? "Rêveur",
    locationLabel: profile.location_label ?? null,
    isNewPlayer,
  };
}

function isUniqueViolation(error) {
  return error?.code === "23505" || /unique|duplicate/i.test(error?.message ?? "");
}

function logInitializationError(error) {
  console.error("Anonymous player initialization failed", {
    message: error.message,
    code: error.code,
    status: error.status,
  });
}

async function getProfile(client, userId) {
  const { data, error } = await client
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("id", userId);

  if (error) throw error;
  return data?.[0] ?? null;
}

async function updateNewProfile(client, userId) {
  const location = await getApproximateLocation();
  const locationLabel = location ? "Zone détectée" : null;

  for (let attempt = 0; attempt < MAX_PSEUDONYM_ATTEMPTS; attempt += 1) {
    const pseudonym = generatePseudonym();
    const { error } = await client
      .from("profiles")
      .update({
        pseudonym,
        display_name: pseudonym,
        location_label: locationLabel,
        latitude_approx: location?.latitude ?? null,
        longitude_approx: location?.longitude ?? null,
        location_precision_km: location?.precisionKm ?? null,
        location_visible: Boolean(location),
      })
      .eq("id", userId);

    if (!error) return { id: userId, pseudonym, location_label: locationLabel };
    if (!isUniqueViolation(error) || attempt === MAX_PSEUDONYM_ATTEMPTS - 1) throw error;
  }

  throw new Error("Impossible de préparer ton identité onirique.");
}

export async function initializeAnonymousPlayer() {
  try {
    if (!isSupabaseConnected()) {
      throw new Error("La connexion à Supabase n'est pas configurée.");
    }

    const client = getSupabaseClient();
    const { data: sessionData } = await client.auth.getSession();
    if (sessionData?.session?.user) {
      const profile = await getProfile(client, sessionData.session.user.id);
      if (profile) return toPlayer(profile, false);
      throw new Error("Profil joueur introuvable.");
    }

    const seedPseudonym = generatePseudonym();
    const { data, error } = await client.auth.signInAnonymously({
      options: { data: { pseudonym: seedPseudonym, display_name: seedPseudonym } },
    });

    if (error) throw error;
    if (!data?.user?.id) throw new Error("Aucune session Supabase active.");

    const profile = await updateNewProfile(client, data.user.id);
    return toPlayer(profile, true);
  } catch (error) {
    logInitializationError(error);
    throw new Error("Impossible de préparer ta traversée. Réessaie dans un instant.");
  }
}
