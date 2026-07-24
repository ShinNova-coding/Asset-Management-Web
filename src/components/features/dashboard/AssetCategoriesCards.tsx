"use client";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const AssetCategoriesCards = ({ data }: { data?: any }) => {
  const navigate = useNavigate();

  const chartData = data?.category
    ? Object.entries(data.category).map(([key, value]) => ({
        name: key,
        value: Number(value),
      }))
    : [];

  const COLORS = ["#C4B5FD", "#7C3AED", "#A78BFA", "#e9e5ff", "#db2777"];

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200 w-full flex flex-col md:flex-row items-center gap-8">
     
      <div className="h-[200px] w-full md:w-1/2 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={8}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-slate-800">
            {chartData.reduce((acc, curr) => acc + curr.value, 0)}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-slate-400">Total</span>
        </div>
      </div>

      
      <div className="w-full md:w-1/2 space-y-3">
        <h2 className="text-lg font-bold text-[#7C3AED] mb-4">Category</h2>
        {chartData.map((item, index) => (
          <button
            key={item.name}
            onClick={() => navigate(`/assets?type=${item.name.toLowerCase()}`)}
            className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }} 
              />
              <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">
                {item.name}
              </span>
            </div>
            <span className="text-sm font-bold text-slate-900">{item.value}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AssetCategoriesCards;