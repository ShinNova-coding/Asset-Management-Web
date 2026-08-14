import axios from "axios";

const API_BASE_URL = "http://192.168.100.163:1011/api";

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
});

export const fetchRoles = async () => {
  const response = await axios.get(`${API_BASE_URL}/role`, getAuthHeaders());
  return response.data;
};

export const deleteRole = async (id: number | string) => {
 
  const response = await axios({
    method: 'delete',
    url: `${API_BASE_URL}/role/${id}`, 
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    data: { role_id: id } 
  });
  return response.data;
};
// Add this to lib/axios.ts
export const updateRole = async (
  id: number | string,
  data: { role_id?: number | string; name: string; permissions: string[] }
) => {
  const response = await axios.patch(`${API_BASE_URL}/role/${id}`, {
    role_id: data.role_id || id,
    name: data.name,
    permissions: data.permissions,
  }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
  });
  return response.data;
};
