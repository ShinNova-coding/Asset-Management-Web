"use client"

import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { Employee } from '../../types/employee';
import { normalizeImageSource } from '../../lib/utils';
import UserManagementEdit from '../../components/features/UserManagement/UserManagementEdit';
import { apiFetch } from '../../lib/api';

import { Search, UserPlus } from 'lucide-react';
import {
  FiChevronLeft,
  FiChevronRight,
  FiTrash2,
  FiX,
  FiCheckCircle,
  FiChevronUp,
  FiChevronDown,
} from "react-icons/fi";
import { RiDeleteBin4Fill } from "react-icons/ri";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

const pageSize = 5;

type ApiUser = {
  id: string;
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
  image?: string | null;
  media?: Array<{
    original_url?: string | null;
    preview_url?: string | null;
  }>;
  roles?: Array<{
    name: string;
  }>;
};

const formatStatus = (status: string) =>
  status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : "-";

const mapApiUserToEmployee = (user: ApiUser): Employee => ({
  id: user.id,
  profileImage: normalizeImageSource(
    user.preview_url ||
      user.image_url ||
      user.image ||
      user.media?.[0]?.preview_url ||
      user.media?.[0]?.original_url ||
      null
  ),
  employee_id: user.employee_id,
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

const API_URL = "http://192.168.100.179:1010/api/user";

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentPage, setCurrentPage] = useState(0);
  const [data, setData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Sorting states
  const [sortColumn, setSortColumn] = useState<keyof Employee | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

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
        const token = localStorage.getItem('token') || '66|5TalCJ8YD62FDIoYKzJy0w7XosM72oLkVWdPFt4xf8ff92b9';
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

  const handleConfirmDelete = async () => {
    const targetId = deleteModal.targetId; 
    if (!targetId) return;

    setLoading(true);
    setError("");

    try {
      await apiFetch(`/user/${targetId}`, {
        method: 'DELETE',
      });

      setData((prev) => prev.filter((item) => item.id !== targetId));
      setShowToast(true);
    } catch (err: any) {
      console.error('Delete user error:', err);
      setError(err?.message || 'Failed to delete user.');
    } finally {
      setLoading(false);
      setDeleteModal({ isOpen: false, targetId: null });
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

  const handleSort = (column: keyof Employee) => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortColumn(null);
        setSortDirection('asc');
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    setCurrentPage(0);
  };

  const filteredData = data.filter((emp) => {
    const searchTerm = search.toLowerCase();
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm) ||
      emp.email.toLowerCase().includes(searchTerm) ||
      emp.employee_id.toLowerCase().includes(searchTerm);

    const matchesStatus =
      !statusFilter || emp.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Apply sorting dynamically before pagination
  const sortedData = React.useMemo(() => {
    const sortableData = [...filteredData];
    if (sortColumn) {
      sortableData.sort((a, b) => {
        const aValue = String(a[sortColumn] || "").toLowerCase();
        const bValue = String(b[sortColumn] || "").toLowerCase();

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableData;
  }, [filteredData, sortColumn, sortDirection]);

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPaginatedData = sortedData.slice(startIndex, endIndex);

  return (
    <div className="w-full space-y-6 p-6 relative bg-[#F8FAFC] min-h-screen font-sans text-slate-800">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-500">User Management</h1>

        <Link to="/add-employee">
          <button className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 transition-colors">
            <UserPlus size={18} />
            Add Employee
          </button>
        </Link>
      </div>

      {/* CARD CONTAINER FOR FILTERS AND TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        {/* FILTERS */}
        <div className="flex gap-4 items-center">
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
              className="w-full rounded-md border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative w-48">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(0);
              }}
              className="w-full rounded-md border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="resigned">Resigned</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-blue-400">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="text-white font-semibold py-3.5 text-sm w-12">No</TableHead>
                
                <TableHead 
                  className="text-white font-semibold py-3.5 text-sm cursor-pointer select-none hover:bg-blue-500/50" 
                  onClick={() => handleSort('employee_id')}
                >
                  <div className="flex items-center gap-2">
                    Employee ID
                    <div className="flex flex-col">
                      <FiChevronUp size={12} className={sortColumn === 'employee_id' && sortDirection === 'asc' ? "text-white" : "text-white/40"} />
                      <FiChevronDown size={12} className={sortColumn === 'employee_id' && sortDirection === 'desc' ? "text-white" : "text-white/40"} />
                    </div>
                  </div>
                </TableHead>

                <TableHead 
                  className="text-white font-semibold py-3.5 text-sm cursor-pointer select-none hover:bg-blue-500/50" 
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2">
                    Name
                    <div className="flex flex-col">
                      <FiChevronUp size={12} className={sortColumn === 'name' && sortDirection === 'asc' ? "text-white" : "text-white/40"} />
                      <FiChevronDown size={12} className={sortColumn === 'name' && sortDirection === 'desc' ? "text-white" : "text-white/40"} />
                    </div>
                  </div>
                </TableHead>

                <TableHead 
                  className="text-white font-semibold py-3.5 text-sm cursor-pointer select-none hover:bg-blue-500/50" 
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center gap-2">
                    Email
                    <div className="flex flex-col">
                      <FiChevronUp size={12} className={sortColumn === 'email' && sortDirection === 'asc' ? "text-white" : "text-white/40"} />
                      <FiChevronDown size={12} className={sortColumn === 'email' && sortDirection === 'desc' ? "text-white" : "text-white/40"} />
                    </div>
                  </div>
                </TableHead>

                <TableHead 
                  className="text-white font-semibold py-3.5 text-sm cursor-pointer select-none hover:bg-blue-500/50" 
                  onClick={() => handleSort('position')}
                >
                  <div className="flex items-center gap-2">
                    Position
                    <div className="flex flex-col">
                      <FiChevronUp size={12} className={sortColumn === 'position' && sortDirection === 'asc' ? "text-white" : "text-white/40"} />
                      <FiChevronDown size={12} className={sortColumn === 'position' && sortDirection === 'desc' ? "text-white" : "text-white/40"} />
                    </div>
                  </div>
                </TableHead>

               <TableHead className="text-white font-semibold py-3.5 text-sm">
                <div className="flex items-center gap-2">
                  Status
                </div>
                </TableHead>

                <TableHead className="text-white font-semibold py-3.5 text-sm text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-slate-500 text-sm">
                    Loading ...
                  </TableCell>
                </TableRow>
              )}

              {!loading && error && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-red-600 text-sm">
                    {error}
                  </TableCell>
                </TableRow>
              )}

              {!loading && !error && currentPaginatedData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-slate-400 text-sm">
                    No users found.
                  </TableCell>
                </TableRow>
              )}

              {!loading && !error && currentPaginatedData.map((emp, index) => (
                <TableRow
                  key={emp.id ?? emp.employee_id}
                  className="transition-colors hover:bg-slate-50/80 border-b border-slate-100 cursor-pointer"
                  onClick={() => navigate(`/employee/${emp.id ?? emp.employee_id}`)}
                >
                  <TableCell className="py-3.5 text-slate-700 text-sm font-medium">{startIndex + index + 1}</TableCell>
                  <TableCell className="py-3.5 text-slate-700 text-sm">{emp.employee_id}</TableCell>
                  <TableCell className="py-3.5 text-slate-700 text-sm font-medium">{emp.name}</TableCell>
                  <TableCell className="py-3.5 text-slate-700 text-sm">{emp.email}</TableCell>

                  <TableCell className="py-3.5 text-slate-700 text-sm">
                    <span className="text-xs bg-slate-100 px-3 py-1 rounded">
                      {emp.position}
                    </span>
                  </TableCell>

                  <TableCell className="py-3.5 text-slate-700 text-sm">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      emp.status.toLowerCase() === 'active'
                        ? 'bg-green-100 text-green-700'
                        : emp.status.toLowerCase() === 'suspended'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {emp.status}
                    </span>
                  </TableCell>

                  <TableCell className="py-3.5 text-slate-700 text-sm text-right" data-actions-cell="true">
                    <div className="flex justify-end gap-2 items-center" onClick={(e) => e.stopPropagation()}>
                      <UserManagementEdit onEdit={() => handleEdit(emp)} />
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDeleteTrigger(emp.id ?? emp.employee_id);
                        }}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <RiDeleteBin4Fill size={18} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-between bg-slate-50/50 rounded-xl border border-slate-100 p-3 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">
            Page {currentPage + 1} of {totalPages || 1} ({filteredData.length} total employees)
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
            >
              <FiChevronLeft size={16} />
            </Button>

            <div className="flex gap-1 items-center">
              {Array.from({ length: totalPages }).map((_, index) => {
                const showFirst = index === 0;
                const showLast = index === totalPages - 1;
                const showNearCurrent = index >= currentPage - 1 && index <= currentPage + 1;

                if (showFirst || showLast || showNearCurrent) {
                  return (
                    <Button
                      key={index}
                      variant={currentPage === index ? "default" : "outline"}
                      size="sm"
                      className={currentPage === index ? "bg-blue-500 hover:bg-blue-600 text-white border-none" : "bg-white border-slate-200"}
                      onClick={() => setCurrentPage(index)}
                    >
                      {index + 1}
                    </Button>
                  )
                }
                if (index === currentPage - 2 || index === currentPage + 2) {
                  return <span key={index} className="px-2 text-gray-500">...</span>
                }
                return null;
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(Math.max(totalPages - 1, 0), p + 1))}
              disabled={totalPages === 0 || currentPage === totalPages - 1}
            >
              <FiChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex justify-end">
              <button onClick={() => setDeleteModal({ isOpen: false, targetId: null })}>
                <FiX size={20} />
              </button>
            </div>
            
            <div className="mt-2 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                <FiTrash2 className="text-red-600" size={24} />
              </div>
              <h3 className="text-base font-bold text-slate-900">Delete Employee</h3>
              <p className="text-xs text-slate-500 mt-2">Are you sure you want to delete this employee record?</p>
            </div>

            <div className="flex justify-end gap-2.5 pt-2 mt-6">
              <button 
                onClick={() => setDeleteModal({ isOpen: false, targetId: null })} 
                className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmDelete} 
                className="flex-1 py-2 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg animate-fade-in">
          <FiCheckCircle className="text-emerald-400" size={16} />
          <span className="text-xs font-medium">Employee removed successfully.</span>
          <button onClick={() => setShowToast(false)}><FiX size={14} /></button>
        </div>
      )}
    </div>
  );
};

export default UserManagement;