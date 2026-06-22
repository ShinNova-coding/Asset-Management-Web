import React from 'react';
import { MoreVertical, Info, ChevronLeft, ChevronRight } from 'lucide-react';

// 1. Define Types for the Data
type ExpenseStatus = 'canceled' | 'requested' | 'approved';

interface ExpenseItem {
  id: string;
  title: string;
  date: string;
  type: string;
  cost: string;
  status: ExpenseStatus;
}

// 2. Mock Data based on the UI from "Screenshot 2026-06-22 093846.png"
const expenseData: ExpenseItem[] = [
  {
    id: 'a20cd1b7',
    title: 'Claim form for taxi fee',
    date: '2026-02-02',
    type: 'CLAIM',
    cost: '1,000,000',
    status: 'canceled',
  },
  {
    id: 'a20cd180',
    title: 'Claim form for taxi fee',
    date: '2026-02-02',
    type: 'CLAIM',
    cost: '1,000,000',
    status: 'requested',
  },
  {
    id: 'a20ccf56',
    title: 'Claim form for taxi fee',
    date: '2026-02-02',
    type: 'CLAIM',
    cost: '1,000,000',
    status: 'approved',
  },
  {
    id: 'a20cc885',
    title: 'Claim form for taxi fee',
    date: '2026-02-02',
    type: 'CLAIM',
    cost: '1,000,000',
    status: 'approved',
  },
];

export const ExpenseTable: React.FC = () => {
  // Helper function to handle status badge styles
  const getStatusStyles = (status: ExpenseStatus) => {
    switch (status) {
      case 'canceled':
        return 'bg-red-50 text-red-600 border border-red-100';
      case 'requested':
        return 'bg-orange-50 text-orange-600 border border-orange-100';
      case 'approved':
        return 'bg-green-50 text-green-600 border border-green-100';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white border border-gray-100 rounded-sm shadow-sm font-sans">
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* Table Header */}
          <thead>
            <tr className="bg-[#f8f9fc] border-b border-gray-100 text-[11px] font-bold tracking-wider text-gray-500 uppercase">
              <th className="py-4 px-6 min-w-[240px]">Title</th>
              <th className="py-4 px-6">Date</th>
              <th className="py-4 px-6">Type</th>
              <th className="py-4 px-6 text-left">Cost</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 w-16 text-center"></th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {expenseData.map((expense) => (
              <tr key={expense.id} className="hover:bg-gray-50/50 transition-colors">
                {/* Title & ID */}
                <td className="py-5 px-6">
                  <div className="font-bold text-[#1e293b] text-[15px] mb-0.5">
                    {expense.title}
                  </div>
                  <div className="text-xs text-gray-400">
                    ID: <span className="font-mono">{expense.id}</span>
                  </div>
                </td>

                {/* Date */}
                <td className="py-5 px-6 text-gray-500 text-[14px]">
                  {expense.date}
                </td>

                {/* Type Badge */}
                <td className="py-5 px-6">
                  <span className="bg-[#e0e7ff] text-[#4f46e5] text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-sm">
                    {expense.type}
                  </span>
                </td>

                {/* Cost */}
                <td className="py-5 px-6 font-bold text-[#1e293b] text-[15px]">
                  {expense.cost}
                </td>

                {/* Status Badge */}
                <td className="py-5 px-6">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusStyles(
                      expense.status
                    )}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        expense.status === 'canceled'
                          ? 'bg-red-500'
                          : expense.status === 'requested'
                          ? 'bg-orange-500'
                          : 'bg-green-500'
                      }`}
                    />
                    {expense.status}
                  </span>
                </td>

                {/* Action Button */}
                <td className="py-5 px-6 text-center">
                  <button className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded">
                    {expense.status === 'canceled' ? (
                      <Info size={18} className="text-gray-400" />
                    ) : (
                      <MoreVertical size={18} className="text-gray-500" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white">
        <div className="text-sm font-medium text-gray-500">
          Showing 4 of 4 results
        </div>
        <div className="flex gap-2">
          <button className="p-2 border border-gray-200 rounded-md text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors">
            <ChevronLeft size={18} />
          </button>
          <button className="p-2 border border-gray-200 rounded-md text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTable;