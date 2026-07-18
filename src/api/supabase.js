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

async function request(url, key, record, prefer) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: prefer,
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
}

function createClient(url, key) {
  return {
    from(tableName) {
      const endpoint = `${url}/rest/v1/${tableName}`;

      return {
        insert(record) {
          return request(endpoint, key, record, "return=minimal");
        },

        upsert(record, { onConflict } = {}) {
          const query = onConflict
            ? `?on_conflict=${encodeURIComponent(onConflict)}`
            : "";
          return request(
            `${endpoint}${query}`,
            key,
            record,
            "resolution=merge-duplicates,return=minimal",
          );
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
