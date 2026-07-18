import { getSupabaseClient, isSupabaseConnected } from "../api/supabase";

const TABLE_NAME = "profiles";

export function normalizePseudonym(value) {
  return value.trim().replace(/\s+/g, " ");
}

export function validatePseudonym(value) {
  const pseudonym = normalizePseudonym(value);

  if (pseudonym.length < 2 || pseudonym.length > 24) {
    return "Choisis un pseudo entre 2 et 24 caractères.";
  }

  if (!/^[\p{L}\p{N} ._'-]+$/u.test(pseudonym)) {
    return "Utilise uniquement des lettres, chiffres, espaces ou . _ ' -.";
  }

  return null;
}

export async function createProfile(pseudonym) {
  if (!isSupabaseConnected()) {
    throw new Error("La connexion à Supabase n'est pas configurée.");
  }

  const profile = {
    id: crypto.randomUUID(),
    pseudonym: normalizePseudonym(pseudonym),
    createdAt: new Date().toISOString(),
  };
  const { error } = await getSupabaseClient()
    .from(TABLE_NAME)
    .insert({
      id: profile.id,
      pseudonym: profile.pseudonym,
      created_at: profile.createdAt,
    });

  if (error) {
    throw error;
  }

  return profile;
}
