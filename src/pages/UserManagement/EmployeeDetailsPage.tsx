import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ViewDetailsForm from "../../components/features/UserManagement/ViewDetailsForm";
import { apiFetch } from "../../lib/api";
import type { Employee } from "../../types/employee";

const formatStatus = (status: string) =>
  status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : "-";

export default function EmployeeDetailsPage() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!employeeId) return;

    // For development convenience: set token if not present (do not use in production)
    try {
      if (import.meta.env.DEV && typeof window !== "undefined") {
        const existing = localStorage.getItem("token");
        if (!existing) {
          localStorage.setItem(
            "token",
            "119|6UBfGxzFSshZIwJu69IWBcmbq9gIb9opQwlL2eX51d4a76c8"
          );
        }
      }
    } catch (e) {
      // ignore
    }

    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await apiFetch(`/user/${employeeId}`);

        // API responses vary: try multiple shapes
        const payload = (res && (res.data ?? res)) || res;
        let user = payload?.data ?? payload;
        if (user?.data) {
          user = user.data;
        }

        if (!user) throw new Error("User not found");

        const mapped: Employee = {
          profileImage: user.preview_url || user.image_url || "https://via.placeholder.com/120",
          employeeId: user.employee_id,
          name: user.name,
          email: user.email,
          address: "-",
          position: user.position || "-",
          status: formatStatus(user.status),
          role: user.roles?.[0]?.name || "-",
          joinedDate: user.joined_date || "-",
          leftDate: user.left_date || "-",
          phone: user.phone_number || "-",
        };

        setEmployee(mapped);
      } catch (err: any) {
        console.error(err);
        setError(err?.message || "Failed to load user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [employeeId]);

  if (!employeeId) {
    return <div className="p-6">Employee not specified</div>;
  }

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="m-4 px-4 py-2 bg-gray-200 rounded"
      >
        Back
      </button>

      {loading && <div className="p-6 text-gray-500">Loading employee...</div>}
      {error && <div className="p-6 text-red-600">{error}</div>}

      {employee && <ViewDetailsForm data={employee} />}
    </div>
  );
}