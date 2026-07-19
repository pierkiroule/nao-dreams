import { getSupabaseClient, isSupabaseConnected } from "../api/supabase";

const TABLE_NAME = "profiles";
const adjectives = ["Silencieux", "Lointain", "Solaire", "Nocturne", "Flottant", "Secret"];
const creatures = ["Renard", "Hibou", "Cerf", "Papillon", "Corbeau", "Dauphin"];

export function generatePseudonym() {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const creature = creatures[Math.floor(Math.random() * creatures.length)];
  const number = Math.floor(10 + Math.random() * 90);
  return `${creature} ${adjective} ${number}`;
}

export function getApproximateLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({
        latitude: Number(coords.latitude.toFixed(2)),
        longitude: Number(coords.longitude.toFixed(2)),
        precisionKm: Math.max(1, Math.round(coords.accuracy / 1000)),
      }),
      () => resolve(null),
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 3_600_000 },
    );
  });
}

function profileFromUser(user, pseudonym, location = null) {
  return {
    id: user.id,
    pseudonym: user.user_metadata?.pseudonym ?? pseudonym ?? "Rêveur",
    createdAt: user.created_at ?? new Date().toISOString(),
    locationLabel: location ? "Zone approximative autour de vous" : "Zone non partagée",
  };
}

function logProfileError(label, error) {
  console.error(`[NAO profile] ${label} ERROR`, {
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint,
    status: error.status,
  });
}

export async function startNao() {
  if (!isSupabaseConnected()) {
    throw new Error("La connexion à Supabase n'est pas configurée.");
  }

  const client = getSupabaseClient();
  const { data: sessionData } = await client.auth.getSession();
  if (sessionData?.session?.user) return profileFromUser(sessionData.session.user);

  const pseudonym = generatePseudonym();
  const location = await getApproximateLocation();
  const { data, error } = await client.auth.signInAnonymously({
    options: { data: { pseudonym, display_name: pseudonym } },
  });

  if (error) {
    logProfileError("ANONYMOUS AUTHENTICATION", error);
    throw error;
  }
  if (!data?.user?.id) throw new Error("Aucune session Supabase active.");

  const profile = profileFromUser(data.user, pseudonym, location);
  const { error: profileError } = await client.from(TABLE_NAME).upsert(
    {
      id: profile.id,
      username: profile.pseudonym,
      display_name: profile.pseudonym,
      latitude_approx: location?.latitude ?? null,
      longitude_approx: location?.longitude ?? null,
      location_precision_km: location?.precisionKm ?? null,
      location_visible: Boolean(location),
    },
    { onConflict: "id" },
  );

  if (profileError) logProfileError("PROFILE", profileError);
  return profile;
}
