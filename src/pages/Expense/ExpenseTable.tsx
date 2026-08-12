"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { Loader2, ChevronDown, CheckCircle, XCircle } from 'lucide-react';
import { FiChevronUp, FiChevronDown, FiChevronLeft, FiChevronRight } from "react-icons/fi"; 
import { fetchExpenses as fetchExpensesAPI, updateExpenseStatus, deleteExpense } from "@/lib/apiService";
import { FaSearch } from 'react-icons/fa';
import { Input } from '@base-ui/react';
import { ExpenseDetailModal } from './ExpenseDetailModal';
import type { ExpenseDetailData } from './ExpenseDetailModal';
import { RiDeleteBinLine } from "react-icons/ri";
import type { Table } from "@tanstack/react-table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
interface ExpenseWithUser extends ExpenseDetailData {
  user?: {
    name?: string;
  } | null;
}

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

  const handleUpdateStatus = async (expense: ExpenseWithUser, newStatus: 'approved' | 'canceled') => {
    const targetId = expense.id || (expense as any).expense_id;
    if (!targetId) return;

    if (!window.confirm(`Are you sure you want to change this expense status to ${newStatus}?`)) return;

    let remark = "";
    if (newStatus === 'approved') {
      const userRemark = window.prompt("Enter a remark for approval (Optional):", "");
      if (userRemark === null) return; 
      remark = userRemark;
    }

    setActionLoadingId(targetId);
    try {
      await updateExpenseStatus(targetId, newStatus, remark);
      alert(`Expense status updated to ${newStatus} successfully!`);
      fetchExpenses(); 
    } catch (err: any) {
      console.error("Status Update Error:", err);
      alert(err?.message || `Failed to update status to ${newStatus}.`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteExpense = async (expense: ExpenseWithUser) => {
    const targetId = expense.id || (expense as any).expense_id;
    if (!targetId) return;

    if (!window.confirm("Are you sure you want to permanently delete this expense record?")) return;

    setActionLoadingId(targetId);
    try {
      await deleteExpense(targetId);
      alert("Expense deleted successfully!");
      fetchExpenses();
    } catch (err: any) {
      console.error("Delete Expense Error:", err);
      alert(err?.message || "Failed to delete the expense record.");
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm p-3 space-y-2 relative">
      
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
     <SelectTrigger className="w-full ...">
 
  <SelectValue placeholder="Select Status" />
</SelectTrigger>
        
      
     <SelectContent 
  className="bg-white border border-slate-200 rounded-xl shadow-lg" 
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
                    onClick={() => handleRowClick(expense)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
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
                          <Loader2 className="animate-spin text-slate-400 mx-2" size={16} />
                        ) : (
                          <>
                            {expense.status?.toLowerCase() !== 'approved' && 
                             expense.status?.toLowerCase() !== 'canceled' && 
                             expense.status?.toLowerCase() !== 'cancelled' && (
                              <>
                                {/* APPROVE BUTTON */}
                                <button 
                                  type="button"
                                  onClick={() => handleUpdateStatus(expense, 'approved')} 
                                  className="text-emerald-500 hover:text-emerald-700 active:scale-95 transition-all p-1.5 hover:bg-emerald-50 rounded-md"
                                  title="Approve Expense"
                                >
                                  <CheckCircle size={16} />
                                </button>

                                {/* CANCEL BUTTON */}
                                <button 
                                  type="button"
                                  onClick={() => handleUpdateStatus(expense, 'canceled')} 
                                  className="text-red-500 hover:text-red-700 active:scale-95 transition-all p-1.5 hover:bg-red-50 rounded-md"
                                  title="Cancel Expense"
                                >
                                  <XCircle size={16} />
                                </button>
                              </>
                            )}

                            {/* DELETE BUTTON */}
                            <button 
                              type="button"
                              onClick={() => handleDeleteExpense(expense)} 
                              className="text-red-600  active:scale-95 transition-all p-1.5 hover:bg-rose-50 rounded-md"
                              title="Delete permanently"
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
        close={false}
        onClose={() => setIsModalOpen(false)} 
        expense={selectedExpense} 
      />
    </div>
  );
};

export default ExpenseTable;
