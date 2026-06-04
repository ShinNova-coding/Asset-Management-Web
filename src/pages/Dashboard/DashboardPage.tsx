import React from "react";
import DashboardCards from "../../components/features/Dashboard/DashboardCards";
import AssetCategoriesCards from "../../components/features/Dashboard/AssetCategoriesCards";
import RecentActivities from "../../components/features/Dashboard/RecentActivities"

const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen p-6 space-y-8 bg-slate-50">
      {/* Header */}
      <h1 className="text-2xl font-bold">
        Dashboard
      </h1>

      {/* Dashboard Cards */}
      <DashboardCards />

      {/* Combined Section */}
      <div className="space-y-6">
        <AssetCategoriesCards />
        <RecentActivities />
      </div>

     </div>
  );
}; 
          


export default DashboardPage;