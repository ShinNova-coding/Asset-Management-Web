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
  iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, Icon, iconColor }) => {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] transition-all hover:shadow-lg">
      <div className="mb-4 flex items-center gap-3">
        <div className={`rounded-xl p-2.5 ${iconColor} bg-opacity-6`}>
          {Icon && <Icon className={`h-4 w-4 ${iconColor.replace('bg-', 'text-')}`} />}
        </div>
        <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</span>
      </div>
      <h3 className="text-xl font-bold text-slate-900">{value}</h3>
     
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
    { label: "Total", value: assetData.total_assets, iconColor: "bg-blue-100", Icon: CubeIcon },
    { label: "Available", value: assetData.available_assets, iconColor: "bg-emerald-300", Icon: CheckCircleIcon },
    { label: "Assigned", value: assetData.assigned_assets, iconColor: "bg-violet-300", Icon: UserIcon },
    { label: "Repair", value: assetData.maintenance_assets, iconColor: "bg-rose-300", Icon: WrenchIcon },
    { label: "Retired", value: assetData.retired_assets, iconColor: "bg-amber-300", Icon: TrashIcon },
  ];

  return (
    <div className="w-full py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            label={stat.label}
            value={stat.value}
            Icon={stat.Icon}
            iconColor={stat.iconColor}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardStats;