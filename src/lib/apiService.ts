

const BASE_URL = "http://192.168.100.185:1010/api";

export const apiRequest = async (
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  body?: any
) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const config: RequestInit = {
    method,
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Operation failed");
  }

  return result;
};