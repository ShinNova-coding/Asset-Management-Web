// src/lib/api.ts

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:1011/api${endpoint}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "API Error");
  }

  return data;
}