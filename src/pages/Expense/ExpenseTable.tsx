"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { Loader2, CheckCircle, XCircle, X } from 'lucide-react';
import { FiChevronUp, FiChevronDown, FiChevronLeft, FiChevronRight } from "react-icons/fi"; 
import { fetchExpenses as fetchExpensesAPI, updateExpenseStatus, deleteExpense } from "@/lib/apiService";
import { FaSearch } from 'react-icons/fa';
import { IoCloudDownloadOutline } from "react-icons/io5";
import { Input } from '@base-ui/react';
import { ExpenseDetailModal } from './ExpenseDetailModal';
import type { ExpenseDetailData } from './ExpenseDetailModal';
import { RiDeleteBinLine } from "react-icons/ri";
import { hasStoredPermission } from "@/lib/utils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
type ExpenseWithUser = ExpenseDetailData;

type SortableColumns = 'employee' | 'title' | 'expense_date' | 'cost';

export const ExpenseTable: React.FC = () => {
  
  const [expenses, setExpenses] = useState<ExpenseWithUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string>('');

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const [sortColumn, setSortColumn] = useState<SortableColumns | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  const [selectedExpense, setSelectedExpense] = useState<ExpenseDetailData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [approvalTarget, setApprovalTarget] = useState<ExpenseWithUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ExpenseWithUser | null>(null);
  const [approvalRemark, setApprovalRemark] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const canViewExpenses = hasStoredPermission("view-expenses");
  const canUpdateExpenses = hasStoredPermission("update-expenses");
  const canDeleteExpenses = hasStoredPermission("delete-expenses");

  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const storedUser = localStorage.getItem("user_name") || localStorage.getItem("user");
      if (storedUser) setCurrentUserName(storedUser);

      const response = await fetchExpensesAPI();

      if (response && response.success) {
        setExpenses(response.data);
      } else {
        setError(response?.message || "Failed to fetch expenses.");
      }
    } catch (err: any) {
      console.error("Fetch Expenses Error:", err);
      setError(err?.message || "An error occurred while loading data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleRowClick = (expense: ExpenseDetailData) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(null), 2500);
  };

  const handleUpdateStatus = async (expense: ExpenseWithUser, newStatus: 'approved' | 'canceled', remark = "") => {
    const targetId = expense.id || (expense as any).expense_id;
    if (!targetId) return;

    setActionLoadingId(targetId);
    setToastMessage(null);
    try {
      await updateExpenseStatus(targetId, newStatus, remark);
      showToast(`Expense status updated to ${newStatus} successfully.`);
      setApprovalTarget(null);
      setApprovalRemark("");
      fetchExpenses(); 
    } catch (err: any) {
      console.error("Status Update Error:", err);
      showToast(err?.message || `Failed to update status to ${newStatus}.`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const openApprovalCard = (expense: ExpenseWithUser) => {
    setApprovalTarget(expense);
    setApprovalRemark("");
    setToastMessage(null);
  };

  const closeApprovalCard = () => {
    if (actionLoadingId) return;
    setApprovalTarget(null);
    setApprovalRemark("");
  };

  const openDeleteCard = (expense: ExpenseWithUser) => {
    setDeleteTarget(expense);
    setToastMessage(null);
  };

  const closeDeleteCard = () => {
    if (actionLoadingId) return;
    setDeleteTarget(null);
  };

  const getValue = (value: any) => {
    if (value === null || value === undefined || value === "") return "-";
    return value;
  };

  const getEmployeeName = (expense: ExpenseWithUser) =>
    expense.user?.name || currentUserName || "Unknown Employee";

  const getEmployeeId = (expense: ExpenseWithUser) =>
    expense.user?.employee_id || (expense as any).employee_id || "-";

  const getAssetName = (expense: ExpenseWithUser) =>
    expense.asset?.name || (expense as any).asset_name || "-";

  const getAssetCode = (expense: ExpenseWithUser) =>
    expense.asset?.asset_code || (expense as any).asset_code || "-";

  const getSerialNumber = (expense: ExpenseWithUser) =>
    (expense as any).serial_number || (expense.asset as any)?.serial_number || "-";

  const getCategoryName = (expense: ExpenseWithUser) => {
    const category = (expense as any).category;
    if (typeof category === "string") return category || "-";
    return category?.name || (expense as any).asset?.category?.name || "-";
  };

  const handleExportExpensePDF = (expense: ExpenseWithUser, rowNumber: number) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Expense Report", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["Field", "Value"]],
      body: [
        ["No", rowNumber],
        ["Employee ID", getEmployeeId(expense)],
        ["Employee Name", getEmployeeName(expense)],
        ["Title", getValue(expense.title)],
        ["Type", getValue(expense.expense_type)],
        ["Cost (MMK)", Number(expense.cost || 0).toLocaleString()],
        ["Date", getValue(expense.expense_date)],
        ["Status", getValue(expense.status)],
        ["Description", getValue(expense.description)],
        ["Remark", getValue(expense.remark)],
        ["Asset Name", getAssetName(expense)],
        ["Asset Code", getAssetCode(expense)],
        ["Category", getCategoryName(expense)],
        ["Serial No.", getSerialNumber(expense)],
        ["Approved By", getValue(expense.approved_by)],
        ["Created At", getValue(expense.created_at)],
      ],
      headStyles: { fillColor: [124, 58, 237] },
      styles: { fontSize: 10, cellPadding: 3, overflow: "linebreak" },
      columnStyles: {
        0: { cellWidth: 45, fontStyle: "bold" },
        1: { cellWidth: 130 },
      },
      theme: "striped",
    });

    const fileSafeTitle = (expense.title || "expense").replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "");
    doc.save(`Expense_${fileSafeTitle || rowNumber}.pdf`);
  };

  const handleDeleteExpense = async () => {
    if (!deleteTarget) return;

    const expense = deleteTarget;
    const targetId = expense.id || (expense as any).expense_id;
    if (!targetId) return;

    setActionLoadingId(targetId);
    setToastMessage(null);
    try {
      await deleteExpense(targetId);
      showToast("Expense deleted successfully.");
      setDeleteTarget(null);
      fetchExpenses();
    } catch (err: any) {
      console.error("Delete Expense Error:", err);
      showToast(err?.message || "Failed to delete the expense record.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSort = (column: SortableColumns) => {
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
    setCurrentPage(1);
  };

  const filteredExpenses = expenses.filter(item => {
    const employeeName = (item.user?.name || currentUserName || "").toLowerCase();
    const title = (item.title || "").toLowerCase();
    const type = (item.expense_type || "").toLowerCase();
    const matchesSearch = 
      employeeName.includes(searchQuery.toLowerCase()) || 
      title.includes(searchQuery.toLowerCase()) ||
      type.includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || item.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const sortedExpenses = useMemo(() => {
    const sortableData = [...filteredExpenses];
    if (sortColumn) {
      sortableData.sort((a, b) => {
        let aValue: string | number = "";
        let bValue: string | number = "";

        if (sortColumn === 'employee') {
          aValue = (a.user?.name || currentUserName || "").toLowerCase();
          bValue = (b.user?.name || currentUserName || "").toLowerCase();
        } else if (sortColumn === 'title') {
          aValue = (a.title || "").toLowerCase();
          bValue = (b.title || "").toLowerCase();
        } else if (sortColumn === 'expense_date') {
          aValue = (a.expense_date || "").toLowerCase();
          bValue = (b.expense_date || "").toLowerCase();
        } else if (sortColumn === 'cost') {
          aValue = Number(a.cost || 0);
          bValue = Number(b.cost || 0);
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableData;
  }, [filteredExpenses, sortColumn, sortDirection, currentUserName]);

  const totalItems = sortedExpenses.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedExpenses.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const getStatusStyles = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'canceled' || s === 'cancelled') {
      return 'bg-red-50 text-red-500 px-3 py-1 text-xs font-medium rounded-full inline-block border border-red-200 text-center min-w-[80px] capitalize';
    }
    if (s === 'requested' || s === 'pending') {
      return 'bg-blue-50 text-blue-500 px-3 py-1 text-xs font-medium rounded-full inline-block border border-blue-200 text-center min-w-[80px] capitalize';
    }
    return 'bg-emerald-50 text-emerald-600 px-3 py-1 text-xs font-medium rounded-full inline-block border border-emerald-200 text-center min-w-[80px] capitalize';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7C3AED]"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm p-3 space-y-2 relative">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg animate-fade-in">
          <CheckCircle className="text-emerald-400" size={16} />
          <span className="text-xs font-medium">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            aria-label="Close notification"
          >
            <X size={14} />
          </button>
        </div>
      )}
      
      <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm p-3 space-y-2 relative">
        <div className="flex flex-col sm:flex-row gap-4 items-center w-full">
          
          <div className="flex flex-col sm:flex-row gap-4 items-center w-full">
  {/* SEARCH INPUT */}
  <div className="relative flex-1">
    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
    <Input 
      className="w-full rounded-md border border-slate-400 bg-slate-50 py-1 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
      placeholder="Search by name, date, title..." 
      value={searchQuery} 
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)} 
    />
  </div>

  {/* STATUS SELECT */}
  <div className="w-full sm:w-48">
    <Select
    value={statusFilter === 'All' ? "" : statusFilter}
    onValueChange={(value) => setStatusFilter(value || 'All')}
      
    >
     <SelectTrigger className="w-full border-slate-300 bg-slate-50 text-slate-700 focus-visible:border-[#A78BFA] focus-visible:ring-[#EDE9FE]">
 
  <SelectValue placeholder="Select Status" />
</SelectTrigger>
        
      
     <SelectContent 
  className="bg-white border border-[#DDD6FE] rounded-xl shadow-lg" 
  sideOffset={2}//to set distance from trigger
  alignItemWithTrigger={false} 
>
        <SelectItem value="All">All Status</SelectItem>
        <SelectItem value="requested">Requested</SelectItem>
        <SelectItem value="approved">Approved</SelectItem>
        <SelectItem value="canceled">Canceled</SelectItem>
      </SelectContent>
    </Select>
  </div>
</div>
           
        </div>
      </div>
      
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col mt-2">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse table-auto">
            <thead>
              <tr className="bg-[#A78BFA] text-white text-[13px] font-semibold border-b select-none">
                <th className="py-3 px-4 w-16">No.</th>
                
                <th className="py-3 px-4 cursor-pointer transition-colors" onClick={() => handleSort('employee')}>
                  <div className="flex items-center gap-1.5">
                    Employee
                    <div className="flex flex-col">
                      <FiChevronUp size={12} className={sortColumn === 'employee' && sortDirection === 'asc' ? "text-white" : "text-white/40"} />
                      <FiChevronDown size={12} className={sortColumn === 'employee' && sortDirection === 'desc' ? "text-white" : "text-white/40"} />
                    </div>
                  </div>
                </th>

                <th className="py-3 px-4 cursor-pointer  transition-colors" onClick={() => handleSort('title')}>
                  <div className="flex items-center gap-1.5">
                    Expense Title
                    <div className="flex flex-col">
                      <FiChevronUp size={12} className={sortColumn === 'title' && sortDirection === 'asc' ? "text-white" : "text-white/40"} />
                      <FiChevronDown size={12} className={sortColumn === 'title' && sortDirection === 'desc' ? "text-white" : "text-white/40"} />
                    </div>
                  </div>
                </th>

                <th className="py-3 px-4 cursor-pointer  transition-colors" onClick={() => handleSort('expense_date')}>
                  <div className="flex items-center gap-1.5">
                    Date
                    <div className="flex flex-col">
                      <FiChevronUp size={12} className={sortColumn === 'expense_date' && sortDirection === 'asc' ? "text-white" : "text-white/40"} />
                      <FiChevronDown size={12} className={sortColumn === 'expense_date' && sortDirection === 'desc' ? "text-white" : "text-white/40"} />
                    </div>
                  </div>
                </th>

                <th className="py-3 px-4 text-center">Type</th>

                <th className="py-3 px-4 cursor-pointer  transition-colors" onClick={() => handleSort('cost')}>
                  <div className="flex items-center gap-1">
                    Cost (MMK)
                    <div className="flex flex-col">
                      <FiChevronUp size={12} className={sortColumn === 'cost' && sortDirection === 'asc' ? "text-white" : "text-white/40"} />
                      <FiChevronDown size={12} className={sortColumn === 'cost' && sortDirection === 'desc' ? "text-white" : "text-white/40"} />
                    </div>
                  </div>
                </th>

                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 w-28 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[13px] text-slate-600">
              
              {!loading && error && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-red-500 font-medium">
                    {error}
                  </td>
                </tr>
              )}

              {!loading && !error && totalItems === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-medium">
                    No expense records found.
                  </td>
                </tr>
              )}

              {!loading && !error && currentItems.map((expense, index) => {
                const currentId = expense.id || (expense as any).expense_id;
                const isActionLoading = actionLoadingId === currentId;

                return (
                  <tr 
                    key={currentId || index} 
                    onClick={() => {
                      if (canViewExpenses) handleRowClick(expense);
                    }}
                    className={`hover:bg-slate-50/80 transition-colors ${canViewExpenses ? "cursor-pointer" : "cursor-not-allowed opacity-75"}`}
                  >
                    <td className="py-3.5 px-4 font-normal text-slate-400">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {expense.user?.name || currentUserName || "Unknown Employee"}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {expense.title}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {expense.expense_date}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="text-slate-600 capitalize">
                        {expense.expense_type}
                      </span>
                    </td>
                    <td className="py-3.5 px-8 font-normal text-slate-700">
                      {Number(expense.cost).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={getStatusStyles(expense.status)}>
                        {expense.status === 'approved' ? 'Approved' : expense.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                        
                        {isActionLoading ? (
                          <Loader2 className="animate-spin text-[#7C3AED] mx-2" size={16} />
                        ) : (
                          <>
                            {expense.status?.toLowerCase() !== 'approved' && 
                             expense.status?.toLowerCase() !== 'canceled' && 
                             expense.status?.toLowerCase() !== 'cancelled' && (
                              <>
                                {/* APPROVE BUTTON */}
                                <button 
                                  type="button"
                                  onClick={() => {
                                    if (canUpdateExpenses) openApprovalCard(expense);
                                  }} 
                                  disabled={!canUpdateExpenses}
                                  className="text-[#7C3AED] hover:text-purple-700 active:scale-95 transition-all p-1.5 hover:bg-emerald-50 rounded-md disabled:cursor-not-allowed disabled:opacity-40"
                                  title={canUpdateExpenses ? "Approve Expense" : "You do not have permission to update expenses"}
                                >
                                  <CheckCircle size={16} />
                                </button>

                                {/* CANCEL BUTTON */}
                                <button 
                                  type="button"
                                  onClick={() => {
                                    if (canUpdateExpenses) handleUpdateStatus(expense, 'canceled');
                                  }} 
                                  disabled={!canUpdateExpenses}
                                  className="text-red-500 hover:text-red-700 active:scale-95 transition-all p-1.5 hover:bg-red-50 rounded-md disabled:cursor-not-allowed disabled:opacity-40"
                                  title={canUpdateExpenses ? "Cancel Expense" : "You do not have permission to update expenses"}
                                >
                                  <XCircle size={16} />
                                </button>
                              </>
                            )}

                            {/* DELETE BUTTON */}
                            <button
                              type="button"
                              onClick={() => {
                                if (canViewExpenses) handleExportExpensePDF(expense, indexOfFirstItem + index + 1);
                              }}
                              disabled={!canViewExpenses}
                              className="text-[#7C3AED] hover:text-purple-700 active:scale-95 transition-all p-1.5 hover:bg-purple-50 rounded-md disabled:cursor-not-allowed disabled:opacity-40"
                              title={canViewExpenses ? "Export this expense" : "You do not have permission to view expenses"}
                            >
                              <IoCloudDownloadOutline size={16} />
                            </button>

                            <button 
                              type="button"
                              onClick={() => {
                                if (canDeleteExpenses) openDeleteCard(expense);
                              }} 
                              disabled={!canDeleteExpenses}
                              className="text-red-600 active:scale-95 transition-all p-1.5 hover:bg-rose-50 rounded-md disabled:cursor-not-allowed disabled:opacity-40"
                              title={canDeleteExpenses ? "Delete permanently" : "You do not have permission to delete expenses"}
                            >
                              <RiDeleteBinLine size={16} />
                            </button>
                          </>
                        )}
                        
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 🔢 FIXED PAGINATION DESIGN ── */}
      <div className="flex items-center justify-between px-2 py-1 bg-white rounded-lg border border-slate-200 p-2 shadow-sm">
        <div className="text-xs text-slate-500 font-medium">
          Page {currentPage} of {totalPages} ({totalItems} total expenses)
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <FiChevronLeft size={16} />
          </Button>

          <div className="flex gap-1 items-center">
            {Array.from({ length: totalPages }).map((_, index) => {
              const page = index + 1;

              if (
                index === 0 ||
                index === totalPages - 1 ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className={currentPage === page ? "bg-[#A78BFA] text-white border-none" : "bg-slate-200"}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                );
              }

              if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page} className="px-2 text-gray-500">...</span>;
              }

              return null;
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <FiChevronRight size={16} />
          </Button>
        </div>
      </div>

      {/* VIEW DETAIL COMPONENT DRAWER OVERLAY */}
      <ExpenseDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        expense={selectedExpense} 
      />

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-50 text-red-600">
                <RiDeleteBinLine size={22} />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-slate-900">Delete Expense</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Are you sure you want to permanently delete this expense record?
                </p>
                <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
                  {deleteTarget.title || "Untitled expense"}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeDeleteCard}
                disabled={Boolean(actionLoadingId)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteExpense}
                disabled={Boolean(actionLoadingId)}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {actionLoadingId ? <Loader2 className="animate-spin text-white" size={16} /> : <RiDeleteBinLine size={16} />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {approvalTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e9e5ff] text-[#7C3AED]">
                <CheckCircle size={22} />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-slate-900">Approve Expense</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Confirm approval for {approvalTarget.title || "this expense"}.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Remark
              </label>
              <textarea
                value={approvalRemark}
                onChange={(event) => setApprovalRemark(event.target.value)}
                placeholder="Optional approval remark"
                className="min-h-24 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]"
              />
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeApprovalCard}
                disabled={Boolean(actionLoadingId)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus(approvalTarget, "approved", approvalRemark)}
                disabled={Boolean(actionLoadingId)}
                className="inline-flex items-center gap-2 rounded-lg bg-[#7C3AED] px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:opacity-60"
              >
                {actionLoadingId ? <Loader2 className="animate-spin text-white" size={16} /> : <CheckCircle size={16} />}
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseTable;
