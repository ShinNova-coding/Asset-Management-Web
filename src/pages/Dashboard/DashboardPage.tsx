"use client";

import React, { useState, useEffect } from "react";
import DashboardCards from "../../components/features/Dashboard/DashboardCards";
import AssetCategoriesCards from "../../components/features/Dashboard/AssetCategoriesCards";
import UserCards from "../../components/features/Dashboard/UserCards";
import { apiRequest } from "@/lib/apiService"; // Adjust path accordingly



const DashboardPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      // apiRequest handles the token and base URL internally
      const result = await apiRequest("/dashboard", "GET");

      // Assuming your apiService returns the full response object
      if (result.status === "success" && result.data) {
        setDashboardData(result.data);
      } else {
        setError(result.message || "Failed to load dashboard data.");
      }
    } catch (err: any) {
      console.error("API error reading dashboard:", err);
      setError(err.message || "Could not reach local server.");
    } finally {
      setLoading(false);
    }
  };

  fetchDashboard();
}, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 min-h-screen bg-slate-50">
        <div className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-200">
          <strong>Error loading dashboard:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pt-4 pb-6 space-y-5 bg-[#F3F0F7]">
      <h1 className="text-2xl font-bold text-blue-800">
        Dashboard
      </h1>

      {/* Stats Overview */}
      <DashboardCards data={dashboardData} />

      {/* Grid container for side-by-side layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* User Distribution */}
        <UserCards apiData={dashboardData} />

        {/* Asset Categories */}
        <AssetCategoriesCards data={dashboardData} />
        
      </div>
    </div>
  );
};

export default DashboardPage;