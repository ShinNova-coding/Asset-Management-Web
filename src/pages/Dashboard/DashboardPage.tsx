"use client";

import React, { useState, useEffect } from "react";
import DashboardCards from "../../components/features/Dashboard/DashboardCards";
import AssetCategoriesCards from "../../components/features/Dashboard/AssetCategoriesCards";
import UserCards from "../../components/features/Dashboard/UserCards";
import ExpenseDashboard from "../../components/features/Dashboard/ExpenseDashboard";
import { apiRequest, getExpenseReport } from "@/lib/apiService"; 

const DashboardPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [expenseList, setExpenseList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [dashRes, expRes] = await Promise.allSettled([
          apiRequest("/dashboard", "GET"),
          getExpenseReport()
        ]);

        if (dashRes.status === "fulfilled") setDashboardData(dashRes.value.data);
        
        // Fix: Access the .data property from your API response
        if (expRes.status === "fulfilled" && expRes.value.data) {
          setExpenseList(expRes.value.data);
        }
      } catch (err) {
        console.error("Load Error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7C3AED]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold text-[#7C3AED]">Dashboard</h1>
      <DashboardCards data={dashboardData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <UserCards apiData={dashboardData} />
        <AssetCategoriesCards data={dashboardData} />
      </div>

      <div className="mt-5">
        {/* Pass the array extracted from the response */}
        <ExpenseDashboard data={expenseList} />
      </div>
    </div>
  );
};

export default DashboardPage;
