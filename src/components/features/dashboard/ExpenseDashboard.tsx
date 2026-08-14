"use client";

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ExpenseDashboardProps {
  data?: any[]; 
}

const ExpenseDashboard: React.FC<ExpenseDashboardProps> = ({ data = [] }) => {
  const safeData = Array.isArray(data) ? data : [];

  //  (Monthly Aggregation)
  const monthlyTotals = safeData.reduce((acc, item) => {
    const date = new Date(item.expense_date);
    const month = date.toLocaleString('default', { month: 'short' }); 
    acc[month] = (acc[month] || 0) + (parseFloat(item.cost) || 0);
    return acc;
  }, {} as Record<string, number>);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const chartData = months.map(m => monthlyTotals[m] || 0);
  const totalExpense = safeData.reduce((sum, item) => sum + (parseFloat(item.cost) || 0), 0);

  return (
    <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-700 mb-2">Monthly Expense Report (Yearly)</h2>
      <div className="text-3xl font-bold text-slate-900 mb-6">
        Kyats {totalExpense.toLocaleString()}
      </div>
      
      <div style={{ height: '300px' }}>
        <Bar 
          key={JSON.stringify(chartData)} 
          data={{
            labels: months,
            datasets: [{
              label: 'Total Cost',
              data: chartData,
              backgroundColor: '#8b5cf6',
              borderRadius: 6,
            }]
          }}
          options={{ 
            responsive: true, 
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { display: false } },
              y: { beginAtZero: true }
            }
          }}
        />
      </div>
    </div>
  );
};

export default ExpenseDashboard;
