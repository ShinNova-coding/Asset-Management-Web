import { createBrowserRouter } from "react-router-dom"

import Login from "@/pages/Auth/Login"
import Layout from "@/layouts/Layout"
import ProtectedRoute from "./ProtectedRoute"

import DashboardPage from "@/pages/Dashboard/DashboardPage"
import InventoryPage from "@/pages/Inventory/InventoryPage"
import AssignmentPage from "@/pages/Assignment/AssignmentPage"
import Assign from "@/pages/Assignment/Assign"
import UserManagementPage from "@/pages/UserManagement/UserManagementPage"
import ActivityPage from "@/pages/Activity/ActivityPage"
import RolePage from "@/pages/Roles/RolePage" 
import CreateRolePage from "@/pages/Roles/CreateRolePage"
import MaintenancePage from "@/pages/Maintenance/MaintenancePage"
import AddEmployeeForm from "@/pages/UserManagement/AddNewEmployee"
import AddNewAsset from "@/pages/Inventory/AddNewAsset"
import { InventoryDetail } from "@/components/features/Inventory/InventoryDetail"
import EmployeeListPage from "@/pages/UserManagement/EmployeeListPage"
import EmployeeDetailsPage from "@/pages/UserManagement/EmployeeDetailsPage"
import MaintenanceDetailsForm from "@/components/features/Maintenance/MaintenanceDetailsForm"
import AssignmentDetailPage from "@/components/features/Assignment/AssignmentDetailPage"
import AssignmentEditPage from "@/pages/Assignment/AssignmentEditPage"
import EditRolePage from "@/pages/Roles/EditRolePage"

import ExpensePage from "@/pages/Expense/ExpensePage" 
import ExpenseTable from "@/pages/Expense/ExpenseTable" 
import { CreateExpenseForm } from "@/pages/Expense/CreateExpenseForm"

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
            path: "maintenance/:id",
            element: <MaintenanceDetailsForm />,
          },

          {
            path: "employees",
  element: <UserManagementPage />,
          },
          {
            path: "add-employee",
            element: <AddEmployeeForm />,
          },
          {
            path: "employee/:id",
            element: <EmployeeDetailsPage />,
          },

          {
            path: "roles",
            element: <RolePage />
          },
          {
            path:"roles/:id",
            element:<EditRolePage/>,
          },
          {
            path: "roles/create",
            element: <CreateRolePage />
          },

          {
            path: "expense",
            element: <ExpensePage />
          },

          {
            path: "expense/createexpenseform",
            element: <CreateExpenseForm />
          },
        ],
      },
    ],
  },
])