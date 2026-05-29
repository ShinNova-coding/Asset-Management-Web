const BASE_URL = "http://192.168.100.180:1010/api";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  // Grab the secure token dynamically from the browser's storage
  const token = localStorage.getItem("itams_auth_token") || "14|yHkaytLIBZNjU8uHLHioabMF6Fw5uXAKayR9BS16ee81d101"; // Fallback to your test token for now

  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}