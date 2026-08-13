import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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
