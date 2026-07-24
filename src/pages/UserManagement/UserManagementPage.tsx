"use client"; 

import { IoCloudDownloadOutline } from "react-icons/io5"; 
import React, { useEffect, useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { Employee } from '../../types/employee';
import { normalizeImageSource } from '../../lib/utils';
import UserManagementEdit from '../../components/features/UserManagement/UserManagementEdit';
import { apiFetch } from '../../lib/api';
import { UserManagementSearch } from "@/components/features/UserManagement/UserManagementSearchBox";
import jsPDF from "jspdf";
import { UserManagementFilter } from "@/components/features/UserManagement/UserMangementFilter";
import autoTable from "jspdf-autotable";
import { UserPlus } from 'lucide-react'; 
import {
  type ColumnDef,
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  FiChevronLeft,
  FiChevronRight,
  FiTrash2,
  FiX,
  FiCheckCircle,
  FiChevronUp,
  FiChevronDown,
} from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";

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
    user.image ||             
    user.preview_url ||
    user.image_url ||
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
  role: user.roles?.[0]?.name || user.status || "staff", 
  joinedDate: user.joined_date || "-",
  leftDate: user.left_date || "-",
  phone: user.phone_number || "-",
});

const USER_ENDPOINT = "/user"; 

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [data, setData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [sortColumn, setSortColumn] = useState<keyof Employee | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    targetId: null as string | null,
  });

  const [showToast, setShowToast] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem('token') || '7|N5Vq58chJXHoyy7GqjuTEPH4CHJGLF6IplgxGtIQ2187ee5c';
      if (!localStorage.getItem('token')) {
        localStorage.setItem('token', token);
      }

      const response = await apiFetch(USER_ENDPOINT, {
        method: 'GET',
      });

      const payload = response.data ? response : await response.json?.().catch(() => response);
      const users = payload?.data?.data || payload?.data || payload || [];
      
      if (Array.isArray(users)) {
        setData(users.map(mapApiUserToEmployee));
      } else {
        console.error("Unexpected data format:", payload);
        setData([]);
      }
    } catch (err: any) {
      console.error(err);
      if (err?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/', { replace: true });
        return;
      }
      setError("Cannot load users from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [location.key]); 

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
        
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");
        
        const currentToken = localStorage.getItem('token') || '261|UKYS7uARyAxUtGBmPZJVTmphmMp8EQOGCcHo9Qsi8993df01';
        myHeaders.append("Authorization", `Bearer ${currentToken}`);

        
        const rawPayload = JSON.stringify({
          "id": targetId
        });

        const requestOptions = {
          method: 'DELETE',
          headers: myHeaders,
          body: rawPayload,
          redirect: 'follow' as RequestRedirect
        };

        
        const response = await fetch(`http://192.168.100.186:1011/api/user/${targetId}`, requestOptions);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Server responded with status ${response.status}`);
        }

        
        setData((prev) => prev.filter((item) => String(item.id) !== String(targetId)));
        setShowToast(true);

      } catch (err: any) {
        console.error('Delete user error:', err);
        setError(err?.message || 'Failed to delete user.');
      } finally {
        setLoading(false);
        setDeleteModal({ isOpen: false, targetId: null });
      }
    };

  const handleEdit = (item: Employee) => {
    const imageValue = (item.profileImage === "-" || !item.profileImage) ? "" : item.profileImage;

    
    const apiUserFormat = {
      id: item.id,
      employee_id: item.employee_id || "",
      name: item.name || "",
      role: item.role || "staff", 
      email: item.email || "",
      position: item.position === "-" ? "" : item.position,
      phone_number: item.phone === "-" ? "" : item.phone, 
      joined_date: (item.joinedDate === "-" || !item.joinedDate) ? "" : item.joinedDate, 
      left_date: (item.leftDate === "-" || !item.leftDate) ? "" : item.leftDate,
      status: item.status?.toLowerCase() || "active",
      image: imageValue, 
      password: "" 
    };

    navigate("/add-employee", {
      state: { editItem: apiUserFormat },
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

  const columns = useMemo<ColumnDef<Employee>[]>(() => [
    {
      accessorKey: "status",
      filterFn: (row, columnId, filterValue) =>
        String(row.getValue(columnId) ?? "").toLowerCase() ===
        String(filterValue ?? "").toLowerCase(),
    },
  ], []);

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, columnFilters },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, _columnId, filterValue) => {
      const searchTerm = String(filterValue ?? "").toLowerCase();
      return [row.original.name, row.original.email, row.original.employee_id]
        .some((value) => String(value ?? "").toLowerCase().includes(searchTerm));
    },
  });

  const filteredData = table.getFilteredRowModel().rows.map((row) => row.original);

  useEffect(() => {
    setCurrentPage(0);
  }, [globalFilter, columnFilters]);

  const sortedData = useMemo(() => {
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

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Employee Report", 14, 20);
    
    const tableData = sortedData.map((item: Employee, index) => [
      index + 1,
      item.employee_id,
      item.name,
      item.email,
      item.position,
      item.status
    ]);

    autoTable(doc, {
      startY: 30,
      head: [['No', 'Employee ID', 'Name', 'Email', 'Position', 'Status']],
      body: tableData,
      headStyles: { fillColor: [30, 64, 175] }, 
      theme: 'striped'
    });

    doc.save("Employee_Management_Report.pdf");
  };

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = currentPage * pageSize;
  const currentPaginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 p-6 relative bg-[#e9e5ff] min-h-screen font-sans text-slate-800">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#7C3AED]">User Management</h1>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-[#7C3AED] border border-slate-300 text-white rounded-lg transition-colors text-lg font-medium shadow-sm flex items-center gap-2 hover:bg-purple-700"
          >
            <IoCloudDownloadOutline size={20} />
          </button>

          <Link to="/add-employee">
            <button className="flex items-center gap-2 rounded-md bg-[#7C3AED] px-4 py-2 text-sm text-white hover:bg-purple-700 transition-colors">
              <UserPlus size={18} />
              Add Employee
            </button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-300 p-4 shadow-sm space-y-4">
        <div className="flex gap-4 rounded-xl bg-white p-3 border border-slate-200 shadow-sm items-center">
          <div className="relative flex-1">
            <UserManagementSearch 
               value={globalFilter ?? ""} 
               onChange={setGlobalFilter} 
             />
           </div>
          <div className="relative w-48">
            <UserManagementFilter table={table} />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-[#A78BFA]">
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

                <TableHead className="text-white font-semibold py-3.5 text-sm">Status</TableHead>
                <TableHead className="text-white font-semibold py-3.5 text-sm text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {!error && currentPaginatedData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-slate-400 text-sm">No users found.</TableCell>
                </TableRow>
              )}

              {error && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-red-600 text-sm">{error}</TableCell>
                </TableRow>
              )}

              {currentPaginatedData.map((emp, index) => (
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
                    <span className="text-xs bg-slate-100 px-3 py-1 rounded">{emp.position}</span>
                  </TableCell>
                  <TableCell className="py-3.5 text-slate-700 text-sm">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      (emp.status || "").toLowerCase() === 'active'
                        ? 'bg-green-100 text-green-700'
                        : (emp.status || "").toLowerCase() === 'suspended'
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
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        <RiDeleteBinLine className="w-5 h-5" />
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
                      className={currentPage === index ? "bg-blue-800 hover:bg-blue-700 text-white border-none" : "bg-white border-slate-200"}
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
