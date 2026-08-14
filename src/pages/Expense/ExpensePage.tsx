"use client"; 

import React from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 
import ExpenseTable from './ExpenseTable';
export const ExpensePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-6 px-8 pb-8 space-y-4 min-h-screen bg-[#e9e5ff] font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#7C3AED] tracking-tight">Expense</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/expense/createexpenseform')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#7C3AED] text-sm font-semibold text-white hover:bg-purple-700 transition-colors shadow-sm"
            >
              <Plus size={16} />
              Create Expense
            </button>
          </div>
        </div>

        <main>
          <ExpenseTable />
        </main>
        
      </div>
    </div>
  );
};

export default ExpensePage;
