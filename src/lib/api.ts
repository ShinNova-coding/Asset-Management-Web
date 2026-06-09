// src/lib/api.ts

const BASE_URL = "http://192.168.100.186:1010/api";

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem("token") || DEFAULT_TOKEN;

  const isFormData = options.body instanceof FormData;

  const headers: HeadersInit = {
    Accept: "application/json",

    Authorization: `Bearer ${token}`,

    ...(!isFormData && {
      "Content-Type": "application/json",
    }),

    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const responseData = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(responseData, `API Error: ${response.status}`));
  }

  return responseData;
}
