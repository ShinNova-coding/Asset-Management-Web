import axios from "axios";

const API_BASE_URL = "http://192.168.100.183:1010/api";

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

export const deleteRole = async (id: number) => {
 
  const response = await axios({
    method: 'delete',
    url: `${API_BASE_URL}/role/role_id`, 
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    data: { role_id: id } 
  });
  return response.data;
};