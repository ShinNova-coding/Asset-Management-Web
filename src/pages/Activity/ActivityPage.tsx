"use client";

import { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/apiService";

interface SystemActivityLogItem {
  id: number;
  causer_name: string;
  description: string;
  asset_name: string;
  created_at: string;
}

export default function ActivityPage() {
  const [logs, setLogs] = useState<SystemActivityLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const pageCount = Math.ceil(logs.length / itemsPerPage);

  useEffect(() => {
    const fetchSystemLogs = async () => {
      try {
        setLoading(true);
        const result = await apiRequest("/activitylogs", "GET");

        if (result && Array.isArray(result.data)) {
          const sortedLogs = result.data.sort((a: any, b: any) => b.id - a.id);
          setLogs(sortedLogs);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load activity logs.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchSystemLogs();
  }, []);

  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7C3AED]"></div>
      </div>
    );
  }

 
  if (error) {
    return (
      <div className="p-8 min-h-screen bg-slate-50">
        <div className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-200">
          <strong>Error loading activity logs:</strong> {error}
        </div>
      </div>
    );
  }

  const currentLogs = logs.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <div className="pt-4 px-6 pb-6 space-y-6 min-h-screen bg-[#e9e5ff]">
      <h1 className="text-2xl font-bold text-[#7C3AED]">Activity Logs</h1>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#A78BFA] text-white text-sm">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Action</th>
              <th className="px-6 py-4">Asset</th>
              <th className="px-6 py-4">Operator</th>
              <th className="px-6 py-4">Date & Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {currentLogs.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-mono text-slate-400">#{row.id}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-slate-100 rounded text-xs">{row.description}</span>
                </td>
                <td className="px-6 py-4 font-medium">{row.asset_name}</td>
                <td className="px-6 py-4">{row.causer_name}</td>
                <td className="px-6 py-4 text-slate-500 text-xs">{new Date(row.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-2 py-1 bg-white rounded-lg border border-slate-200 p-2 shadow-sm">
          <div className="text-xs text-slate-500 font-medium ml-2">
            Page {currentPage + 1} of {pageCount || 1} ({logs.length} total activities)
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
              disabled={currentPage === 0}
            >
              <FiChevronLeft size={16} />
            </Button>

            <div className="flex gap-1 items-center">
              {Array.from({ length: pageCount }).map((_, index) => {
                if (index === 0 || index === pageCount - 1 || (index >= currentPage - 1 && index <= currentPage + 1)) {
                  return (
                    <Button
                      key={index}
                      variant={currentPage === index ? "default" : "outline"}
                      size="sm"
                      className={currentPage === index ? "bg-[#A78BFA] hover:bg-[#7C3AED] text-white border-none" : "bg-slate-200"}
                      onClick={() => setCurrentPage(index)}
                    >
                      {index + 1}
                    </Button>
                  );
                }
                if (index === currentPage - 2 || index === currentPage + 2) {
                  return <span key={index} className="px-2 text-gray-500">...</span>;
                }
                return null;
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(pageCount - 1, prev + 1))}
              disabled={currentPage >= pageCount - 1}
            >
              <FiChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
