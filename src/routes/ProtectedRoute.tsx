// src/routes/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom"

export default function ProtectedRoute() {
  const token = localStorage.getItem("token")

  // If there is no token, force redirect them to the Login page
  if (!token) {
    return <Navigate to="/" replace />
  }

  // If there is a token, allow access to the child route components
  return <Outlet />
}