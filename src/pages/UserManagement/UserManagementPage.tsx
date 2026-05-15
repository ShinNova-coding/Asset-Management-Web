import React, { useState } from 'react';
import { Link } from 'react-router-dom';


import {
  Search,
  UserPlus,
  MoreVertical,
  ChevronDown,
} from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  status: 'Active' | 'Onboarding' | 'Offboarding';
}

const employeesData: Employee[] = [
  { id: 'AF-1024', name: 'Wang', email: 'wang@agga.io', position: 'System Admin', status: 'Active' },
  { id: 'AF-2051', name: 'Xing', email: 'xing@agga.io', position: 'Security Analyst', status: 'Onboarding' },
  { id: 'AF-0982', name: 'Alex', email: 'alex@agga.io', position: 'Project Manager', status: 'Offboarding' },
  { id: 'AF-1140', name: 'Marry', email: 'marry@agga.io', position: 'Software Engineer', status: 'Active' },
  { id: 'AF-1101', name: 'Cherry', email: 'cherry@agga.io', position: 'System Operator', status: 'Onboarding' },

  { id: 'AF-1223', name: 'Minn', email: 'minn@agga.io', position: 'Product Owner', status: 'Active' },
  { id: 'AF-1876', name: 'Annn', email: 'annn@agga.io', position: 'Java Developer', status: 'Offboarding' },
  { id: 'AF-0845', name: 'Berry', email: 'berry@agga.io', position: 'Product Manager', status: 'Active' },
  { id: 'AF-1138', name: 'Jimin', email: 'jimin@agga.io', position: 'Tester', status: 'Onboarding' },
  { id: 'AF-1209', name: 'Luna', email: 'luna@agga.io', position: 'Data Analyst', status: 'Offboarding' },

  { id: 'AF-1109', name: 'Jungkook', email: 'jungkook@agga.io', position: 'System Admin', status: 'Active' },
  { id: 'AF-1078', name: 'Jhope', email: 'jhope@agga.io', position: 'Security Analyst', status: 'Onboarding' },
  { id: 'AF-1276', name: 'TaeTae', email: 'taetae@agga.io', position: 'Project Manager', status: 'Offboarding' },
  { id: 'AF-1034', name: 'Rapmon', email: 'rapmon@agga.io', position: 'Software Engineer', status: 'Active' },
  { id: 'AF-0056', name: 'Jinnnie', email: 'jinnnie@agga.io', position: 'Product Manager', status: 'Onboarding' },
];

const PAGE_SIZE = 5;

const UserManagement: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(employeesData.length / PAGE_SIZE);

  const startIndex = currentPage * PAGE_SIZE;
  const currentData = employeesData.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 font-sans text-slate-600">

      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-700">
          User Management
        </h1>

        <Link to="/add-employee">
          <button className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
            <UserPlus size={18} />
            Add Employee
          </button>
        </Link>
      </div>

      {/* FILTERS */}
      <div className="flex gap-4 rounded-t-xl border bg-white p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            className="w-full rounded-md border bg-slate-50 py-2 pl-10 pr-4 text-sm"
          />
        </div>

        <div className="relative w-48">
          <select className="w-full rounded-md border bg-slate-50 px-4 py-2 pr-10 text-sm">
            <option>All Status</option>
            <option>Active</option>
            <option>Onboarding</option>
            <option>Offboarding</option>
          </select>
          
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden border-x bg-white">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b bg-slate-50 text-xs font-bold uppercase text-slate-700">
              <th className="px-6 py-4">Employee ID</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Position</th>
              <th className="px-8 py-4">Status</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>

          <tbody>
            {currentData.map((emp) => (
              <tr key={emp.id} className="hover:bg-slate-50">
                <td className="px-6 py-5 text-sm">{emp.id}</td>
                <td className="px-6 py-5 text-sm">{emp.name}</td>
                <td className="px-6 py-5 text-sm">{emp.email}</td>
                <td className="px-6 py-5 text-sm">{emp.position}</td>

                <td className="px-8 py-5">
                  <span
                    className={`flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium
                    ${
                      emp.status === 'Active'
                        ? 'bg-green-50 text-green-700'
                        : emp.status === 'Onboarding'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-orange-50 text-orange-700'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full
                      ${
                        emp.status === 'Active'
                          ? 'bg-green-500'
                          : emp.status === 'Onboarding'
                          ? 'bg-blue-500'
                          : 'bg-orange-500'
                      }`}
                    />
                    {emp.status}
                  </span>
                </td>

                <td className="px-6 py-5 text-right">
                  <MoreVertical size={18} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between border bg-white p-4 text-sm">
        <div>
          Showing {startIndex + 1} to{" "}
          {Math.min(startIndex + PAGE_SIZE, employeesData.length)} of{" "}
          {employeesData.length}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="rounded border px-3 py-1 disabled:opacity-50"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`rounded border px-3 py-1 ${
                currentPage === i ? 'bg-blue-600 text-white' : ''
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
            }
            disabled={currentPage === totalPages - 1}
            className="rounded border px-3 py-1 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;