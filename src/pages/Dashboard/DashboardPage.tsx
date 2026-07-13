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

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen px-4 pt-4 pb-6 space-y-5 bg-[#e9e5ff]">
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