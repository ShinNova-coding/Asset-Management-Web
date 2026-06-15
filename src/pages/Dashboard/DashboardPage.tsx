"use client";

import React, { useState, useEffect } from "react";
import DashboardCards from "../../components/features/Dashboard/DashboardCards";
import AssetCategoriesCards from "../../components/features/Dashboard/AssetCategoriesCards";
import UserCards from "../../components/features/Dashboard/UserCards";
import RecentActivities from "../../components/features/Dashboard/RecentActivities";

const API_URL = "http://192.168.100.179:1010/api/dashboard";

const DashboardPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");
      
      try {
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            "User-Agent": "Apidog/1.0.0 (https://apidog.com)",
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
          },
        });

        const result = await response.json();

        // Check if the status is "success" and data exists
        if (response.ok && result.status === "success" && result.data) {
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
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
    <div className="min-h-screen px-4 pt-4 pb-6 space-y-5 bg-slate-50">
      <h1 className="text-2xl font-bold text-blue-500">
        Dashboard
      </h1>

      {/* Dashboard Cards (passing the fetched data payload as a prop) */}
      <DashboardCards data={dashboardData} />

      {/* User Stats Cards */}
      <UserCards data={dashboardData} />

      {/* Combined Section */}
      <div className="space-y-6">
        <AssetCategoriesCards data={dashboardData} />
      </div>
    </div>
  );
};

export default DashboardPage;