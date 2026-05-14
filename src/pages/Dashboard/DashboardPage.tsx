import React from "react";
import DashboardCards from "../../components/features/dashboard/DashboardCards";
import AssetCategoriesCards from "../../components/features/dashboard/AssetCategoriesCards";
import RecentActivities from "../../components/features/dashboard/RecentActivities"
const DashboardPage: React.FC = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">
        Dashboard
      </h1>
        
      {/* Dashboard Cards */}
      <DashboardCards />

      {/* Combined Section */}
        <div className="mt-8 space-y-6">
<AssetCategoriesCards />
<RecentActivities />
        </div>
        </div>

  
  );
};

export default DashboardPage;




