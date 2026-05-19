import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  Search,
  UserPlus,
  MoreVertical,
} from 'lucide-react';

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  status: 'Active' | 'Suspend';
}

const employeesData: Employee[] = [
  { id: 'AF-1024', name: 'Wang', email: 'wang@agga.io', position: 'System Admin', status: 'Active' },
  { id: 'AF-2051', name: 'Xing', email: 'xing@agga.io', position: 'Security Analyst', status: 'Active' },
  { id: 'AF-0982', name: 'Alex', email: 'alex@agga.io', position: 'Project Manager', status: 'Suspend' },
  { id: 'AF-1140', name: 'Marry', email: 'marry@agga.io', position: 'Software Engineer', status: 'Active' },
  { id: 'AF-1101', name: 'Cherry', email: 'cherry@agga.io', position: 'System Operator', status: 'Active' },
  { id: 'AF-1223', name: 'Minn', email: 'minn@agga.io', position: 'Product Owner', status: 'Active' },
  { id: 'AF-1876', name: 'Annn', email: 'annn@agga.io', position: 'Java Developer', status: 'Suspend' },
  { id: 'AF-0845', name: 'Berry', email: 'berry@agga.io', position: 'Product Manager', status: 'Active' },
  { id: 'AF-1138', name: 'Jimin', email: 'jimin@agga.io', position: 'Tester', status: 'Suspend' },
  { id: 'AF-1209', name: 'Luna', email: 'luna@agga.io', position: 'Data Analyst', status: 'Suspend' },
  { id: 'AF-1109', name: 'Jungkook', email: 'jungkook@agga.io', position: 'System Admin', status: 'Active' },
  { id: 'AF-1078', name: 'Jhope', email: 'jhope@agga.io', position: 'Security Analyst', status: 'Suspend' },
  { id: 'AF-1276', name: 'TaeTae', email: 'taetae@agga.io', position: 'Project Manager', status: 'Suspend' },
  { id: 'AF-1034', name: 'Rapmon', email: 'rapmon@agga.io', position: 'Software Engineer', status: 'Active' },
  { id: 'AF-0056', name: 'Jinnnie', email: 'jinnnie@agga.io', position: 'Product Manager', status: 'Suspend' },
];

const pageSize = 5;

const UserManagement: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(employeesData.length / pageSize);

  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;

  const currentPaginatedData = employeesData.slice(
    startIndex,
    endIndex
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-1 font-sans text-slate-800">

      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black">
          User Management
        </h1>

        <Link to="/add-employee">
          <button className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700">
            <UserPlus size={18} />
            Add Employee
          </button>
        </Link>
      </div>

      {/* FILTERS */}
      <div className="flex gap-4 rounded-t-xl bg-white p-4 border border-slate-200 border-b-0">

        {/* SEARCH */}
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700"
            size={18}
          />

          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            className="w-full rounded-xs border text-gray-700 border-slate-500 bg-slate-50 py-2 pl-10 pr-4 text-md outline-none focus:border-blue-400"
          />
        </div>

        {/* STATUS FILTER */}
        <div className="relative w-48">
          <select className="w-full rounded-md border border-slate-500 bg-slate-50 px-4 py-2 pr-10 text-sm outline-none focus:border-blue-400">
            <option>All Status</option>
            <option>Active</option>
            <option>Suspend</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden border border-slate-500 bg-white">
        <table className="w-full text-left">

          {/* TABLE HEADER */}
          <thead>
            <tr className="bg-blue-400 text-xs font-bold uppercase text-white">
              <th className="px-6 py-4">Employee ID</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Position</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody className="divide-y divide-slate-500">
            {currentPaginatedData.map((emp) => (
              <tr
                key={emp.id}
                className="transition-colors hover:bg-gray-100"
              >
                {/* EMPLOYEE ID */}
                <td className="px-6 py-5 text-sm text-slate-700">
                  {emp.id}
                </td>

                {/* NAME */}
                <td className="px-6 py-5 text-sm font-medium text-slate-700">
                  {emp.name}
                </td>

                {/* EMAIL */}
                <td className="px-6 py-5 text-sm text-slate-700">
                  {emp.email}
                </td>

                {/* POSITION */}
                <td className="px-6 py-5">
                  <span className="rounded-md  px-3 py-1 text-xs font-medium text-gray-700">
                    {emp.position}
                  </span>
                </td>

                {/* STATUS */}
                <td className="px-6 py-5">
                  <span
                    className={`flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium
                    ${
                      emp.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full
                      ${
                        emp.status === 'Active'
                          ? 'bg-green-500'
                          : 'bg-orange-500'
                      }`}
                    />

                    {emp.status}
                  </span>
                </td>

                {/* ACTION */}
                <td className="px-6 py-5 text-right">
                  <button className="rounded-md p-1 hover:bg-slate-100">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between rounded-b-xl border border-t-0 border-slate-200 bg-white p-4 text-sm text-slate-500">

        {/* LEFT TEXT */}
        <div>
          Showing {startIndex + 1} to{" "}
          {Math.min(endIndex, employeesData.length)} of{" "}
          {employeesData.length} employees
        </div>

        {/* RIGHT CONTROLS */}
        <div className="flex items-center gap-2">

          {/* PREV */}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.max(0, prev - 1))
            }
            disabled={currentPage === 0}
            className="flex h-9 items-center justify-center rounded-md border border-slate-500 bg-white px-3 text-black transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiChevronLeft size={16} />
          </button>

          {/* PAGE NUMBERS */}
          <div className="flex gap-1">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`h-9 rounded-md px-3 text-md font-medium transition-colors
                ${
                  currentPage === index
                    ? 'bg-blue-500 text-white'
                    : 'border border-slate-600 bg-white text-black hover:bg-slate-50'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {/* NEXT */}
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(totalPages - 1, prev + 1)
              )
            }
            disabled={currentPage === totalPages - 1}
            className="flex h-9 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-black transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;