import React from "react";

type ActivityType = "Requested" | "Approved" | "Rejected" | "Returned";

interface ActivityItem {
  id: string;
  username: string;
  category: string;
  inventory: string;
  activity: ActivityType;
  date: string;
}

const activities: ActivityItem[] = [
  {
    id: "1",
    username: "Employee 1",
    category: "Laptop",
    inventory: "HP",
    activity: "Requested",
    date: "10.5.2026",
  },
  {
    id: "2",
    username: "Employee 2",
    category: "Monitor",
    inventory: "Dell",
    activity: "Approved",
    date: "25.1.2026",
  },
  {
    id: "3",
    username: "Employee 3",
    category: "Desktop",
    inventory: "Lenovo",
    activity: "Rejected",
    date: "19.8.2025",
  },
  {
    id: "4",
    username: "Employee 4",
    category: "Chair",
    inventory: "Ergonomic",
    activity: "Returned",
    date: "15.3.2025",
  },
  {
    id: "5",
    username: "Employee 5",
    category: "Software",
    inventory: "Adobe",
    activity: "Requested",
    date: "18.11.2024",
  },
];

const getActivityStyle = (activity: ActivityType) => {
  switch (activity) {
    case "Requested":
      return "bg-blue-100 text-blue-700";
    case "Approved":
      return "bg-green-100 text-green-700";
    case "Rejected":
      return "bg-red-100 text-red-700";
    case "Returned":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "";
  }
};

const RecentActivities: React.FC = () => {
  return (
    <div className="p-6">
      <div className="bg-white shadow-sm rounded-lg border border-slate-200">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h2 className="text-lg font-bold text-black">
            Recent Activities
          </h2>
        </div>

        {/* Table */}
        <table className="w-full text-sm">
          <thead className="bg-blue-400 text-white border-amber-100 text-left border-slate-50">
            <tr>
              <th className="px-4 py-2 font-medium">Username</th>
              <th className="px-4 py-2 font-medium">Category</th>
              <th className="px-4 py-2 font-medium">Asset Name</th>
              <th className="px-4 py-2 font-medium">Activity</th>
              <th className="px-4 py-2 font-medium">Date</th>
            </tr>
          </thead>

          <tbody>
            {activities.map((item) => (
              <tr
                key={item.id}
                className="border-b last:border-none hover:bg-gray-100 transition-colors border-slate-300"
              >
                <td className="px-4 py-3">
                  {item.username}
                </td>

                <td className="px-4 py-3 text-gray-700">
                  {item.category}
                </td>

                <td className="px-4 py-3 text-gray-700">
                  {item.inventory}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getActivityStyle(
                      item.activity
                    )}`}
                  >
                    {item.activity}
                  </span>
                </td>

                <td className="px-4 py-3 text-gray-700">
                  {item.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentActivities;