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

async function request(url, key, { method = "POST", body, prefer, accessToken } = {}) {
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

  return response.ok
    ? { data, error: null }
    : { data: null, error: createSupabaseError(response, data) };
}

function createClient(url, key) {
  const sessionStorageKey = "nao-supabase-session";
  let session = null;

  try {
    session = JSON.parse(localStorage.getItem(sessionStorageKey));
  } catch {
    localStorage.removeItem(sessionStorageKey);
  }

  function saveSession(nextSession) {
    session = nextSession;
    if (session) localStorage.setItem(sessionStorageKey, JSON.stringify(session));
    else localStorage.removeItem(sessionStorageKey);
  }

  function authResult(result) {
    if (result.data?.access_token) saveSession(result.data);
    return {
      data: result.data ? { user: result.data.user, session: result.data } : null,
      error: result.error,
    };
  }

  return {
    auth: {
      async signInAnonymously({ options } = {}) {
        const result = await request(`${url}/auth/v1/signup`, key, {
          body: { data: options?.data },
        });
        return authResult(result);
      },

      async getSession() {
        return { data: { session }, error: null };
      },

      async getUser() {
        if (!session?.access_token) {
          return { data: { user: null }, error: null };
        }

        const result = await request(`${url}/auth/v1/user`, key, {
          method: "GET",
          accessToken: session.access_token,
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
        upsert(record, { onConflict, returnRepresentation = false } = {}) {
          const query = onConflict ? `?on_conflict=${encodeURIComponent(onConflict)}` : "";
          const returning = returnRepresentation ? "return=representation" : "return=minimal";
          return request(`${endpoint}${query}`, key, {
            body: record,
            prefer: `resolution=merge-duplicates,${returning}`,
            accessToken: session?.access_token,
          });
        },

        update(record) {
          return {
            eq(column, value) {
              const query = `?${encodeURIComponent(column)}=eq.${encodeURIComponent(value)}`;
              return request(`${endpoint}${query}`, key, {
                method: "PATCH",
                body: record,
                prefer: "return=minimal",
                accessToken: session?.access_token,
              });
            },
          };
        },

        delete() {
          return {
            eq(column, value) {
              const query = `?${encodeURIComponent(column)}=eq.${encodeURIComponent(value)}`;
              return request(`${endpoint}${query}`, key, {
                method: "DELETE",
                prefer: "return=minimal",
                accessToken: session?.access_token,
              });
            },
          };
        },

        select(columns = "*") {
          const query = new URLSearchParams({ select: columns });
          const run = () => request(`${endpoint}?${query}`, key, {
            method: "GET",
            accessToken: session?.access_token,
          });
          const builder = {
            eq(column, value) {
              query.set(column, `eq.${value}`);
              return builder;
            },
            order(column, { ascending = true } = {}) {
              query.set("order", `${column}.${ascending ? "asc" : "desc"}`);
              return builder;
            },
            limit(value) {
              query.set("limit", value);
              return builder;
            },
            then(resolve, reject) {
              return run().then(resolve, reject);
            },
          };
          return builder;
        },

        insert(record, { returnRepresentation = false } = {}) {
          return request(endpoint, key, {
            body: record,
            prefer: returnRepresentation ? "return=representation" : "return=minimal",
            accessToken: session?.access_token,
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
  if (!isSupabaseConnected()) return null;
  client ??= createClient(supabaseUrl, supabaseKey);
  return client;
}
