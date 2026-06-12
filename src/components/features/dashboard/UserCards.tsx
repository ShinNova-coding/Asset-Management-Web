import React from "react";
import {
  UsersIcon,
  UserPlusIcon,
  UserMinusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface UserCardProps {
  label: string;
  value: string | number;
  Icon?: React.ElementType;
  colorClass?: string;
  bgColorClass?: string;
}

const UserCard: React.FC<UserCardProps> = ({
  label,
  value,
  Icon,
  colorClass = "text-blue-600",
  bgColorClass = "bg-blue-50",
}) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] flex items-center justify-between w-full">
      <div>
        <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-0.5">
          {label}
        </p>
        <span className={`text-2xl font-bold ${colorClass}`}>
          {value}
        </span>
      </div>

      {Icon && (
        <div className={`p-2.5 rounded-xl ${bgColorClass}`}>
          <Icon className={`w-5 h-5 ${colorClass}`} />
        </div>
      )}
    </div>
  );
};

const UserCards: React.FC<{ data?: any }> = ({ data }) => {
  const userData = data?.user || {
    total_users: 0,
    active_user: 0,
    suspended_user: 0,
    resigned_user: 0,
  };

  const userStats = [
    {
      label: "Total Users",
      value: userData.total_users,
      Icon: UsersIcon,
      colorClass: "text-blue-500",
      bgColorClass: "bg-blue-100",
    },
    {
      label: "Active Users",
      value: userData.active_user,
      Icon: UserPlusIcon,
      colorClass: "text-emerald-600",
      bgColorClass: "bg-emerald-50",
    },
    {
      label: "Suspended Users",
      value: userData.suspended_user,
      Icon: UserMinusIcon,
      colorClass: "text-amber-600",
      bgColorClass: "bg-amber-50",
    },
    {
      label: "Resigned Users",
      value: userData.resigned_user,
      Icon: XMarkIcon,
      colorClass: "text-rose-600",
      bgColorClass: "bg-rose-50",
    },
  ];

  return (
    <div className="w-full space-y-3 py-4">
      <h2 className="text-base font-bold text-slate-800">Users</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
        {userStats.map((stat, index) => (
          <UserCard
            key={index}
            label={stat.label}
            value={stat.value}
            Icon={stat.Icon}
            colorClass={stat.colorClass}
            bgColorClass={stat.bgColorClass}
          />
        ))}
      </div>
    </div>
  );
};

export default UserCards;