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
    inventory: "HP",
    activity: "Request",
    date: "10.5.2026",
  },
  {
    id: "2",
    username: "Khin Sandi Win",
    category: "Monitor",
    inventory: "Dell",
    activity: "Maintenance",
    date: "25.1.2026",
  },
  {
    id: "3",
    username: "Team Leader",
    category: "Desktop",
    inventory: "Lenovo",
    activity: "Return",
    date: "19.8.2025",
  },
  {
    id: "4",
    username: "Network Admin",
    category: "Chair",
    inventory: "Ergonomic",
    activity: "Request",
    date: "15.3.2025",
  },
 {
    id: "5",
    username: "Software Engineer",
    category: "Software",
    inventory: "Adobe",
    activity: "Maintenance",
    date: "18.11.2024",
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
    <div className="p-6">
      <div className="bg-white shadow-sm rounded-lg border border-slate-400">

        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h2 className="text-lg font-bold text-black">
            Recent Activities
          </h2>
          
        </div>

        {/* Table */}
        <table className="w-full text-sm">
          <thead className="bg-blue-400 text-white border-amber-100 text-left">
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
                className="border-b last:border-none hover:bg-gray-100 transition-colors"
              >
                <td className="px-4 py-3 flex items-center gap-2">
                  {/* <span className="w-2 h-2 bg-gray-800 rounded-full"></span> */}

                  <span
                    className={`px-2 py-1 rounded text-md font-medium ${getActivityStyle(
                      item.activity
                    )}`}
                  >
                    {item.username}
                  </span>
                </td>

                <td className="px-4 py-3 text-gray-700">
                  {item.category}
                </td>

                <td className="px-4 py-3 text-gray-700">
                  {item.inventory}
                </td>

                <td className="px-4 py-3 text-gray-700">
                  {item.activity}
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