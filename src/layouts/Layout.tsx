"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"

import {
  LayoutDashboard,
  Boxes,
  Users,
  FileEdit,
  ClipboardList,
  Wrench,
  UserCog,
  ReceiptText // Added UserCog icon
} from "lucide-react"

import { useNavigate, Outlet, useLocation } from "react-router-dom"
import Navigation from "@/components/ui/navigation"
import { BsFillBoxFill } from "react-icons/bs"

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "Inventory",
    icon: Boxes,
    path: "/inventory",
  },
  {
    title: "Assignment",
    icon: FileEdit,
    path: "/assignment",
  },
  {
    title: "Maintenance",
    icon: Wrench,
    path: "/maintenance",
  },
  {
    title: "Expense",
    icon: ReceiptText,
    path: "/expense",
  },

{
    title: "UserManagement",
    icon: Users,
    path: "/usermanagement",
  },
  {
    title: "Roles",
    icon: UserCog, // Updated to UserCog for better visual distinction
    path: "/roles",
  },
  {
    title: "Activity",
    icon: ClipboardList,
    path: "/activity",
  },
]

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <SidebarProvider style={{ "--sidebar-width": "240px" } as any}>
      {/* Light blue-grey page background */}
      <div className="flex min-h-screen w-full bg-[#F0F4F8]">

        {/* SIDEBAR: Professional Deep Blue-Slate */}
        <Sidebar className="border-r border-blue-100 bg-[#1E3A8A]">
          <SidebarContent className="bg-[#1E3A8A] px-4 py-8">

            {/* LOGO AREA */}
            <div className="flex items-center gap-3 px-2 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 shadow-lg shadow-blue-900/20">
                <BsFillBoxFill className="text-white h-6 w-6"/>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white">ITAMS</h1>
            </div>

            {/* MENU: Light Blue-themed states */}
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path) || 
                  (item.path === "/dashboard" && location.pathname === "/")

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => navigate(item.path)}
                      className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-blue-500 text-white shadow-md" 
                          : "text-blue-200 hover:bg-blue-800/50 hover:text-white"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.title}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        {/* RIGHT CONTENT */}
        <div className="flex flex-1 flex-col">
          {/* Header with light blue tint */}
          <div className="w-full bg-white/80 backdrop-blur-sm border-b border-blue-100 z-20">
            <Navigation />
          </div>

          <main className="flex-1  overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}