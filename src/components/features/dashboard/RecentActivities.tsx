import React from "react";

type ActivityType = "Request" | "Return" | "Maintenance";

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
    username: "Chaw Su Su Win",
    category: "Laptop",
    inventory: "HP-123",
    activity: "Request",
    date: "10.5.2026",
  },
  {
    id: "2",
    username: "Khin Sandi Win",
    category: "Monitor",
    inventory: "MNTR-456",
    activity: "Maintenance",
    date: "23.9.2025",
  },
  {
    id: "3",
    username: "Team Leader",
    category: "Desktop",  
    inventory: "DT-789",
    activity: "Return",
    date: "19.7.2025",
  },
  {
    id: "4",
    username: "Network Admin",
    category: "Phone",
    inventory: "PH-321",
    activity: "Request",
    date: "28.1.2025",
  },
  {
    id: "5",
    username: "Project Manager",
    category: "Chair",
    inventory: "CHR-654",
    activity: "Maintenance",
    date: "7.11.2024",
  },
];

const getActivityStyle = (activity: ActivityType) => {
  switch (activity) {
    case "Request":
      return "bg-blue-100 text-blue-600";
    case "Return":
      return "bg-green-100 text-green-600";
    case "Maintenance":
      return "bg-yellow-100 text-yellow-600";
    default:
      return "";
  }
};

const RecentActivities: React.FC = () => {
  return (
    <div className="p-2">
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">

        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h2 className="text-sm font-semibold text-gray-700">
            Recent Activities
          </h2>
          
        </div>

        {/* Table */}
        <table className="w-full text-sm">
          <thead className="bg-blue-300 text-white text-left">
            <tr>
              <th className="px-4 py-2 font-medium">Username</th>
              <th className="px-4 py-2 font-medium">Category</th>
              <th className="px-4 py-2 font-medium">Inventory</th>
              <th className="px-4 py-2 font-medium">Activity</th>
              <th className="px-4 py-2 font-medium">Date</th>
            </tr>
          </thead>

          <tbody>
            {activities.map((item) => (
              <tr
                key={item.id}
                className="border-b last:border-none hover:bg-gray-50"
              >
                <td className="px-4 py-3 flex items-center gap-2">
                  

                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getActivityStyle(
                      item.activity
                    )}`}
                  >
                    {item.username}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {item.category}
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {item.inventory}
                </td>

                <td className="px-4 py-3 text-gray-700">
                  {item.activity}
                </td>

                <td className="px-4 py-3 text-gray-400">
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