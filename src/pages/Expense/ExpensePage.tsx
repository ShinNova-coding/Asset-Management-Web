import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 
import ExpenseTable from './ExpenseTable';

export const ExpensePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-2 px-2 sm:px-2 lg:px-2 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-blue-500 tracking-tight">Expense</h1>
          </div>
          
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/expense/createexpenseform')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#4f46e5] text-sm font-semibold text-white hover:bg-[#4338ca] transition-colors shadow-sm"
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