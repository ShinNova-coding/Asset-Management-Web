
<<<<<<< HEAD

import { createBrowserRouter, Route } from "react-router-dom"
=======
import { createBrowserRouter } from "react-router-dom"
>>>>>>> cca06b79544e61ad788920573e833ef7316e763c

import Login from "@/pages/Auth/Login"


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
import AssignmentEditPage from "@/pages/Assignment/AssignmentEditPage"
import AssetListPage from "@/components/features/Dashboard/AssetListPage"

export const router = createBrowserRouter([
  
  {
    path: "/",
    element: <Login />,
  },
  
  

  
  {
    element: <ProtectedRoute />, 
    children: [
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
            path: "inventory/add",
            element: <AddNewAsset />,
          },
          {
            path: "inventory/:id/edit",
            element: <AddNewAsset />,
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
            path: "assignment/add",
            element: <Assign />,
          },
          {
            path: "assignment/:id",
            element: <AssignmentDetailPage />,
          },
          {
            path: "assignment/edit/:id",
            element: <AssignmentEditPage />, 
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
        ],
      },
<<<<<<< HEAD
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
    path: "employees",
    element: <EmployeeListPage />,
  },
  {
    path: "employee/:id",
    element: <EmployeeDetailsPage />,
  },
       {
        path: "maintenance/:id",
        element: <MaintenanceDetailsForm />,
  },

 


    { path: "assignment/:id",
        element: <AssignmentDetailPage />,
        },
=======
>>>>>>> cca06b79544e61ad788920573e833ef7316e763c
    ],
  },
])