const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  import.meta.env.VITE_SUPABASE_ANON_KEY;

function createSupabaseError(response, details) {
  const message = details?.message ?? `Supabase request failed (${response.status}).`;
  return Object.assign(new Error(message), {
    code: details?.code,
    status: response.status,
  });
}

function createClient(url, key) {
  return {
    from(tableName) {
      return {
        async upsert(record, { onConflict } = {}) {
          const query = onConflict
            ? `?on_conflict=${encodeURIComponent(onConflict)}`
            : "";
          const response = await fetch(`${url}/rest/v1/${tableName}${query}`, {
            method: "POST",
            headers: {
              apikey: key,
              Authorization: `Bearer ${key}`,
              "Content-Type": "application/json",
              Prefer: "resolution=merge-duplicates,return=minimal",
            },
            body: JSON.stringify(record),
          });

          if (response.ok) {
            return { error: null };
          }

          let details;
          try {
            details = await response.json();
          } catch {
            details = null;
          }

          return { error: createSupabaseError(response, details) };
        },
      };
    },
  };
}

let client;

export function isSupabaseConnected() {
  return Boolean(supabaseUrl && supabaseKey);
}

export function getSupabaseClient() {
  if (!isSupabaseConnected()) {
    return null;
  }

  client ??= createClient(supabaseUrl, supabaseKey);
  return client;
}
