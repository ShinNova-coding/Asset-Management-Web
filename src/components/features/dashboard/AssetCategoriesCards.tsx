import React from "react";
import {
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  TvIcon,
  TicketIcon,
  CommandLineIcon,
} from "@heroicons/react/24/outline";

interface CategoryCardProps {
  title: string;
  count: string;
  unit: string;
  Icon: React.ElementType;
  colorClass: string;
  borderColor: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  count,
  unit,
  Icon,
  colorClass,
  borderColor,
}) => {
  return (
    <div
      className={`bg-white p-6 rounded-xl border-t-3 ${borderColor} shadow-sm flex flex-col items-start w-full`}
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
        <div
          className={`h-full ${colorClass} w-3/4 rounded-full`}
        ></div>
      </div>
    </div>
  );
};

const AssetCategories: React.FC = () => {
  const categories = [
    {
      title: "Laptop",
      count: "482",
      unit: "Units Active",
      Icon: ComputerDesktopIcon,
      colorClass: "bg-indigo-900",
      borderColor: "border-indigo-900",
    },
    {
      title: "Phone",
      count: "156",
      unit: "Units Active",
      Icon: DevicePhoneMobileIcon,
      colorClass: "bg-blue-500",
      borderColor: "border-blue-200",
    },
    {
      title: "Monitor",
      count: "312",
      unit: "Units Active",
      Icon: TvIcon,
      colorClass: "bg-teal-500",
      borderColor: "border-teal-100",
    },
    {
      title: "Chair",
      count: "210",
      unit: "Units Active",
      Icon: TicketIcon,
      colorClass: "bg-orange-400",
      borderColor: "border-orange-200",
    },
    {
      title: "Software",
      count: "1.2k",
      unit: "Active Seats",
      Icon: CommandLineIcon,
      colorClass: "bg-purple-400",
      borderColor: "border-purple-200",
    },
  ];

  return (
    <div className="p-3 bg-slate-50 w-full">
      <h2 className="text-xl font-bold text-black mb-8">
        Asset Categories
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 max-w-[1400px]">
        {categories.map((item, index) => (
          <CategoryCard
            key={index}
            title={item.title}
            count={item.count}
            unit={item.unit}
            Icon={item.Icon}
            colorClass={item.colorClass}
            borderColor={item.borderColor}
          />
        ))}
      </div>
    </div>
  );
};

export default AssetCategories;