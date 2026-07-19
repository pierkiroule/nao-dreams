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

export async function createProfile(pseudonym) {
  if (!isSupabaseConnected()) {
    throw new Error("La connexion à Supabase n'est pas configurée.");
  }

  const client = getSupabaseClient();
  const { data: authData, error: authError } =
    await client.auth.signInAnonymously();

  if (authError || !authData?.user?.id) {
    throw new Error(profileErrorMessage(authError ?? new Error()));
  }

  const profile = {
    id: authData.user.id,
    pseudonym: normalizePseudonym(pseudonym),
    createdAt: new Date().toISOString(),
  };
  const { error } = await client
    .from(TABLE_NAME)
    .insert({
      id: profile.id,
      username: profile.pseudonym,
      display_name: profile.pseudonym,
    });

  if (error) {
    throw new Error(profileErrorMessage(error));
  }

  return profile;
}
