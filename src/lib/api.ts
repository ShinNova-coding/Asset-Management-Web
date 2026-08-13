

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://192.168.18.32:1011/api${endpoint}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data?.message || `API Error ${res.status}`);
    (error as Error & { status?: number; data?: unknown }).status = res.status;
    (error as Error & { status?: number; data?: unknown }).data = data;
    throw error;
  }

  return data;
}
