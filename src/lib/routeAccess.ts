type Permission = {
  name?: string
}

export const routeAccessRules = [
  { path: "/dashboard", permission: "view-dashboard" },
  { path: "/categories", permission: "view-categories" },
  { path: "/categories/add", permission: "view-categories" },
  { path: "/inventory", permission: "view-assets" },
  { path: "/inventory/add", permission: "view-assets" },
  { path: "/assignment", permission: "view-assignments" },
  { path: "/assignment/add", permission: "view-assignments" },
  { path: "/maintenance", permission: "view-maintenances" },
  { path: "/activity", permission: "view-activitylogs" },
  { path: "/expense", permission: "view-expenses" },
  { path: "/expense/report", permission: "view-expenses" },
  { path: "/expense/createexpenseform", permission: "view-expenses" },
  { path: "/usermanagement", permission: "view-users" },
  { path: "/employees", permission: "view-users" },
  { path: "/add-employee", permission: "view-users" },
  { path: "/roles", permission: "view-roles" },
  { path: "/roles/create", permission: "view-roles" },
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

export const hasPermission = (permissions: Permission[], permission: string) =>
  permissions.some((item) => item?.name === permission)

export const getFirstAccessiblePath = (permissions = getStoredPermissions()) =>
  routeAccessRules.find((rule) => hasPermission(permissions, rule.permission))?.path || ""

