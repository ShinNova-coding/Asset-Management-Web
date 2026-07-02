import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { apiRequest } from "@/lib/apiService";

const UserCards: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [year, setYear] = useState("2026");
  const [month, setMonth] = useState("June");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiRequest(`/dashboard?year=${year}&month=${month}`, "GET");
        if (result.status === "success") setData(result.data.user);
      } catch (err) { console.error(err); }
    };
    fetchData();
  }, [year, month]);

  const chartData = data ? [
    { name: "Stats", Total: data.total_users, Active: data.active_user, Suspended: data.suspended_user, Resigned: data.resigned_user }
  ] : [];

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm w-full max-w-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-blue-800">Users</h2>
       
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" hide />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
            <Tooltip cursor={{ fill: "#f8fafc" }} contentStyle={{ borderRadius: '10px' }} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="Total" fill="#3b82f6" barSize={35} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Active" fill="#059669" barSize={35} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Suspended" fill="#d97706" barSize={35} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Resigned" fill="#e11d48" barSize={35} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default UserCards;