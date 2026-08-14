import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type Permission = {
  id?: number | string
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

const normalizeRole = (role: string | null) =>
  String(role || "").trim().toLowerCase()

const getCachedRolePermissions = (role: string | null): Permission[] => {
  const normalizedRole = normalizeRole(role)
  if (!normalizedRole) return []

  try {
    const cache = JSON.parse(localStorage.getItem("role_permission_cache") || "{}")
    const permissions = cache[normalizedRole]
    return Array.isArray(permissions) ? permissions : []
  } catch {
    return []
  }
}

const getFallbackPermissionsForRole = (role: string | null): Permission[] => {
  const normalizedRole = normalizeRole(role)

  if (normalizedRole === "manager") {
    return [{ name: "view-dashboard" }]
  }

  return []
}

export const getStoredPermissions = (): (string | Permission)[] => {
  const saved = localStorage.getItem("user_permissions")
  const role = localStorage.getItem("user_role")

  try {
    const parsed = saved ? JSON.parse(saved) : []
    const storedPermissions = Array.isArray(parsed) ? parsed : []
    if (storedPermissions.length > 0) return storedPermissions
  } catch {
    localStorage.removeItem("user_permissions")
  }

  const cachedPermissions = getCachedRolePermissions(role)
  if (cachedPermissions.length > 0) return cachedPermissions

  return getFallbackPermissionsForRole(role)
}

const isRolePermission = (permission: string) =>
  permission.endsWith("-roles")

export const isAdminRole = () => {
  const role = normalizeRole(localStorage.getItem("user_role"))
  return (
    role === "admin" ||
    role === "super-admin" ||
    role === "superadmin" ||
    role === "system-admin" ||
    role === "system admin"
  )
}

export const isSuperAdmin = () => {
  const role = normalizeRole(localStorage.getItem("user_role"))
  return (
    role === "super-admin" ||
    role === "superadmin" ||
    role === "system-admin" ||
    role === "system admin"
  )
}

export const hasPermission = (permissions: (string | Permission)[], permission: string) =>
  isSuperAdmin() ||
  (isAdminRole() && !isRolePermission(permission)) ||
  permissions.some((item) =>
    typeof item === "string"
      ? item.toLowerCase() === permission.toLowerCase()
      : item?.name?.toLowerCase() === permission.toLowerCase()
  )

export const hasStoredPermission = (permission: string) =>
  hasPermission(getStoredPermissions(), permission)

export const getFirstAccessiblePath = (permissions = getStoredPermissions()) =>
  routeAccessRules.find((rule) => {
    if (rule.path.includes(":")) return false
    if (["create-", "update-", "delete-"].some((prefix) => rule.permission.startsWith(prefix))) return false
    return hasPermission(permissions, rule.permission)
  })?.path || ""

export function normalizeImageSource(value?: string | null): string {
  const fallback = "https://via.placeholder.com/120"
  if (!value) return fallback

  const trimmed = value.trim()
  if (!trimmed) return fallback

  if (/^data:image\/[a-zA-Z]+;base64,/.test(trimmed)) {
    return trimmed
  }

  if (/^\/(storage|uploads|images)\//i.test(trimmed)) {
    return `http://192.168.100.163:1011${trimmed}`
  }

  if (/^(storage|uploads|images)\//i.test(trimmed)) {
    return `http://192.168.100.163:1011/${trimmed}`
  }

  if (/^(https?:\/\/|\/|blob:)/i.test(trimmed)) {
    return trimmed
  }

  const base64String = trimmed.includes(",") ? trimmed.split(",")[1] : trimmed
  const cleanedBase64 = base64String.replace(/\s+/g, "")

  if (/^[A-Za-z0-9+/]+={0,2}$/.test(cleanedBase64)) {
    return `data:image/png;base64,${cleanedBase64}`
  }

  return trimmed
}

export function getImageValue(record: any): string | null {
  if (!record) return null

  const candidates = [
    record.image,
    record.profileImage,
    record.profile_image,
    record.profile_photo,
    record.avatar,
    record.avatar_url,
    record.photo,
    record.photo_url,
    record.preview_url,
    record.image_url,
    record.original_url,
    record.path,
    record.url,
    record.user?.image,
    record.user?.profileImage,
    record.user?.profile_image,
    record.user?.profile_photo,
    record.user?.avatar,
    record.user?.avatar_url,
    record.user?.photo,
    record.user?.photo_url,
    record.user?.preview_url,
    record.user?.image_url,
    record.media?.[0]?.preview_url,
    record.media?.[0]?.original_url,
    record.media?.[0]?.url,
    record.media?.[0]?.path,
  ]

  for (const candidate of candidates) {
    if (!candidate) continue

    if (typeof candidate === "string") {
      return candidate
    }

    if (Array.isArray(candidate)) {
      const nested = getImageValue(candidate[0])
      if (nested) return nested
    }

    if (typeof candidate === "object") {
      const nested = getImageValue(candidate)
      if (nested) return nested
    }
  }

  return null
}

const PROFILE_IMAGE_CACHE_KEY = "user_profile_images"

const getProfileImageCacheKeys = (record: any) => {
  if (!record) return []

  return [
    record.email,
    record.employee_id,
    record.id,
  ]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase())
}

export function cacheProfileImage(record: any) {
  const imageValue = getImageValue(record)
  const keys = getProfileImageCacheKeys(record)
  if (!imageValue || keys.length === 0) return

  try {
    const cache = JSON.parse(localStorage.getItem(PROFILE_IMAGE_CACHE_KEY) || "{}")
    keys.forEach((key) => {
      cache[key] = imageValue
    })
    localStorage.setItem(PROFILE_IMAGE_CACHE_KEY, JSON.stringify(cache))
  } catch {
    localStorage.removeItem(PROFILE_IMAGE_CACHE_KEY)
  }
}

export function getCachedProfileImage(record: any): string | null {
  const keys = getProfileImageCacheKeys(record)
  if (keys.length === 0) return null

  try {
    const cache = JSON.parse(localStorage.getItem(PROFILE_IMAGE_CACHE_KEY) || "{}")
    const cachedValue = keys.map((key) => cache[key]).find(Boolean)
    return cachedValue || null
  } catch {
    localStorage.removeItem(PROFILE_IMAGE_CACHE_KEY)
    return null
  }
}
