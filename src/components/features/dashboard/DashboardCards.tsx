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
  percentage?: string;
  Icon?: React.ElementType;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  percentage,
  Icon,
  color,
}) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-400 flex flex-col justify-between min-h-[110px] w-full">
      <div>
        <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">
          {label}
        </p>

        <div className="flex items-center gap-2">
          {/* Value Color */}
          <span className={`text-2xl font-bold ${color}`}>
            {value}
          </span>

          {percentage && (
            <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
              {percentage}
            </span>
          )}
        </div>
      </div>

      {/* Icon Color */}
      {Icon && (
        <div className="self-end mt-auto">
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      )}
    </div>
  );
};

const DashboardStats: React.FC = () => {
  const stats = [
    {
      label: "Total Assets",
      value: "1,284",
      color: "text-blue-500",
      percentage: "+12%",
      Icon: CubeIcon,
    },
    {
      label: "Available",
      value: "412",
      color: "text-green-500",
      Icon: CheckCircleIcon,
    },
    {
      label: "Current Use",
      value: "842",
      color: "text-black",
      Icon: UserIcon,
    },
    {
      label: "In Repair",
      value: "26",
      color: "text-red-500",
      Icon: WrenchIcon,
    },
    {
      label: "Retired",
      value: "4",
      color: "text-yellow-500",
      Icon: TrashIcon,
    },
  ];

  return (
    <div className="w-full p-8 bg-slate-50">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 max-w-[1400px] mx-auto">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            label={stat.label}
            value={stat.value}
            percentage={stat.percentage}
            Icon={stat.Icon}
            color={stat.color}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardStats;