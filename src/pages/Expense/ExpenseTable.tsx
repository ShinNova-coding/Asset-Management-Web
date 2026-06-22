"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader2, X, Save, Search, ChevronDown } from 'lucide-react';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin4Fill } from "react-icons/ri";
import { apiFetch } from "@/lib/api";

// Detail Modal ကို Import ခေါ်ယူခြင်း
import { ExpenseDetailModal } from './ExpenseDetailModal';
import type { ExpenseDetailData } from './ExpenseDetailModal';

interface ExpenseWithUser extends ExpenseDetailData {
  user?: {
    name?: string;
  } | null;
}

export const ExpenseTable: React.FC = () => {
  // ── STATES ──────────────────────────────────────────────────────
  const [expenses, setExpenses] = useState<ExpenseWithUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string>('');

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

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

  // ── PAGINATION LOGIC ──────────────────────────────────────────
  const totalItems = filteredExpenses.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredExpenses.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Status Styles mapping based on Screenshot 2026-06-22 164232.png
  const getStatusStyles = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'canceled' || s === 'cancelled') {
      return 'bg-red-50 text-red-500 px-4 py-1.5 text-xs font-semibold rounded-full inline-block min-w-[85px] text-center capitalize';
    }
    if (s === 'requested' || s === 'pending') {
      return 'bg-[#fef3c7] text-[#d97706] px-4 py-1.5 text-xs font-semibold rounded-full inline-block min-w-[85px] text-center capitalize';
    }
    return 'bg-[#e6f9f0] text-[#22c55e] px-4 py-1.5 text-xs font-semibold rounded-full inline-block min-w-[85px] text-center capitalize';
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-3 bg-[#f8fafc] border border-slate-200/60 rounded-[24px] shadow-xs font-sans antialiased text-slate-700 space-y-5">
      
      {/* ── 🔍 SEARCH & FILTER CONTROLS ────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2  text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#fafafa] border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 transition-all placeholder:text-slate-400 text-slate-600"
          />
        </div>

        <div className="relative w-full sm:w-52">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-400 transition-all cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="requested">Requested</option>
            <option value="approved">Approved</option>
            <option value="canceled">Canceled</option>
          </select>
          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {/* ── 📊 TABLE CARD CONTAINER ────────────────────────────────── */}
      <div className="bg-white border border-slate-200/70 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[80px]">
            <thead>
              <tr className="bg-[#4da1ff] text-white text-[14px] font-semibold tracking-wide">
                <th className="py-2.5 px-3.5 w-16">No</th>
                <th className="py-2.5 px-3.5">Employee</th>
                <th className="py-2.5 px-3.5">Expense Title</th>
                <th className="py-2.5 px-3.5">Date</th>
                <th className="py-2.5 px-3.5 text-center">Type</th>
                <th className="py-2.5 px-3.5">Cost (MMK)</th>
                <th className="py-2.5 px-3.5 text-center">Status</th>
                <th className="py-2.5 px-3.5 w-24 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[14px]">
              {loading && (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin text-[#4da1ff]" size={22} />
                      <span className="font-medium text-slate-500">Loading expenses...</span>
                    </div>
                  </td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-red-500 font-medium">
                    {error}
                  </td>
                </tr>
              )}

              {!loading && !error && totalItems === 0 && (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400 font-medium">
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
                  <td className="py-4.5 px-6 text-slate-600 font-medium">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="py-4.5 px-6 font-semibold text-slate-700">
                    {expense.user?.name || currentUserName || "Unknown Employee"}
                  </td>
                  <td className="py-4.5 px-6 font-medium text-slate-600">
                    {expense.title}
                  </td>
                  <td className="py-4.5 px-6 text-slate-500">
                    {expense.expense_date}
                  </td>
                  <td className="py-4.5 px-6 text-center">
                    <span className="bg-[#f1f5f9] text-slate-500 text-[12px] font-medium px-3 py-1.5 rounded-md capitalize">
                      {expense.expense_type}
                    </span>
                  </td>
                  <td className="py-4.5 px-6 font-bold text-slate-700">
                    {Number(expense.cost).toLocaleString()}
                  </td>
                  <td className="py-4.5 px-6 text-center">
                    <span className={getStatusStyles(expense.status)}>
                      {expense.status}
                    </span>
                  </td>
                  <td className="py-4.5 px-6 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation(); 
                          handleEditClick(expense);
                        }} 
                        className="text-[#4da1ff] hover:text-blue-600 active:scale-95 transition-all p-1"
                        title="Edit Expense"
                      >
                        <FaEdit size={18} />
                      </button>

                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const deleteId = expense.id || (expense as any).expense_id;
                          handleDelete(deleteId);
                        }} 
                        className="text-red-500 hover:text-red-600 active:scale-95 transition-all p-1"
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

        {/* ── 📄 FOOTER PAGINATION ─────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#f8fafc] border-t border-slate-200/70">
          <div className="text-sm font-medium text-slate-500">
            Page {currentPage} of {totalPages} ({totalItems} total expenses)
          </div>
          <div className="flex items-center gap-1">
            <button 
              type="button"
              disabled={currentPage === 1 || loading}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="p-1.5 border border-slate-200 rounded-lg text-slate-400 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 text-xs font-bold rounded-lg transition-all ${
                  currentPage === page 
                    ? 'bg-[#4da1ff] text-white shadow-xs' 
                    : 'text-slate-500 bg-white border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}

            <button 
              type="button"
              disabled={currentPage === totalPages || loading}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="p-1.5 border border-slate-200 rounded-lg text-slate-400 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── 📝 EDIT MODAL OVERLAY ─────────────────────────────────── */}
      {isEditModalOpen && editingExpense && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Edit Expense Record</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Expense Title</label>
                <input 
                  type="text" 
                  required
                  value={editingExpense.title || ''} 
                  onChange={(e) => setEditingExpense({...editingExpense, title: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cost (MMK)</label>
                  <input 
                    type="number" 
                    required
                    value={editingExpense.cost ?? ''} 
                    onChange={(e) => setEditingExpense({...editingExpense, cost: Number(e.target.value)})}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 font-semibold"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Expense Date</label>
                  <input 
                    type="text" 
                    placeholder="YYYY-MM-DD"
                    required
                    value={editingExpense.expense_date || ''} 
                    onChange={(e) => setEditingExpense({...editingExpense, expense_date: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Expense Type</label>
                  <select 
                    value={editingExpense.expense_type || 'claim'} 
                    onChange={(e) => setEditingExpense({...editingExpense, expense_type: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="claim">Claim</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status</label>
                  <select 
                    value={editingExpense.status || 'requested'} 
                    onChange={(e) => setEditingExpense({...editingExpense, status: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 bg-white"
                  >
                    <option value="requested">Requested</option>
                    <option value="approved">Approved</option>
                    <option value="canceled">Canceled</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)} 
                  className="px-4 py-2 border border-slate-200 text-slate-500 text-sm font-semibold rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={editSubmitting}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl flex items-center gap-1.5 disabled:opacity-50"
                >
                  {editSubmitting ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>}
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
        onClose={() => setIsModalOpen(false)} 
        expense={selectedExpense} 
      />
    </div>
  );
};

export default ExpenseTable;