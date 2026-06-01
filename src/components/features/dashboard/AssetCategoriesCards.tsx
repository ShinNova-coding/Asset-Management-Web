// src/components/features/dashboard/AssetCategoriesCards.tsx

import React from "react";
import { useNavigate } from "react-router-dom";

import {
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  TvIcon,
  TicketIcon,
  CommandLineIcon,
} from "@heroicons/react/24/outline";

const CategoryCard = ({
  title,
  count,
  unit,
  Icon,
  colorClass,
  borderColor,
  onClick,
}: any) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white p-6 rounded-xl border-t-4 ${borderColor} shadow-sm flex flex-col items-start w-full cursor-pointer hover:shadow-lg transition`}
    >
      <div className="bg-slate-50 p-2 rounded-lg mb-4">
        <Icon className="w-6 h-6 text-slate-400" />
      </div>

      <h3 className="text-lg font-bold text-slate-800 mb-1">
        {title}
      </h3>

      <p className="text-xs text-slate-400 font-medium mb-6">
        {count} {unit}
      </p>

      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
        <div className={`h-full ${colorClass} w-3/4 rounded-full`} />
      </div>
    </div>
  );
};

const AssetCategoriesCards = () => {
  const navigate = useNavigate();

  const categories = [
    {
      title: "Laptop",
      count: "482",
      unit: "Units Active",
      Icon: ComputerDesktopIcon,
      colorClass: "bg-indigo-900",
      borderColor: "border-indigo-900",
      type: "laptop",
    },
    {
      title: "Phone",
      count: "156",
      unit: "Units Active",
      Icon: DevicePhoneMobileIcon,
      colorClass: "bg-blue-500",
      borderColor: "border-blue-200",
      type: "phone",
    },
    {
      title: "Monitor",
      count: "312",
      unit: "Units Active",
      Icon: TvIcon,
      colorClass: "bg-teal-500",
      borderColor: "border-teal-100",
      type: "monitor",
    },
    {
      title: "Chair",
      count: "210",
      unit: "Units Active",
      Icon: TicketIcon,
      colorClass: "bg-orange-400",
      borderColor: "border-orange-200",
      type: "chair",
    },
    {
      title: "Software",
      count: "1.2k",
      unit: "Active Seats",
      Icon: CommandLineIcon,
      colorClass: "bg-purple-400",
      borderColor: "border-purple-200",
      type: "software",
    },
  ];

  return (
    <div className="p-3 bg-slate-50 w-full">
      <h2 className="text-xl font-bold mb-8">Asset Categories</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {categories.map((item, index) => (
          <CategoryCard
            key={index}
            {...item}
            onClick={() => navigate(`/assets?type=${item.type}`)}
          />
        ))}
      </div>

    </div>
  );
};

export default AssetCategoriesCards;