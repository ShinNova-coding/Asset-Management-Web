import { useNavigate } from "react-router-dom";
import { employees } from "../../data/employees";

export default function EmployeeListPage() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
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
              key={emp.employeeId}
              onClick={() => navigate(`/employee/${emp.employeeId}`)}
              className="cursor-pointer hover:bg-gray-100"
            >
              <td>{emp.employeeId}</td>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.position}</td>
              <td>{emp.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}