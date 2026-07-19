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

function profileErrorMessage(error, action = "créer le compte") {
  if (error.code === "23505") {
    return "Ce pseudo est déjà utilisé. Essaie-en un autre.";
  }

  return error.message || `Impossible de ${action}.`;
}

function logAuthError(label, error) {
  console.error(`[NAO profile] ${label} ERROR`, {
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint,
    status: error.status,
  });
}

function validateCredentials({ pseudonym, email, password }, { needsPseudonym }) {
  if (needsPseudonym) {
    const pseudonymError = validatePseudonym(pseudonym);
    if (pseudonymError) return pseudonymError;
  }

  if (!email.trim()) return "Renseigne ton adresse email.";
  if (!/^\S+@\S+\.\S+$/.test(email.trim())) return "Renseigne une adresse email valide.";
  if (!password) return "Renseigne ton mot de passe.";

  return null;
}

function profileFromUser(user, fallbackPseudonym) {
  return {
    id: user.id,
    pseudonym:
      user.user_metadata?.pseudonym ??
      user.user_metadata?.display_name ??
      fallbackPseudonym ??
      user.email?.split("@")[0] ??
      "Rêveur",
    createdAt: user.created_at ?? new Date().toISOString(),
  };
}

export async function createAccount({ pseudonym, email, password }) {
  if (!isSupabaseConnected()) {
    throw new Error("La connexion à Supabase n'est pas configurée.");
  }

  const validationError = validateCredentials(
    { pseudonym, email, password },
    { needsPseudonym: true },
  );
  if (validationError) throw new Error(validationError);

  const client = getSupabaseClient();
  const normalizedPseudonym = normalizePseudonym(pseudonym);
  const { data: authData, error: authError } = await client.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        pseudonym: normalizedPseudonym,
        display_name: normalizedPseudonym,
      },
    },
  });

  if (authError) {
    logAuthError("SIGNUP", authError);
    throw new Error(profileErrorMessage(authError));
  }

  if (!authData?.user?.id) {
    throw new Error("Aucune session Supabase active.");
  }

  if (!authData.session) {
    throw new Error("Vérifie ton adresse email avant de te connecter.");
  }

  const profile = profileFromUser(authData.user, normalizedPseudonym);
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
    logAuthError("PROFILE", error);
    throw new Error(profileErrorMessage(error));
  }

  return profile;
}

export async function login({ email, password }) {
  if (!isSupabaseConnected()) {
    throw new Error("La connexion à Supabase n'est pas configurée.");
  }

  const validationError = validateCredentials(
    { email, password },
    { needsPseudonym: false },
  );
  if (validationError) throw new Error(validationError);

  const { data, error } = await getSupabaseClient().auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    logAuthError("LOGIN", error);
    throw new Error(profileErrorMessage(error, "te connecter"));
  }

  if (!data?.user?.id) {
    throw new Error("Aucune session Supabase active.");
  }

  return profileFromUser(data.user);
}
