import { useState, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/Router";
import { AuthContext } from "@/hooks/useAuth";

const App = () => {
  // 1. Initialize role from localStorage so it persists after page refresh
  const [currentRoleName, setCurrentRoleName] = useState(() => {
    return localStorage.getItem("user_role") || "Admin"; 
  });

  const apiResponse = {
    status: "success",
    data: [
      {
        id: 1,
        name: "Admin",
        permissions: [
          { id: 7, name: "view-assets" },
          { id: 12, name: "view-users" },
          { id: 26, name: "view-dashboard" },
          { id: 28, name: "view-assignments" },
          { id: 33, name: "view-maintenances" }
        ]
      },
     
       {
        id: 2,
        name: "HR",
        permissions: [
          { id: 2, name: "view-categories" },
          { id: 7, name: "view-assets" }
        ]
      },
       {
        id: 12,
        name: "Employee",
        permissions: [
          { id: 2, name: "view-categories" },
          { id: 7, name: "view-assets" },
          {id:29,name:"view-assignments"}

        ]
      },
      {
        id: 4,
        name: "super-admin",
        permissions: [
          { id: 7, name: "view-assets" },
          { id: 12, name: "view-users" },
          { id: 26, name: "view-dashboard" },
          { id: 28, name: "view-assignments" },
          { id: 33, name: "view-maintenances" },
          { id: 17, name: "view-roles" },
          { id: 49, name: "view-expenses" },
          { id: 58, name: "view-activitylogs" }
        ]
      }
    ]
  };

  // 2. Derive permissions based on the active role
  const userRole = apiResponse.data.find(role => role.name === currentRoleName);

  // 3. Helper to switch roles (Simulating a login)
  const switchRole = (role: string) => {
    localStorage.setItem("user_role", role);
    setCurrentRoleName(role);
  };

  return (
    <>
      {/* Dev Tool: Remove this in production. It helps you test your RBAC flow. */}
      <div className="fixed bottom-4 right-4 z-50 p-3 bg-slate-900 text-white rounded shadow-lg text-xs">
        <p>Current: <strong>{currentRoleName}</strong></p>
        <button onClick={() => switchRole("super-admin")} className="mr-2 underline">Super Admin</button>
        <button onClick={() => switchRole("HR")} className="underline">HR</button>
      </div>

      <AuthContext.Provider value={{ permissions: userRole?.permissions || [] }}>
        <RouterProvider router={router} />
      </AuthContext.Provider>
    </>
  );
};

export default App;