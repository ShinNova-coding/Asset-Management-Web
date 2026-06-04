import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../lib/api";
import { normalizeImageSource } from "../../lib/utils";
import type { Employee } from "../../types/employee";

type ApiUser = {
  id: string;
  employee_id: string;
  name: string;
  email: string;
  position: string | null;
  status: string;
  phone_number: string | null;
  joined_date: string | null;
  left_date: string | null;
  image_url: string | null;
  preview_url?: string | null;
  image?: string | null;
  media?: Array<{
    original_url?: string | null;
    preview_url?: string | null;
  }>;
  roles?: Array<{
    name: string;
  }>;
};

const formatStatus = (status: string) =>
  status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : "-";

const mapApiUserToEmployee = (user: ApiUser): Employee => ({
  id: user.id,
  profileImage: normalizeImageSource(
    user.preview_url ||
      user.image_url ||
      user.image ||
      user.media?.[0]?.preview_url ||
      user.media?.[0]?.original_url ||
      null
  ),
  employee_id: user.employee_id,
  name: user.name,
  email: user.email,
  address: "-",
  position: user.position || "-",
  status: formatStatus(user.status),
  role: user.roles?.[0]?.name || "-",
  joinedDate: user.joined_date || "-",
  leftDate: user.left_date || "-",
  phone: user.phone_number || "-",
});

export default function EmployeeListPage() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await apiFetch("/user");
        const payload = (res && (res.data ?? res)) || res;
        const users = payload?.data?.data || payload?.data || [];

        setEmployees(Array.isArray(users) ? users.map(mapApiUserToEmployee) : []);
      } catch (err: any) {
        console.error(err);
        setError(err?.message || "Unable to load employees.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div className="p-6">
      {loading && <div className="text-sm text-slate-500">Loading employees...</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}

      {!loading && !error && (
        <table className="w-full border">
          <thead>
            <tr className="bg-blue-400 text-white">
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Position</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => (
              <tr
                key={emp.id ?? emp.employee_id}
                onClick={() => navigate(`/employee/${emp.id ?? emp.employee_id}`)}
                className="cursor-pointer hover:bg-gray-100"
              >
                <td>{emp.employee_id}</td>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.position}</td>
                <td>{emp.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}