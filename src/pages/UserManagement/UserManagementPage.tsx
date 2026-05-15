import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  UserPlus,
  MoreVertical,
  ChevronDown,
} from 'lucide-react';
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

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

const pageSize = 5;

const UserManagement: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);

  // 1. Dynamically calculate total pages based on the data length
  const totalPages = Math.ceil(employeesData.length / pageSize); 

  // 2. Slice the dataset down to exactly 5 items per current page window index
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPaginatedData = employeesData.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 font-sans text-slate-600">
      {/* Header Section */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-700">
          User Management
        </h1>

        <Link to="/add-employee">
          <button className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700">
            <UserPlus size={18} />
            Add Employee
          </button>
        </Link>
      </div>

      {/* Filters Section */}
      <div className="flex gap-4 rounded-t-xl border border-slate-200 bg-white p-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name, email, or employee ID..."
            className="w-full rounded-md border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="relative w-48">
          <select className="w-full appearance-none rounded-md border border-slate-200 bg-slate-50 px-4 py-2 pr-10 text-sm focus:outline-none">
            <option>All Status</option>
            <option>Active</option>
            <option>Onboarding</option>
            <option>Offboarding</option>
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden border-x border-slate-200 bg-white">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[13px] font-bold uppercase tracking-wider text-slate-700">
              <th className="px-6 py-4">Employee ID</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Position</th>
              <th className="px-8 py-4">Status</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {/* 3. Render currentPaginatedData instead of all employeesData directly */}
            {currentPaginatedData.map((emp) => (
              <tr
                key={emp.id}
                className="transition-colors hover:bg-slate-50"
              >
                <td className="px-6 py-5 text-sm text-slate-700">{emp.id}</td>
                <td className="px-6 py-5 text-sm text-slate-700">{emp.name}</td>
                <td className="px-6 py-5 text-sm text-slate-700">{emp.email}</td>
                <td className="px-6 py-5">
                  <span className="rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600">
                    {emp.position}
                  </span>
                </td>
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
                  <button className="text-slate-400 hover:text-slate-600">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination Section */}
      <div className="flex items-center justify-between rounded-b-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
        {/* Left Aligned Description matching exact slice count status */}
        <div>
          Showing {startIndex + 1} to {Math.min(endIndex, employeesData.length)} of {employeesData.length} employees
        </div>

        {/* Right Aligned Control Panel Set matching Black Outlined Border Variant */}
        <div className="flex justify-end space-x-2 py-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            className="flex items-center gap-1 rounded-md border border-black bg-white px-3 h-9 text-xs font-medium text-black shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-50 disabled:border-slate-200 disabled:text-slate-400"
          >
            <FiChevronLeft size={16} />
            
          </button>

          <div className="flex gap-1 justify-end">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`rounded-md px-3 h-9 text-xs font-medium transition-colors ${
                  currentPage === index
                    ? "bg-blue-300 hover:bg-blue-400 text-white border-none font-semibold"
                    : "border border-black bg-white text-black hover:bg-slate-50"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage === totalPages - 1}
            className="flex items-center gap-1 rounded-md border border-black bg-white px-3 h-9 text-xs font-medium text-black shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-50 disabled:border-slate-200 disabled:text-slate-400"
          >
            
            <FiChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;