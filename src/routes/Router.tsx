// src/routes/Router.tsx
import { createBrowserRouter } from "react-router-dom"

import Login from "@/pages/Auth/Login"
import ForgetPassword from "@/pages/Auth/ForgetPassword"
import ResetPassword from "@/pages/Auth/ResetPassword"
import Layout from "@/layouts/Layout"
import ProtectedRoute from "./ProtectedRoute"

import DashboardPage from "@/pages/Dashboard/DashboardPage"
import InventoryPage from "@/pages/Inventory/InventoryPage"
import AssignmentPage from "@/pages/Assignment/AssignmentPage"
import Assign from "@/pages/Assignment/Assign"
import UserManagementPage from "@/pages/UserManagement/UserManagementPage"
import ActivityPage from "@/pages/Activity/ActivityPage"
import ActivityUpdate from "@/components/features/Activity/ActivityUpdate"
import ActivityDetail from "@/components/features/Activity/ActivityDetail"
import MaintenancePage from "@/pages/Maintenance/MaintenancePage"
import UserManagement from "@/pages/UserManagement/UserManagementPage"
import AddEmployeeForm from "@/pages/UserManagement/AddNewEmployee"
import AddNewAsset from "@/pages/Inventory/AddNewAsset"
import { InventoryDetail } from "@/components/features/Inventory/InventoryDetail"
import EmployeeListPage from "@/pages/UserManagement/EmployeeListPage"
import EmployeeDetailsPage from "@/pages/UserManagement/EmployeeDetailsPage"
import MaintenanceDetailsForm from "@/components/features/Maintenance/MaintenanceDetailsForm"
import AssignmentDetailPage from "@/components/features/Assignment/AssignmentDetailPage"
import AssignmentEditPage from "@/components/features/Assignment/AssignmentEdit"
import AssetListPage from "@/components/features/Dashboard/AssetListPage"


export const router = createBrowserRouter([
  // Public Routes (Anyone can access these)
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/forget-password",
    element: <ForgetPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },

  // Protected Routes (Wrapped inside ProtectedRoute)
  {
    element: <ProtectedRoute />, // 2. Put the Guard component here
    children: [
      {
        path: "/",
        element: <Layout />, // Your Layout sits inside the guard now
        children: [
          {
            path: "dashboard",
            element: <DashboardPage />,
          },
          {
            path: "assets",
            element: <AssetListPage />,
          },
          {
            path: "inventory",
            element: <InventoryPage />,
          },
          {
            path: "inventory/add",
            element: <AddNewAsset />,
          },
          {
            path:"inventory/:id/edit",
            element:<AddNewAsset/>,
          },
          {
            path: "inventory/:id",
            element: <InventoryDetail />,
          },
          {
            path: "usermanagement",
            element: <UserManagementPage />,
          },
          {
            path: "assignment",
            element: <AssignmentPage />,
          },
          {
            path:"assignment/add",
            element:<Assign/>
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
            path: "activity/add",
            element: <ActivityUpdate />,
          },
          {
            path: "activity/:id",
            element: <ActivityDetail />,
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
          {
            path: "maintenance/:id",
            element: <MaintenanceDetailsForm />,
          },
          {
            path: "assignment/:id",
            element: <AssignmentDetailPage />,
          },
         
        ],
      },
    ],
  },
])