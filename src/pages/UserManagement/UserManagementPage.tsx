import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { Employee } from '../../types/employee';
import UserManagementEdit from '../../components/features/UserManagement/UserManagementEdit';

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

import { RiDeleteBin4Fill } from "react-icons/ri";

const pageSize = 5;

type ApiUser = {
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
  roles?: Array<{
    name: string;
  }>;
};

const formatStatus = (status: string) =>
  status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : "-";

const mapApiUserToEmployee = (user: ApiUser): Employee => ({
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
});

const API_URL = "http://192.168.100.185:1010/api/user";

const UserManagement: React.FC = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const [currentPage, setCurrentPage] = useState(0);
  const [data, setData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    targetId: null as string | null,
  });

  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem('token') || '119|6UBfGxzFSshZIwJu69IWBcmbq9gIb9opQwlL2eX51d4a76c8';
        if (!localStorage.getItem('token')) {
          localStorage.setItem('token', token);
        }

        const response = await fetch(API_URL, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/', { replace: true });
            return;
          }

          throw new Error(`API Error: ${response.status}`);
        }

        const payload = await response.json();
        const users = payload?.data?.data || payload?.data || [];
        setData(users.map(mapApiUserToEmployee));
      } catch (err) {
        console.error(err);
        setError("Cannot load users from server.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [location.key, navigate]);

  const handleDeleteTrigger = (id: string) => {
    setDeleteModal({
      isOpen: true,
      targetId: id
    });
  };

  const handleConfirmDelete = () => {
    if (deleteModal.targetId) {
      setData((prev) =>
        prev.filter((item) => item.employeeId !== deleteModal.targetId)
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
    const searchTerm = search.toLowerCase();
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm) ||
      emp.email.toLowerCase().includes(searchTerm) ||
      emp.employeeId.toLowerCase().includes(searchTerm);

    const matchesStatus =
      !statusFilter || emp.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

 
  const totalPages = Math.ceil(filteredData.length / pageSize);

  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;

  const currentPaginatedData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-1 font-sans text-slate-800">

      
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-black">User Management</h1>

        <Link to="/add-employee">
          <button className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
            <UserPlus size={18} />
            Add Employee
          </button>
        </Link>
      </div>

      
      <div className="flex gap-4 rounded-t-xl bg-white p-4 border border-slate-100 border-b-0">

        
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

        
        <div className="relative w-48">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(0);
            }}
            className="w-full rounded-md border border-slate-400 bg-slate-50 px-4 py-2 text-sm"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="resigned">Resigned</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border-slate-100 bg-white">
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
            {loading && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">
                  Loading users...
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-red-600">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && currentPaginatedData.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">
                  No users found.
                </td>
              </tr>
            )}

            {!loading && !error && currentPaginatedData.map((emp) => (
              <tr
                key={emp.employeeId}
                className="hover:bg-gray-100 cursor-pointer"
                onClick={() => navigate(`/employee/${emp.employeeId}`)}
              >

                <td className="px-6 py-5 text-sm">{emp.employeeId}</td>
                <td className="px-6 py-5 text-sm font-medium">{emp.name}</td>
                <td className="px-6 py-5 text-sm">{emp.email}</td>

                <td className="px-6 py-5">
                  <span className="text-xs bg-slate-100 px-3 py-1 rounded">
                    {emp.position}
                  </span>
                </td>

                <td className="px-6 py-5">
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    emp.status.toLowerCase() === 'active'
                      ? 'bg-green-100 text-green-700'
                      : emp.status.toLowerCase() === 'suspended'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {emp.status}
                  </span>
                </td>

                
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-2">

                    <UserManagementEdit onEdit={() => handleEdit(emp)} />

                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDeleteTrigger(emp.employeeId);
                      }}
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

      
<div className="flex items-center justify-end gap-2 py-4">

  
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
        Math.min(Math.max(totalPages - 1, 0), p + 1)
      )
    }
    disabled={totalPages === 0 || currentPage === totalPages - 1}
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

      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">

            
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
