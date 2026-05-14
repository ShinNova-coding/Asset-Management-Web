// src/routes/Router.tsx

import { createBrowserRouter } from "react-router-dom"

import Login from "@/pages/Auth/Login"

import Layout from "@/layouts/Layout"

import DashboardPage from "@/pages/Dashboard/DashboardPage"
import InventoryPage from "@/pages/Inventory/InventoryPage"
import UserManagementPage from "@/pages/UserManagement/UserManagementPage"
import ActivityPage from "@/pages/Activity/ActivityPage"
import MaintenancePage from "@/pages/Maintenance/MaintenancePage"
import UserManagement from "@/pages/UserManagement/UserManagementPage";
import AddEmployeeForm from "@/pages/UserManagement/AddNewEmployee";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },

  {
    path: "/",
    element: <Layout />,

    children: [
      {
        path: "dashboard",
        element: <DashboardPage />,
      },

      {
        path: "inventory",
        element: <InventoryPage />,
      },

      {
        path: "usermanagement",
        element: <UserManagementPage />,
      },

      {
        path: "activity",
        element: <ActivityPage />,
      },

      {
        path: "maintenance",
        element: <MaintenancePage />,
      },
    {
    path: "/employees",
    element: <UserManagement />,
  },
  {
    path: "/add-employee",
    element: <AddEmployeeForm />,
  },
    ],
  },
])