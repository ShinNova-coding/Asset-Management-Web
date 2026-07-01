import React from "react";
import {
  CheckCircleIcon,
  UserIcon,
  WrenchIcon,
  TrashIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";

interface StatCardProps {
  label: string;
  value: string | number;
  Icon?: React.ElementType;
  gradient: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, Icon, gradient }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg transition-transform hover:-translate-y-1 ${gradient}`}>
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/20 blur-2xl" />
      
      <div className="relative z-10">
        <div className="mb-4 flex justify-between items-start">
          <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
            {Icon && <Icon className="h-6 w-6 text-white" />}
          </div>
          <span className="text-xs font-bold opacity-80 uppercase tracking-widest">{label}</span>
        </div>
        <h3 className="text-xl font-bold">{value}</h3>
      </div>
    </div>
  );
};

const DashboardStats: React.FC<{ data?: any }> = ({ data }) => {
  const assetData = data?.asset || {
    total_assets: 0,
    available_assets: 0,
    assigned_assets: 0,
    maintenance_assets: 0,
    retired_assets: 0,
  };

  const stats = [
    { label: "Total", value: assetData.total_assets, gradient: "bg-gradient-to-br from-blue-500 to-blue-700", Icon: CubeIcon },
    { label: "Available", value: assetData.available_assets, gradient: "bg-gradient-to-br from-emerald-500 to-emerald-700", Icon: CheckCircleIcon },
    { label: "Assigned", value: assetData.assigned_assets, gradient: "bg-gradient-to-br from-violet-500 to-violet-700", Icon: UserIcon },
    { label: "Repair", value: assetData.maintenance_assets, gradient: "bg-gradient-to-br from-rose-500 to-rose-700", Icon: WrenchIcon },
    { label: "Retired", value: assetData.retired_assets, gradient: "bg-gradient-to-br from-amber-500 to-amber-700", Icon: TrashIcon },
  ];

  return (
    <div className="w-full py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            label={stat.label}
            value={stat.value}
            Icon={stat.Icon}
            gradient={stat.gradient}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardStats;