import { useParams, useNavigate } from "react-router-dom";
import { employees } from "../../data/employees";
import ViewDetailsForm from "../../components/features/UserManagement/ViewDetailsForm";

export default function EmployeeDetailsPage() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();

  const employee = employees.find((emp) => emp.employeeId === employeeId);
  if (!employee) {
    return <div className="p-6">Employee not found</div>;
  }

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="m-4 px-4 py-2 bg-gray-200 rounded"
      >
        Back
      </button>

      <ViewDetailsForm data={employee} />
    </div>
  );
}