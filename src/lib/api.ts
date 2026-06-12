// src/lib/api.ts

const BASE_URL = "http://192.168.100.186:1010/api";
const DEFAULT_TOKEN = "38|5WXyvmXnbjTmcDeqSQDda6J8UsUSpKeMvdSGwaM546e4040d"; // Fallback token if not defined elsewhere

/**
 * Helper to safely parse JSON responses from the Fetch API
 */
async function parseJsonResponse(response: Response) {
  if (response.status === 204) {
    return null;
  }
  try {
    return await response.json();
  } catch (err) {
    // Return null or empty object if the response cannot be parsed as JSON
    return {};
  }
}

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
    // Ensure getErrorMessage is imported or defined in this file
    throw new Error(
      // @ts-ignore
      typeof getErrorMessage === "function" 
        // @ts-ignore
        ? getErrorMessage(responseData, `API Error: ${response.status}`)
        : `API Error: ${response.status}`
    );
  }

  return responseData;
}