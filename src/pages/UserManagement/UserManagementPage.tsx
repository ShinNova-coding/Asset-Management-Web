import React from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  UserPlus,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  status: 'Active' | 'Onboarding' | 'Offboarding';
}

const employees: Employee[] = [
  {
    id: 'AF-1024',
    name: 'Wang',
    email: 'wang@agga.io',
    position: 'System Admin',
    status: 'Active',
    
  },
  {
    id: 'AF-2051',
    name: 'Xing',
    email: 'xing@agga.io',
    position: 'Security Analyst',
    status: 'Onboarding',
  
  },
  {
    id: 'AF-0982',
    name: 'Alex',
    email: 'alex@agga.io',
    position: 'Project Manager',
    status: 'Offboarding',
    
  },
  {
    id: 'AF-1140',
    name: 'Marry',
    email: 'marry@agga.io',
    position: 'Software Engineer',
    status: 'Active',
    
  },
  {
    id: 'AF-1101',
    name: 'Cherry',
    email: 'cherry@agga.io',
    position: 'System Operator',
    status: 'Onboarding',
    
  },
];

const UserManagement: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 font-sans text-slate-600">
      {/* Header Section */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-700">
          User Management
        </h1>

        <Link to="/add-employee">
          <button className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-600">
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
            {employees.map((emp) => (
              <tr
                key={emp.id}
                className="transition-colors hover:bg-slate-50"
              >
                {/* Employee ID */}
                <td className="px-6 py-5 text-sm text-slate-700">
                  {emp.id}
                </td>

                {/* Name */}
                  <td className="px-6 py-5">
                    <div>
                      <div className="text-sm text-slate-700">
                          {emp.name}
                      </div>
                    </div>
                    </td>
        

                

                {/* Email */}
                <td className="px-6 py-5 text-sm  text-slate-700">
                  {emp.email}
                </td>

                {/* Position */}
                <td className="px-6 py-5">
                  <span className="rounded-md bg-blue-50 text-xs font-medium text-[#4F75FF]">
                    {emp.position}
                  </span>
                </td>

                {/* Status */}
                <td className="px-6 py-5">
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

                

                {/* Action */}
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

      {/* Footer / Pagination */}
      <div className="flex items-center justify-between rounded-b-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
        <div>Showing 4 of 128 employees</div>

        <div className="flex items-center gap-1">
          <button className="rounded p-1 text-slate-400 hover:bg-slate-100">
            <ChevronLeft size={18} />
          </button>

          <button className="flex h-8 w-8 items-center justify-center rounded bg-[#4F75FF] text-white">
            1
          </button>

          <button className="flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-slate-100">
            2
          </button>

          <button className="flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-slate-100">
            3
          </button>

          <button className="rounded p-1 text-slate-400 hover:bg-slate-100">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;