// src/routes/Router.tsx
import { createBrowserRouter } from "react-router-dom"
import Login from "../pages/Auth/Login"
import Dashboard from "@/pages/Dashboard/Dashboard"
import Layout from "../layouts/Layout"

export const router = createBrowserRouter([
 
  {
    path: "/",
    element: <Login />,
  },
 
  {
    path: "/dashboard",
    element: <Layout />, children: [
      {
        index: true,
        element: <Dashboard />,
      },
    ],
    
  },

])
