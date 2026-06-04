import React from "react";
import DashboardCards from "../../components/features/dashboard/DashboardCards";
import AssetCategoriesCards from "../../components/features/dashboard/AssetCategoriesCards";
import RecentActivities from "../../components/features/dashboard/RecentActivities"

const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen px-4 pt-4 pb-6 space-y-5 bg-slate-50">
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