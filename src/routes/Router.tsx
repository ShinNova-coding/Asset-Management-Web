// src/routes/Router.tsx
import { createBrowserRouter } from "react-router-dom"
import Login from "../pages/Auth/Login"
import Dashboard from "@/pages/Dashboard/Dashboard"

export const router = createBrowserRouter([
 
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
])
