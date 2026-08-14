export async function apiFetch(url: string, options: any = {}) {
  const token = localStorage.getItem("token");

  const method = options.method || "GET";

  const config: any = {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...options.headers,
    },
  };

  // ❌ FIX: NEVER send body with GET/HEAD
  if (method !== "GET" && method !== "HEAD" && options.body) {
    config.body =
      typeof options.body === "string"
        ? options.body
        : JSON.stringify(options.body);
  }

  const res = await fetch(`http://192.168.100.163:1011/api${url}`, config);

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || `API Error ${res.status}`);
  }

  return data;
}
