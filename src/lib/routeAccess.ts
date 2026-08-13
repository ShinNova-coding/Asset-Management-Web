type Permission = {
  name?: string
}

export const routeAccessRules = [
  { path: "/dashboard", permission: "view-dashboard" },
  { path: "/categories", permission: "view-categories" },
  { path: "/categories/add", permission: "create-categories" },
  { path: "/inventory", permission: "view-assets" },
  { path: "/inventory/add", permission: "create-assets" },
  { path: "/assignment", permission: "view-assignments" },
  { path: "/assignment/add", permission: "create-assignments" },
  { path: "/maintenance", permission: "view-maintenances" },
  { path: "/maintenance/:id", permission: "view-maintenances" },
  { path: "/maintenance/:id/complete", permission: "update-maintenances" },
  { path: "/activity", permission: "view-activitylogs" },
  { path: "/expense", permission: "view-expenses" },
  { path: "/expense/report", permission: "view-expenses" },
  { path: "/expense/createexpenseform", permission: "create-expenses" },
  { path: "/usermanagement", permission: "view-users" },
  { path: "/employees", permission: "view-users" },
  { path: "/employee/:id", permission: "view-users" },
  { path: "/add-employee", permission: "create-users" },
  { path: "/roles", permission: "view-roles" },
  { path: "/roles/create", permission: "create-roles" },
  { path: "/roles/:id", permission: "update-roles" },
]

export const getStoredPermissions = (): Permission[] => {
  const saved = localStorage.getItem("user_permissions")
  if (!saved) return []

  try {
    const parsed = JSON.parse(saved)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    localStorage.removeItem("user_permissions")
    return []
  }
}

const normalizeRole = (role: string | null) =>
  String(role || "").trim().toLowerCase()

const isRolePermission = (permission: string) =>
  permission.endsWith("-roles")

export const isAdminRole = () => {
  const role = normalizeRole(localStorage.getItem("user_role"))
  return role === "admin" || role === "super-admin" || role === "superadmin"
}

export const hasPermission = (permissions: Permission[], permission: string) =>
  (isAdminRole() && !isRolePermission(permission)) ||
  permissions.some((item) => item?.name === permission)

export const hasStoredPermission = (permission: string) =>
  hasPermission(getStoredPermissions(), permission)

export const getFirstAccessiblePath = (permissions = getStoredPermissions()) =>
  routeAccessRules.find((rule) => hasPermission(permissions, rule.permission))?.path || ""
