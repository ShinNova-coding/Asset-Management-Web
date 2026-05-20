// src/routes/Router.tsx

import { createBrowserRouter } from "react-router-dom"

import Login from "@/pages/Auth/Login"

import Layout from "@/layouts/Layout"

import DashboardPage from "@/pages/Dashboard/DashboardPage"
import InventoryPage from "@/pages/Inventory/InventoryPage"

import UserManagementPage from "@/pages/UserManagement/UserManagementPage"
import ActivityPage from "@/pages/Activity/ActivityPage"
import ActivityUpdate from "@/components/features/Activity/ActivityUpdate"
import MaintenancePage from "@/pages/Maintenance/MaintenancePage"
import UserManagement from "@/pages/UserManagement/UserManagementPage";
import AddEmployeeForm from "@/pages/UserManagement/AddNewEmployee";
import AddNewAsset from "@/pages/Inventory/AddNewAsset"
import { InventoryDetail } from "@/components/features/Inventory/InventoryDetail"
import EmployeeListPage from "@/pages/UserManagement/EmployeeListPage";
import EmployeeDetailsPage from "@/pages/UserManagement/EmployeeDetailsPage";

  
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
        path:"inventory/add",
        element:<AddNewAsset />,
      },
      {
        path:"inventory/:id",
        element:<InventoryDetail/>
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
        path:"activity/add",
        element:<ActivityUpdate/>,
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
  {
    path: "/",
    element: <EmployeeListPage />,
  },
  {
    path: "/employee/:employeeId",
    element: <EmployeeDetailsPage />,
  },
  

    ],
  },
])