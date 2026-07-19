const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  import.meta.env.VITE_SUPABASE_ANON_KEY;

function createSupabaseError(response, details) {
  const message = details?.message ?? `Supabase request failed (${response.status}).`;
  return Object.assign(new Error(message), {
    code: details?.code,
    details: details?.details,
    hint: details?.hint,
    status: response.status,
  });
}

async function request(
  url,
  key,
  { method = "POST", body, prefer, accessToken } = {},
) {
  const response = await fetch(url, {
    method,
    headers: {
      apikey: key,
      Authorization: `Bearer ${accessToken ?? key}`,
      "Content-Type": "application/json",
      ...(prefer ? { Prefer: prefer } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });

  let data = null;
  if (response.status !== 204) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  }

  if (response.ok) {
    return { data, error: null };
  }

  return { data: null, error: createSupabaseError(response, data) };
}

function createClient(url, key) {
  let accessToken = null;

  return {
    auth: {
      async signInAnonymously() {
        const result = await request(`${url}/auth/v1/signup`, key, {
          body: {},
        });
        accessToken = result.data?.access_token ?? null;

        return {
          data: result.data
            ? { user: result.data.user, session: result.data }
            : null,
          error: result.error,
        };
      },

      async getUser() {
        if (!accessToken) {
          return { data: { user: null }, error: null };
        }

        const result = await request(`${url}/auth/v1/user`, key, {
          method: "GET",
          accessToken,
        });
        return {
          data: { user: result.data },
          error: result.error,
        };
      },
    },

    from(tableName) {
      const endpoint = `${url}/rest/v1/${tableName}`;

      return {
        insert(record) {
          return request(endpoint, key, {
            body: record,
            prefer: "return=minimal",
            accessToken,
          });
        },

        upsert(record, { onConflict, returnRepresentation = false } = {}) {
          const query = onConflict
            ? `?on_conflict=${encodeURIComponent(onConflict)}`
            : "";
          const returning = returnRepresentation
            ? "return=representation"
            : "return=minimal";
          return request(`${endpoint}${query}`, key, {
            body: record,
            prefer: `resolution=merge-duplicates,${returning}`,
            accessToken,
          });
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
