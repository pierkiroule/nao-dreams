import { getSupabaseClient, isSupabaseConnected } from "../api/supabase";

const TABLE_NAME = "profiles";

export function normalizePseudonym(value) {
  return value.trim().replace(/\s+/g, " ");
}

export function validatePseudonym(value) {
  const pseudonym = normalizePseudonym(value);

  if (pseudonym.length < 3 || pseudonym.length > 30) {
    return "Choisis un pseudo entre 3 et 30 caractères.";
  }

  if (!/^[\p{L}\p{N} ._'-]+$/u.test(pseudonym)) {
    return "Utilise uniquement des lettres, chiffres, espaces ou . _ ' -.";
  }

  return null;
}

function profileErrorMessage(error) {
  if (error.code === "23505") {
    return "Ce pseudo est déjà utilisé. Essaie-en un autre.";
  }

  if (/anonymous/i.test(error.message)) {
    return "Les connexions anonymes doivent être activées dans Supabase Auth.";
  }

  return error.message || "Impossible de créer le compte.";
}

function logProfileError(error) {
  console.error("[NAO profile] PROFILE ERROR", {
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint,
    status: error.status,
  });
}

export async function createProfile(pseudonym) {
  if (!isSupabaseConnected()) {
    throw new Error("La connexion à Supabase n'est pas configurée.");
  }

  const client = getSupabaseClient();
  const { error: authError } = await client.auth.signInAnonymously();

  if (authError) {
    logProfileError(authError);
    throw new Error(profileErrorMessage(authError));
  }

  const { data: authData, error: getUserError } = await client.auth.getUser();
  console.debug("[NAO profile] USER:", authData?.user);

  if (getUserError || !authData?.user?.id) {
    if (getUserError) {
      logProfileError(getUserError);
    }
    throw new Error("Aucune session Supabase active.");
  }

  const profile = {
    id: authData.user.id,
    pseudonym: normalizePseudonym(pseudonym),
    createdAt: new Date().toISOString(),
  };
  const payload = {
    id: profile.id,
    username: profile.pseudonym,
    display_name: profile.pseudonym,
  };
  console.debug("[NAO profile] PROFILE PAYLOAD:", payload);

  const { data, error } = await client
    .from(TABLE_NAME)
    .upsert(payload, {
      onConflict: "id",
      returnRepresentation: true,
    });

  console.debug("[NAO profile] PROFILE DATA:", data);
  if (error) {
    logProfileError(error);
    throw new Error(profileErrorMessage(error));
  }

  return profile;
}
