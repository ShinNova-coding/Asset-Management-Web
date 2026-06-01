// src/routes/Router.tsx

import { createBrowserRouter } from "react-router-dom"

import Login from "@/pages/Auth/Login"
import ForgetPassword from "@/pages/Auth/ForgetPassword"
import ResetPassword from "@/pages/Auth/ResetPassword"
import Layout from "@/layouts/Layout"

import DashboardPage from "@/pages/Dashboard/DashboardPage"
import InventoryPage from "@/pages/Inventory/InventoryPage"
import AssignmentPage from "@/pages/Assignment/AssignmentPage";
import UserManagementPage from "@/pages/UserManagement/UserManagementPage"
import ActivityPage from "@/pages/Activity/ActivityPage"
import ActivityUpdate from "@/components/features/Activity/ActivityUpdate"
import ActivityDetail from "@/components/features/Activity/ActivityDetail"
import MaintenancePage from "@/pages/Maintenance/MaintenancePage"
import UserManagement from "@/pages/UserManagement/UserManagementPage";
import AddEmployeeForm from "@/pages/UserManagement/AddNewEmployee";
import AddNewAsset from "@/pages/Inventory/AddNewAsset"
import { InventoryDetail } from "@/components/features/Inventory/InventoryDetail"
import EmployeeListPage from "@/pages/UserManagement/EmployeeListPage";
import EmployeeDetailsPage from "@/pages/UserManagement/EmployeeDetailsPage";
import MaintenanceDetailsForm from "@/components/features/Maintenance/MaintenanceDetailsForm";
import AssignmentDetailPage from "@/components/features/Assignment/AssignmentDetailPage";
import AssetListPage from "@/components/features/dashboard/AssetListPage";
import AssetCategoriesCards from "@/components/features/dashboard/AssetCategoriesCards";
import AssignmentLogsPage from "@/pages/Activity/AssignmentLogsPage"
import MaintenanceLogsPage from "@/pages/Activity/MaintenanceLogsPage"
import ActivityLogsPage from "@/pages/Activity/ActivityLogsPage"
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path:"/forget-password",
    element:<ForgetPassword/>,
 },
{
    path:"/reset-password",
    element:<ResetPassword/>,

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
  path: "assets",
  element: <AssetListPage />,
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
        path: "assignment",
        element: <AssignmentPage />,
      },
      {
        path: "activity",
        element: <ActivityPage />,
      },
      {
        path:"maintenance",
        element:<MaintenancePage/>
      },
      {
        path:"activity/add",
        element:<ActivityUpdate/>,
      },
      {
        path:"activity/:id",
        element:<ActivityDetail/>,
      },
      {
        path:"activity/assignment-logs",
        element:<AssignmentLogsPage/>
      },
      {
        path:"activity/maintenance-logs",
        element:<MaintenanceLogsPage/>
      },
      {
        path:"activity/activity-logs",
        element:<ActivityLogsPage/>
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
    { path: "assignment/:id",
        element: <AssignmentDetailPage />,
        },
    ],
  },
])