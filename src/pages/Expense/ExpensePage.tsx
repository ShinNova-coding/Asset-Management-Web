"use client"; 

import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 
import ExpenseTable from './ExpenseTable';


import { IoCloudDownloadOutline } from "react-icons/io5";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { apiFetch } from "@/lib/api"; 
export const ExpensePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expenseData, setExpenseData] = useState<any[]>([]); 
  const navigate = useNavigate();

  
  const fetchExpenses = async () => {
    try {
      const result = await apiFetch("/expense"); 
      const list = result?.data ?? [];
      
      
      const formatted = list.map((item: any) => ({
        id: item.id,
        title: item.title ?? "-",
        amount: item.amount ?? 0,
        category: item.category?.name ?? "-",
        date: item.expense_date ?? "-",
        status: item.status ?? "Pending"
      }));

      setExpenseData(formatted);
    } catch (err) {
      console.error("API Error:", err);
      setExpenseData([]);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Expense Report", 14, 20);
    
    const tableData = expenseData.map((item: any, index) => [
      index + 1,
      item.title,
      item.category,
      item.amount,
      item.date,
      item.status
    ]);

    autoTable(doc, {
      startY: 30,
      head: [['No', 'Title', 'Category', 'Amount', 'Date', 'Status']],
      body: tableData,
      headStyles: { fillColor: [30, 64, 175] }, 
      theme: 'striped'
    });

    doc.save("Expense_Report.pdf");
  };

  return (
    <div className="pt-6 px-8 pb-8 space-y-4 min-h-screen bg-[#F3F0F7] font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-blue-800 tracking-tight">Expense</h1>
          </div>
          
          <div className="flex items-center gap-3">
            
            <button
          onClick={handleExportPDF}
          className="px-4 py-2 bg-blue-800 border border-slate-300 text-white rounded-lg transition-colors text-lg font-medium shadow-sm flex items-center gap-2 hover:bg-blue-900"
        >
          <IoCloudDownloadOutline size={20} />
          
        </button>

            <button 
              onClick={() => navigate('/expense/createexpenseform')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-800 text-sm font-semibold text-white hover:bg-blue-900 transition-colors shadow-sm"
            >
              <Plus size={16} />
              Create Expense
            </button>
          </div>
        </div>

        <main>
          
          <ExpenseTable data={expenseData} onRefresh={fetchExpenses} />
        </main>
        
      </div>
    </div>
  );
};

export default ExpensePage;