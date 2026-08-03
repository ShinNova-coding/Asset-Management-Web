import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ViewDetailsForm from "../../components/features/UserManagement/ViewDetailsForm";
import { apiFetch } from "../../lib/api";
import { normalizeImageSource } from "../../lib/utils";
import type { Employee } from "../../types/employee";
import { ArrowLeft } from "lucide-react";

const formatStatus = (status: string) =>
  status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : "-";

export default function EmployeeDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    try {
      if (import.meta.env.DEV && typeof window !== "undefined") {
        localStorage.setItem(
          "token",
          "7|N5Vq58chJXHoyy7GqjuTEPH4CHJGLF6IplgxGtIQ2187ee5c"
        );
      }
    } catch (e) {
      // ignore
    }

    const fetchUser = async () => {
      setLoading(true);
      setError(null);

      try {
        const attemptFetch = async () => {
          const primary = await apiFetch(`/user/${id}`);
          if (primary?.success && primary.data) return primary.data;

          const fallback = await apiFetch(`/user/id?id=${encodeURIComponent(id)}`);
          if (fallback?.success && fallback.data) return fallback.data;

          return null;
        };

        const user = await attemptFetch();

        if (!user) {
          throw new Error("No user found for this specific ID");
        }

        const mapped: Employee = {
          id: user.id,
          profileImage: normalizeImageSource(
            user.preview_url ||
            user.image_url ||
            user.image ||
            user.media?.[0]?.preview_url ||
            user.media?.[0]?.original_url ||
            null
          ),
          employee_id: user.employee_id || "-",
          name: user.name || "Unknown",
          email: user.email || "-",
          address: user.address || "-",
          position: user.position || "-",
          status: formatStatus(user.status),
          role: user.roles?.[0]?.name || "-",
          joinedDate: user.joined_date || "-",
          leftDate: user.left_date || "-",
          phone: user.phone_number || "-",
        };

        setEmployee(mapped);
      } catch (err: any) {
        console.error("Fetch Error:", err);

        let errorMsg = err.message || "Failed to load user";

        if (errorMsg.includes("404")) {
          errorMsg = `Employee not found with ID: ${id}`;
        }

        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (!id) {
    return <div className="p-6 text-red-500 font-medium">Employee ID not specified in route URL.</div>;
  }

  return (
    <div>
      
     

      {loading && (
        <div className="p-6 text-gray-500 font-medium animate-pulse">
          Loading 
        </div>
      )}
      
      {error && (
        <div className="p-5 m-4 bg-red-50 border border-red-200 text-red-600 rounded-xl">
          <p className="font-semibold">⚠️ Error Loading Data:</p>
          <p className="text-sm">{error}</p>
          <div className="text-xs text-gray-500 mt-2">
            <p>💡 Diagnostics & Tips:</p>
            <ul className="ml-4 mt-1 list-disc">
              <li>Verify server is running at http://localhost:1011</li>
              <li>Check if your device is connected to the network segment (192.168.100.x)</li>
              <li>Ensure the route id matches: <code className="bg-gray-100 p-0.5 rounded">{id}</code></li>
            </ul>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      )}

      {!loading && !error && employee && <ViewDetailsForm data={employee} />}
    </div>
  );
}