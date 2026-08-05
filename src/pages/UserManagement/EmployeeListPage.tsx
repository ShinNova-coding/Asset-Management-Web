import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../lib/api";
import { getImageValue, normalizeImageSource } from "../../lib/utils";
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
  roles?: Array<{ name: string }>;
};

const mapUser = (user: ApiUser): Employee => ({
  id: user.id,
  profileImage: normalizeImageSource(getImageValue(user)),
  employee_id: user.employee_id,
  name: user.name,
  email: user.email,
  address: "-",
  position: user.position || "-",
  status: user.status,
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
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await apiFetch("/user");

        const users = res?.data?.data || res?.data || [];

        setEmployees(Array.isArray(users) ? users.map(mapUser) : []);
      } catch (err: any) {
        setError(err.message || "Failed to load employees");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <table className="w-full border">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Position</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-100">
                <td>{emp.employee_id}</td>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.position}</td>
                <td>{emp.status}</td>

                <td>
                  {/* ✅ FIXED BUTTON LOCATION */}
                  <button
                    onClick={() => navigate(`/employee/${emp.id}`)}
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
