// src/lib/api.ts

const BASE_URL = "http://192.168.100.185:1010/api";
const DEFAULT_TOKEN = "119|6UBfGxzFSshZIwJu69IWBcmbq9gIb9opQwlL2eX51d4a76c8";

type ApiErrorResponse = {
  message?: string;
  errors?: Record<string, string[] | string>;
};

const parseJsonResponse = async (response: Response) => {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const getErrorMessage = (errorData: unknown, fallback: string) => {
  if (!errorData || typeof errorData !== "object") {
    return fallback;
  }

  const data = errorData as ApiErrorResponse;
  const validationMessages = data.errors
    ? Object.values(data.errors).flatMap((value) =>
        Array.isArray(value) ? value : [value]
      )
    : [];

  return validationMessages[0] || data.message || fallback;
};

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
