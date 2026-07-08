

const BASE_URL = "http://localhost:1011/api";

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

// Expense API functions
export interface ExpensePayload {
  users_id: string;
  maintenances_id: null | string;
  assets_id: null | string;
  cost: number;
  expense_date: string;
  title: string;
  expense_type: "claim" | "asset_purchase" | string;
  status: "approved" | "pending" | "rejected" | string;
  voucher: string | null;
  description: string;
  asset_code: string;
  name: string;
  category: string;
  serial_number: string;
  image: string | null;
}

export const createExpense = async (payload: ExpensePayload) => {
  return apiRequest("/expense", "POST", payload);
};

export const fetchExpenses = async () => {
  return apiRequest("/expense", "GET");
};

export const getExpenseById = async (id: string) => {
  return apiRequest(`/expense/${id}`, "GET");
};

export const updateExpense = async (id: string, payload: Partial<ExpensePayload>) => {
  return apiRequest(`/expense/${id}`, "PUT", payload);
};

export const deleteExpense = async (id: string) => {
  return apiRequest("/expense/expense_id", "DELETE", { expense_id: id });
};

export const updateExpenseStatus = async (expenseId: string, status: "approved" | "canceled" | string, remark?: string) => {
  const payload: any = {
    expense_id: expenseId,
    status: status,
  };
  
  if (remark) {
    payload.remark = remark;
  }
  
  return apiRequest("/expense/status", "POST", payload);
};

// User API functions
export interface UserUpdatePayload {
  id: string;
  name: string;
  role: string;
  email: string;
  joined_date: string | null;
  status: string;
  image?: string | null;
  password?: string;
  password_confirmation?: string;
  employee_id?: string;
  position?: string;
  phone_number?: string;
  left_date?: string | null;
}
// @/lib/apiService ဖိုင်ထဲမှာ သွားထည့်ပေးရန်

export async function getCategories() {
  const myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Authorization", "Bearer 261|UKYS7uARyAxUtGBmPZJVTmphmMp8EQOGCcHo9Qsi8993df01");

  const requestOptions: RequestInit = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  const response = await fetch("http://192.168.100.190:1011/api/category", requestOptions);
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
}
export const updateUserProfile = async (payload: UserUpdatePayload) => {
  // Build update payload for /user/id endpoint
  const updatePayload: any = {
    id: payload.id,
    name: payload.name,
    role: payload.role,
    email: payload.email,
    joined_date: payload.joined_date,
    status: payload.status,
  };

  // Always include image
  updatePayload.image = payload.image || null;

  // Only include password if being changed
  if (payload.password) {
    updatePayload.password = payload.password;
    updatePayload.password_confirmation = payload.password_confirmation;
  }

  // Include additional fields if they exist
  if (payload.employee_id !== undefined && payload.employee_id !== '') {
    updatePayload.employee_id = payload.employee_id;
  }

  if (payload.position !== undefined && payload.position !== '') {
    updatePayload.position = payload.position;
  }

  if (payload.phone_number !== undefined && payload.phone_number !== '') {
    updatePayload.phone_number = payload.phone_number;
  }

  if (payload.left_date !== undefined) {
    updatePayload.left_date = payload.left_date;
  }

  return apiRequest("/user/id", "PATCH", updatePayload);
};