// src/lib/api.ts

const BASE_URL = "http://192.168.100.186:1010/api";

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem("token");

  const isFormData = options.body instanceof FormData;

  const headers: HeadersInit = {
    Accept: "application/json",

    ...(token && {
      Authorization: `Bearer ${token}`,
    }),

    ...(!isFormData && {
      "Content-Type": "application/json",
    }),

    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = `API Error: ${response.status}`;

    try {
      const errorData = await response.json();
      message = errorData.message || message;
    } catch (error) {
      console.error(error);
    }

    throw new Error(message);
  }

  return response.json();
}