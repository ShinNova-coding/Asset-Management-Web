

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ComputerDesktopIcon,
  TvIcon,
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

const AssetCategoriesCards = ({ data }: { data?: any }) => {
  const navigate = useNavigate();

 
  const categories = data?.category
    ? Object.entries(data.category).map(([key, value]) => {
       
        let Icon = CommandLineIcon;
        let colorClass = "bg-indigo-600";
        let borderColor = "border-indigo-200";

        if (key.toLowerCase().includes("goods")) {
          Icon = ComputerDesktopIcon;
          colorClass = "bg-blue-600";
          borderColor = "border-blue-200";
        } else if (key.toLowerCase().includes("furnitur")) {
          Icon = TvIcon;
          colorClass = "bg-teal-500";
          borderColor = "border-teal-200";
        }

        return {
          title: key,
          count: String(value),
          unit: "Total Items",
          Icon,
          colorClass,
          borderColor,
          type: key.toLowerCase(),
        };
      })
    : [];

  return (
    <div className="p-3 bg-slate-50 w-full">
      <h2 className="text-md font-bold mb-8">Asset Categories</h2>

      {categories.length === 0 ? (
        <p className="text-sm text-slate-500">No categories found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((item, index) => (
            <CategoryCard
              key={index}
              {...item}
              onClick={() => navigate(`/assets?type=${item.type}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AssetCategoriesCards;