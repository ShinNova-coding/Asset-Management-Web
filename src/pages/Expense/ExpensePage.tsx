import React, { useState } from 'react';
import { Plus, Filter, Download, Search } from 'lucide-react';
import ExpenseTable from './ExpenseTable';

export const ExpensePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-blue-500 tracking-tight">Expense</h1>
            
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
              <Download size={16} className="text-gray-500" />
              Export
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#4f46e5] text-sm font-semibold text-white hover:bg-[#4338ca] transition-colors shadow-sm">
              <Plus size={16} />
              New Expense
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white p-4 border border-gray-100 rounded-sm shadow-sm">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5] transition-colors"
            />
          </div>
          
          <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-md bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Filter size={16} />
            Filters
          </button>
        </div>

        {/* The Expense Table UI Component */}
        <main>
          <ExpenseTable />
        </main>
        
      </div>
    </div>
  );
};

export default ExpensePage;