import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  Search,
  UserPlus,
} from 'lucide-react';

import {
  FiChevronLeft,
  FiChevronRight,
  FiTrash2,
  FiX,
  FiCheckCircle,
} from "react-icons/fi";

import { FaEdit } from "react-icons/fa";
import { RiDeleteBin4Fill } from "react-icons/ri";

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
  
  { id: 'AF-1167', name: 'VeVe', email: 'veve@agga.io', position: 'System Admin', status: 'Active' },
  { id: 'AF-2026', name: 'Asia', email: 'asia@agga.io', position: 'Security Analyst', status: 'Active' },
  { id: 'AF-0980', name: 'Mainn', email: 'mainn@agga.io', position: 'Project Manager', status: 'Suspend' },
  { id: 'AF-5813', name: 'Babe', email: 'babe@agga.io', position: 'Software Engineer', status: 'Active' },
  { id: 'AF-1265', name: 'Wendy', email: 'wendy@agga.io', position: 'System Operator', status: 'Active' },
  
  { id: 'AF-0078', name: 'Bada', email: 'bada@agga.io', position: 'Product Owner', status: 'Active' },
  { id: 'AF-1098', name: 'Reyhi', email: 'reyhi@agga.io', position: 'Java Developer', status: 'Suspend' },
  { id: 'AF-2678', name: 'Honeyj', email: 'honeyj@agga.io', position: 'Product Manager', status: 'Active' },
  { id: 'AF-0386', name: 'Kyoka', email: 'kyoka@agga.io', position: 'Tester', status: 'Suspend' },
  { id: 'AF-0021', name: 'Uwa', email: 'uwa@agga.io', position: 'Data Analyst', status: 'Suspend' },

  { id: 'AF-3487', name: 'Aung', email: 'aung@agga.io', position: 'System Admin', status: 'Active' },
  { id: 'AF-2310', name: 'Kaung', email: 'kaung@agga.io', position: 'Security Analyst', status: 'Suspend' },
  { id: 'AF-7654', name: 'Sett', email: 'sett@agga.io', position: 'Project Manager', status: 'Suspend' },
  { id: 'AF-2015', name: 'Khaing', email: 'khaing@agga.io', position: 'Software Engineer', status: 'Active' },
  { id: 'AF-7235', name: 'Myat', email: 'myat@agga.io', position: 'Product Manager', status: 'Suspend' },
];

const pageSize = 5;

const UserManagement: React.FC = () => {

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(0);
  const [data, setData] = useState(employeesData);

  const [search, setSearch] = useState("");

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    targetId: null as string | null,
  });

  const [showToast, setShowToast] = useState(false);

  const handleDeleteTrigger = (id: string) => {
    setDeleteModal({
      isOpen: true,
      targetId: id,
    });
  };

  const handleConfirmDelete = () => {
    if (deleteModal.targetId) {
      setData((prev) =>
        prev.filter((item) => item.id !== deleteModal.targetId)
      );

      setDeleteModal({
        isOpen: false,
        targetId: null,
      });

      setShowToast(true);
    }
  };

  React.useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleEdit = (item: Employee) => {
    navigate("/add-employee", {
      state: { editItem: item },
    });
  };

  const filteredData = data.filter((emp) => {
  return (
    emp.name.toLowerCase().includes(search.toLowerCase()) ||
    emp.email.toLowerCase().includes(search.toLowerCase()) ||
    emp.id.toLowerCase().includes(search.toLowerCase()) ||
    emp.status.toLowerCase().includes(search.toLowerCase())
  );
});

  // ✅ PAGINATION FIXED (IMPORTANT PART)
  const totalPages = Math.ceil(filteredData.length / pageSize);

  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;

  const currentPaginatedData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-1 font-sans text-slate-800">

      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black">User Management</h1>

        <Link to="/add-employee">
          <button className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
            <UserPlus size={18} />
            Add Employee
          </button>
        </Link>
      </div>

      {/* FILTERS */}
      <div className="flex gap-4 rounded-t-xl bg-white p-4 border border-slate-100 border-b-0">

        {/* SEARCH */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700" size={18} />

          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(0);
            }}
            className="w-full rounded-md border border-slate-400 bg-slate-50 py-2 pl-10 pr-4 text-sm"
          />
        </div>

        {/* STATUS FILTER (unchanged) */}
        <div className="relative w-48">
  <select
    value={search}
    onChange={(e) => {
      setSearch(e.target.value);
      setCurrentPage(0);
    }}
    className="w-full rounded-md border border-slate-400 bg-slate-50 px-4 py-2 text-sm"
  >
    <option value="">All Status</option>
    <option value="Active">Active</option>
    <option value="Suspend">Suspend</option>
  </select>
</div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden border border-slate-100 bg-white">
        <table className="w-full text-left">

          <thead>
            <tr className="bg-blue-400 text-white text-sm font-bold">
              <th className="px-6 py-4">Employee ID</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Position</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-300">
            {currentPaginatedData.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-100">

                <td className="px-6 py-5 text-sm">{emp.id}</td>
                <td className="px-6 py-5 text-sm font-medium">{emp.name}</td>
                <td className="px-6 py-5 text-sm">{emp.email}</td>

                <td className="px-6 py-5">
                  <span className="text-xs bg-slate-100 px-3 py-1 rounded">
                    {emp.position}
                  </span>
                </td>

                <td className="px-6 py-5">
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    emp.status === 'Active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {emp.status}
                  </span>
                </td>

                {/* ACTION */}
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-2">

                    <button
                      onClick={() => handleEdit(emp)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit size={18} />
                    </button>

                    <button
                      onClick={() => handleDeleteTrigger(emp.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <RiDeleteBin4Fill size={18} />
                    </button>

                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
<div className="flex items-center justify-end gap-2 py-4">

  {/* PREVIOUS */}
  <button
    onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
    disabled={currentPage === 0}
    className="
      flex h-10 w-10 items-center justify-center
      rounded-xl border border-gray-400
      bg-white text-black
      transition hover:bg-gray-100
      disabled:opacity-50
    "
  >
    <FiChevronLeft size={18} />
  </button>

  {/* PAGE NUMBERS */}
  {Array.from({ length: totalPages }).map((_, index) => {
    const showFirst = index === 0;
    const showLast = index === totalPages - 1;
    const showNearCurrent =
      index >= currentPage - 1 &&
      index <= currentPage + 1;

    if (showFirst || showLast || showNearCurrent) {
      return (
        <button
          key={index}
          onClick={() => setCurrentPage(index)}
          className={`
            flex h-10 w-10 items-center justify-center
            rounded-xl border text-sm font-medium
            transition
            ${
              currentPage === index
                ? "bg-blue-300 hover:bg-blue-400 text-white border-none"
                      : "bg-slate-200"
            }
          `}
        >
          {index + 1}
        </button>
      );
    }

    if (
      index === currentPage - 2 ||
      index === currentPage + 2
    ) {
      return (
        <span
          key={index}
          className="px-1 text-lg font-medium text-gray-500"
        >
          ...
        </span>
      );
    }

    return null;
  })}

  {/* NEXT */}
  <button
    onClick={() =>
      setCurrentPage((p) =>
        Math.min(totalPages - 1, p + 1)
      )
    }
    disabled={currentPage === totalPages - 1}
    className="
      flex h-10 w-10 items-center justify-center
      rounded-xl border border-gray-400
      bg-white text-black
      transition hover:bg-gray-100
      disabled:opacity-50
    "
  >
    <FiChevronRight size={18} />
  </button>

</div>
{/* DELETE MODAL */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">

            {/* CLOSE */}
            <div className="flex justify-end">
              <button
                onClick={() =>
                  setDeleteModal({
                    isOpen: false,
                    targetId: null,
                  })
                }
              >
                <FiX size={20} />
              </button>
            </div>

            {/* CONTENT */}
            <div className="mt-2 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                <FiTrash2
                  className="text-red-600"
                  size={24}
                />
              </div>

              <h2 className="text-lg font-semibold text-slate-800">
                Delete Employee
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Are you sure you want to delete this employee?
              </p>
            </div>

            {/* BUTTONS */}
            <div className="mt-6 flex gap-3">

              <button
                onClick={() =>
                  setDeleteModal({
                    isOpen: false,
                    targetId: null,
                  })
                }
                className="flex-1 rounded-lg border border-slate-300 py-2 text-sm font-medium hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmDelete}
                className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>

            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {showToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 rounded-lg bg-slate-900 px-4 py-3 text-white shadow-xl">

          <FiCheckCircle
            className="text-green-400"
            size={20}
          />

          <div>
            <p className="text-sm font-semibold">
              Delete Successful
            </p>

            <p className="text-xs text-slate-400">
              Employee removed successfully.
            </p>
          </div>

        </div>
      )}

      

    </div>
  );
};

export default UserManagement;