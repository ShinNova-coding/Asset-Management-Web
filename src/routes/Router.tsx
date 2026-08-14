import { createBrowserRouter, Navigate } from "react-router-dom"
import type React from "react"

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
import MaintenanceEditPage from "@/pages/Maintenance/MaintenanceEditPage"
import AddEmployeeForm from "@/pages/UserManagement/AddNewEmployee"
import AddNewAsset from "@/pages/Inventory/AddNewAsset"
import { InventoryDetail } from "@/components/features/Inventory/InventoryDetail"
import EmployeeDetailsPage from "@/pages/UserManagement/EmployeeDetailsPage"
import MaintenanceDetailsForm from "@/components/features/Maintenance/MaintenanceDetailsForm"
import AssignmentDetailPage from "@/components/features/Assignment/AssignmentDetailPage"
import AssignmentEditPage from "@/pages/Assignment/AssignmentEditPage"
import EditRolePage from "@/pages/Roles/EditRolePage"
import CategoriesPage from "@/pages/Categories/CategoriesPage"
import ExpensePage from "@/pages/Expense/ExpensePage" 
import { CreateExpenseForm } from "@/pages/Expense/CreateExpenseForm"
import ExpenseDashboard from "@/components/features/dashboard/ExpenseDashboard";
import AddNewCategories from "@/pages/Categories/AddNewCategories"
import { getFirstAccessiblePath, getStoredPermissions, hasPermission } from "@/lib/utils"

function RequirePermission({
  permission,
  permissions: allowedPermissions,
  children,
}: {
  permission?: string
  permissions?: string[]
  children: React.ReactNode
}) {
  const permissions = getStoredPermissions()
  const requiredPermissions = allowedPermissions || (permission ? [permission] : [])

  if (requiredPermissions.some((item) => hasPermission(permissions, item))) {
    return <>{children}</>
  }

  const fallbackPath = getFirstAccessiblePath(permissions)

  if (fallbackPath) {
    return <Navigate to={fallbackPath} replace />
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#e9e5ff] p-6 text-center">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-lg font-bold text-[#7C3AED]">No Access</h1>
        <p className="mt-2 text-sm text-slate-500">Your account does not have permission to view this page.</p>
      </div>
    </div>
  )
}
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
            element: <RequirePermission permission="view-dashboard"><DashboardPage /></RequirePermission>,
          },
          {
            path:"categories",
            element:<RequirePermission permission="view-categories"><CategoriesPage/></RequirePermission>
          },
          {
            path:"categories/add",
          element:<RequirePermission permission="create-categories"><AddNewCategories/></RequirePermission>,
          },
          
          {
            path: "inventory",
            element: <RequirePermission permission="view-assets"><InventoryPage /></RequirePermission>,
          },
          {
            path: "inventory/add",
            element: <RequirePermission permission="create-assets"><AddNewAsset /></RequirePermission>,
          },
          {
            path: "inventory/:id/edit",
            element: <RequirePermission permission="update-assets"><AddNewAsset /></RequirePermission>,
          },
          {
            path: "inventory/:id",
            element: <RequirePermission permission="view-assets"><InventoryDetail /></RequirePermission>,
          },
          
          {
            path: "usermanagement",
            element: <RequirePermission permission="view-users"><UserManagementPage /></RequirePermission>,
          },
          
          {
            path: "assignment",
            element: <RequirePermission permission="view-assignments"><AssignmentPage /></RequirePermission>,
          },
          {
            path: "assignment/add",
            element: <RequirePermission permission="create-assignments"><Assign /></RequirePermission>,
          },
          {
            path: "assignment/:id",
            element: <RequirePermission permission="view-assignments"><AssignmentDetailPage /></RequirePermission>,
          },
          {
            path: "assignment/edit/:id",
            element: <RequirePermission permission="update-assignments"><AssignmentEditPage /></RequirePermission>, 
          },
          
          {
            path: "activity",
            element: <RequirePermission permission="view-activitylogs"><ActivityPage /></RequirePermission>,
          },
          
          {
            path: "maintenance",
            element: <RequirePermission permission="view-maintenances"><MaintenancePage /></RequirePermission>,
          },
          {
            path: "maintenance/:id/complete",
            element: <RequirePermission permission="update-maintenances"><MaintenanceEditPage /></RequirePermission>,
          },
          {
            path: "maintenance/:id",
            element: <RequirePermission permission="view-maintenances"><MaintenanceDetailsForm /></RequirePermission>,
          },

          {
            path: "employees",
            element: <RequirePermission permission="view-users"><UserManagementPage /></RequirePermission>,
          },
          {
            path: "add-employee",
            element: <RequirePermission permissions={["create-users", "update-users"]}><AddEmployeeForm /></RequirePermission>,
          },
          {
            path: "profile/edit",
            element: <AddEmployeeForm />,
          },
          
          {
            path: "employee/:id",
            element: <RequirePermission permission="view-users"><EmployeeDetailsPage /></RequirePermission>,
          },

          {
            path: "roles",
            element: <RequirePermission permission="view-roles"><RolePage /></RequirePermission>
          },
          {
            path:"roles/:id",
            element:<RequirePermission permission="update-roles"><EditRolePage/></RequirePermission>,
          },
          {
            path: "roles/create",
            element: <RequirePermission permission="create-roles"><CreateRolePage /></RequirePermission>
          },

          {
            path: "expense",
            element: <RequirePermission permission="view-expenses"><ExpensePage /></RequirePermission>
          },
          // Inside your createBrowserRouter children array
{
  path: "expense/report", // The URL path for this new view
  element: <RequirePermission permission="view-expenses"><ExpenseDashboard /></RequirePermission>,
},

          {
            path: "expense/createexpenseform",
            element: <RequirePermission permission="create-expenses"><CreateExpenseForm /></RequirePermission>
          },
        ],
      },
    ],
  },
])
