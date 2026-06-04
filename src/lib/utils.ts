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
