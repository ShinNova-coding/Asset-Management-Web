"use client"

import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Loader2, X, Save, Search, ChevronDown } from 'lucide-react';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin4Fill } from "react-icons/ri";
import { FiChevronUp, FiChevronDown } from "react-icons/fi"; // Sorting Icons ထည့်သွင်းခြင်း
import { apiFetch } from "@/lib/api";

// Detail Modal ကို Import ခေါ်ယူခြင်း
import { ExpenseDetailModal } from './ExpenseDetailModal';
import type { ExpenseDetailData } from './ExpenseDetailModal';

interface ExpenseWithUser extends ExpenseDetailData {
  user?: {
    name?: string;
  } | null;
}

// Sort ဖြစ်နိုင်မယ့် Column Column Keys သတ်မှတ်ခြင်း
type SortableColumns = 'employee' | 'title' | 'expense_date' | 'cost';

export const ExpenseTable: React.FC = () => {
  // ── STATES ──────────────────────────────────────────────────────
  const [expenses, setExpenses] = useState<ExpenseWithUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string>('');

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Sorting States
  const [sortColumn, setSortColumn] = useState<SortableColumns | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Pagination States
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  // View Detail Modal States
  const [selectedExpense, setSelectedExpense] = useState<ExpenseDetailData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Edit Inline Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingExpense, setEditingExpense] = useState<Partial<ExpenseWithUser> | null>(null);
  const [editSubmitting, setEditSubmitting] = useState<boolean>(false);

  // ── FETCH EXPENSES FROM API ─────────────────────────────────────
  const fetchExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const storedUser = localStorage.getItem("user_name") || localStorage.getItem("user");
      if (storedUser) setCurrentUserName(storedUser);

      const response = await apiFetch("/expense", {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
        }
      });

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

  // ── ROW & VIEW HANDLERS ───────────────────────────────────────
  const handleRowClick = (expense: ExpenseDetailData) => {
    setSelectedExpense(expense);
    setIsModalOpen(true);
  };

  // ── 📝 EDIT HANDLERS ──────────────────────────────────────────
  const handleEditClick = (expense: ExpenseWithUser) => {
    setEditingExpense({
      expense_id: expense.id || (expense as any).expense_id, 
      id: expense.id || (expense as any).expense_id,
      title: expense.title,
      cost: expense.cost,
      expense_date: expense.expense_date,
      expense_type: expense.expense_type,
      status: expense.status,
      users_id: expense.users_id,
      voucher: (expense as any).voucher || ""
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExpense || !editingExpense.id) return;

    setEditSubmitting(true);
    try {
      const payload = {
        expense_id: editingExpense.id,
        users_id: editingExpense.users_id,
        cost: Number(editingExpense.cost),
        expense_date: editingExpense.expense_date,
        title: editingExpense.title,
        expense_type: editingExpense.expense_type,
        status: editingExpense.status,
        voucher: editingExpense.voucher || "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
      };

      await apiFetch(`/expense/${editingExpense.id}`, {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
        },
        body: JSON.stringify(payload)
      });

      alert("Expense updated successfully!");
      setIsEditModalOpen(false);
      setEditingExpense(null);
      fetchExpenses();
    } catch (err: any) {
      console.error("Update Error:", err);
      alert(err?.message || "Failed to update expense record.");
    } finally {
      setEditSubmitting(false);
    }
  };

  // ── 🗑️ DELETE HANDLER ──────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!id || id === "undefined") {
      alert("Error: Expense ID is missing or undefined.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this expense record?")) return;

    try {
      await apiFetch(`/expense/expense_id`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
        },
        body: JSON.stringify({ expense_id: id })
      });
      
      alert("Expense deleted successfully!");
      fetchExpenses();
    } catch (err: any) {
      console.error("Delete Error:", err);
      alert(err?.message || "Failed to delete expense record.");
    }
  };

  // ── SORT HANDLER LOGIC ─────────────────────────────────────────
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

  // ── SEARCH & FILTER LOGIC ──────────────────────────────────────
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

  // ── SORTING EXECUTION LOGIC ────────────────────────────────────
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

  // ── PAGINATION LOGIC ──────────────────────────────────────────
  const totalItems = sortedExpenses.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedExpenses.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // UI Status Badges matching from the reference image
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

 return (
    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm p-3 space-y-2 relative">
      {/* ── 🔍 SEARCH & FILTER CONTROLS (Maintenance Header UI ပုံစံအတိုင်း ပြင်ဆင်ထားသည်) ────────────────────────────── */}
<div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm p-3 space-y-2 relative">
  <div className="flex flex-col sm:flex-row gap-4 items-center w-full">
    
    {/* Search Input Box */}
    <div className="relative flex-1 w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input
        type="text"
        placeholder="Search by name, date, title..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full rounded-md border border-slate-300 bg-slate-50 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-700 shadow-3xs"
      />
    </div>

    {/* Status Filter Dropdown */}
    <div className="relative w-full sm:w-48">
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="w-full pl-3 pr-10 py-2 bg-slate-55 border border-slate-300 rounded-md text-sm font-normal text-slate-700 appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer shadow-3xs"
      >
        <option value="All">All Status</option>
        <option value="requested">Requested</option>
        <option value="approved">Approved</option>
        <option value="canceled">Canceled</option>
      </select>
      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
    </div>

  </div>
</div>
      {/* ── 📊 CARD 1: MAIN TABLE CONTAINER ────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col mt-2">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse table-auto">
            <thead>
              <tr className="bg-[#3b82f6] text-white text-[13px] font-semibold border-b border-blue-600 select-none">
                <th className="py-3 px-4 w-16">No.</th>
                
                {/* Employee Header (Sortable) */}
                <th className="py-3 px-4 cursor-pointer hover:bg-blue-600/50 transition-colors" onClick={() => handleSort('employee')}>
                  <div className="flex items-center gap-1.5">
                    Employee
                    <div className="flex flex-col">
                      <FiChevronUp size={12} className={sortColumn === 'employee' && sortDirection === 'asc' ? "text-white" : "text-white/40"} />
                      <FiChevronDown size={12} className={sortColumn === 'employee' && sortDirection === 'desc' ? "text-white" : "text-white/40"} />
                    </div>
                  </div>
                </th>

                {/* Expense Title Header (Sortable) */}
                <th className="py-3 px-4 cursor-pointer hover:bg-blue-600/50 transition-colors" onClick={() => handleSort('title')}>
                  <div className="flex items-center gap-1.5">
                    Expense Title
                    <div className="flex flex-col">
                      <FiChevronUp size={12} className={sortColumn === 'title' && sortDirection === 'asc' ? "text-white" : "text-white/40"} />
                      <FiChevronDown size={12} className={sortColumn === 'title' && sortDirection === 'desc' ? "text-white" : "text-white/40"} />
                    </div>
                  </div>
                </th>

                {/* Date Header (Sortable) */}
                <th className="py-3 px-4 cursor-pointer hover:bg-blue-600/50 transition-colors" onClick={() => handleSort('expense_date')}>
                  <div className="flex items-center gap-1.5">
                    Date
                    <div className="flex flex-col">
                      <FiChevronUp size={12} className={sortColumn === 'expense_date' && sortDirection === 'asc' ? "text-white" : "text-white/40"} />
                      <FiChevronDown size={12} className={sortColumn === 'expense_date' && sortDirection === 'desc' ? "text-white" : "text-white/40"} />
                    </div>
                  </div>
                </th>

                <th className="py-3 px-4 text-center">Type</th>

                {/* Cost Header (Sortable) */}
                <th className="py-3 px-4 cursor-pointer hover:bg-blue-600/50 transition-colors" onClick={() => handleSort('cost')}>
                  <div className="flex items-center gap-1.5">
                    Cost (MMK)
                    <div className="flex flex-col">
                      <FiChevronUp size={12} className={sortColumn === 'cost' && sortDirection === 'asc' ? "text-white" : "text-white/40"} />
                      <FiChevronDown size={12} className={sortColumn === 'cost' && sortDirection === 'desc' ? "text-white" : "text-white/40"} />
                    </div>
                  </div>
                </th>

                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 w-24 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[13px] text-slate-600">
              {loading && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin text-[#3b82f6]" size={18} />
                      <span className="font-medium text-slate-500">Loading expenses...</span>
                    </div>
                  </td>
                </tr>
              )}

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

              {!loading && !error && currentItems.map((expense, index) => (
                <tr 
                  key={expense.id || index} 
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
                  <td className="py-3.5 px-4 font-normal text-slate-700">
                    {Number(expense.cost).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={getStatusStyles(expense.status)}>
                      {expense.status === 'approved' ? 'Approved' : expense.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button 
                        type="button"
                        onClick={() => handleEditClick(expense)} 
                        className="text-[#3b82f6] hover:text-blue-700 active:scale-95 transition-all p-2"
                        title="Edit Expense"
                      >
                        <FaEdit size={18} />
                      </button>

                      <button 
                        type="button"
                        onClick={() => {
                          const deleteId = expense.id || (expense as any).expense_id;
                          handleDelete(deleteId);
                        }} 
                        className="text-red-500 hover:text-red-600 active:scale-95 transition-all p-2"
                        title="Delete Expense"
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
      </div>

      {/* ── 📄 CARD 2: SEPARATED PAGINATION ────────────────── */}
      <div className="flex items-center justify-between px-2 py-1 bg-white rounded-lg border border-slate-200 p-2 shadow-sm mt-2">
        <div className="text-xs text-slate-500 font-medium pl-2">
          Page {currentPage} of {totalPages} ({totalItems} total records)
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            disabled={currentPage === 1 || loading}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-3 disabled:opacity-50 disabled:pointer-events-none cursor-pointer text-slate-600"
          >
            <ChevronLeft size={16} />
          </button>
          
          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`w-6 h-6 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  currentPage === page 
                    ? 'bg-[#3b82f6] text-white shadow-3xs' 
                    : 'text-slate-600 bg-white border border-slate-300 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            );
          })}

          <button 
            type="button"
            disabled={currentPage === totalPages || loading}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-3 disabled:opacity-50 disabled:pointer-events-none cursor-pointer text-slate-600"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* ── 📝 EDIT MODAL OVERLAY ─────────────────────────────────── */}
      {isEditModalOpen && editingExpense && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-xl border border-slate-200 overflow-hidden transform transition-all">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-800">Edit Expense Record</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100">
                <X size={16} />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-5 space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Expense Title</label>
                <input 
                  type="text" 
                  required
                  value={editingExpense.title || ''} 
                  onChange={(e) => setEditingExpense({...editingExpense, title: e.target.value})}
                  className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Cost (MMK)</label>
                  <input 
                    type="number" 
                    required
                    value={editingExpense.cost ?? ''} 
                    onChange={(e) => setEditingExpense({...editingExpense, cost: Number(e.target.value)})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>
                
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Expense Date</label>
                  <input 
                    type="text" 
                    placeholder="YYYY-MM-DD"
                    required
                    value={editingExpense.expense_date || ''} 
                    onChange={(e) => setEditingExpense({...editingExpense, expense_date: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Expense Type</label>
                  <select 
                    value={editingExpense.expense_type || 'claim'} 
                    onChange={(e) => setEditingExpense({...editingExpense, expense_type: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="claim">Claim</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">Status</label>
                  <select 
                    value={editingExpense.status || 'requested'} 
                    onChange={(e) => setEditingExpense({...editingExpense, status: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="requested">Requested</option>
                    <option value="approved">Approved</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-3.5 flex justify-end gap-2 border-t border-slate-200">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)} 
                  className="px-3 py-1.5 border border-slate-300 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={editSubmitting}
                  className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 disabled:opacity-50"
                >
                  {editSubmitting ? <Loader2 className="animate-spin" size={14}/> : <Save size={14}/>}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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