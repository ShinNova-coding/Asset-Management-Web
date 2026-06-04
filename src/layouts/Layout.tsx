"use client"

import { useState } from "react"
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
  ChevronDown,
  ChevronUp
} from "lucide-react"

import {
  useNavigate,
  Outlet,
  useLocation,
} from "react-router-dom"
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
    title: "UserManagement",
    icon: Users,
    path: "/usermanagement",
  },
  
  {
    title: "Activity",
    icon: ClipboardList,
    path: "/activity",
    // Added children items for the dropdown
    children: [
      { title: "Maintenance Logs", path: "/activity/maintenance-logs" },
      { title: "Assignment Logs", path: "/activity/assignment-logs" },
      { title: "Activity Logs", path: "/activity/activity-logs" },
    ]
  },
]

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  
  // State to track if the Activity dropdown is open
  const [isActivityOpen, setIsActivityOpen] = useState(false)

  return (
    <SidebarProvider style={{ "--sidebar-width": "220px" } as any}>
      <div className="flex min-h-screen w-full bg-[#F8FAFC]">

        {/* SIDEBAR (Completely Untouched Left Side) */}
        <Sidebar className="border-r border-slate-400 bg-white-100">
          <SidebarContent className="bg-blue-50 px-4 py-6">

            {/* LOGO */}
            <div className="hidden h-7 w-[1px] -mt-10 bg-slate-200 md:block" />
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center ml-8 justify-center rounded-xl bg-[#0070EB] shadow-md">
                <BsFillBoxFill className="text-white h-6 w-6"/>
              </div>
              <h1 className="text-2xl font-bold tracking-wide mr-8 ml-0 text-[#0070EB]">
                ITAMS
              </h1>
            </div>

            {/* MENU */}
            <SidebarMenu className="space-y-3 mt-6">
              {menuItems.map((item) => {
                const hasChildren = !!item.children
                
                // Active logic for parent menu items
                const isActive = hasChildren 
                  ? location.pathname.startsWith(item.path)
                  : location.pathname.startsWith(item.path) || (item.path === "/dashboard" && location.pathname === "/")

                return (
                  <SidebarMenuItem key={item.title}>
                    {hasChildren ? (
                      /* DROPDOWN PARENT BUTTON */
                      <div>
                        <SidebarMenuButton
                          onClick={() => setIsActivityOpen(!isActivityOpen)}
                          className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-md font-medium transition-colors ${
                            isActive
                              ? "bg-blue-100 text-blue-600" 
                              : "text-slate-600 hover:bg-blue-100 hover:text-blue-600"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon className="h-5 w-5" />
                            {item.title}
                          </div>
                          {isActivityOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </SidebarMenuButton>

                        {/* DROPDOWN CHILD SUBMENU */}
                        {isActivityOpen && (
                          <div className="mt-2 ml-6 space-y-1 border-l-2 border-slate-200 pl-2 transition-all">
                            {item.children?.map((child) => {
                              const isChildActive = location.pathname === child.path
                              return (
                                <button
                                  key={child.title}
                                  onClick={() => navigate(child.path)}
                                  className={`flex w-full items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                                    isChildActive
                                      ? "bg-blue-500 text-white shadow-sm"
                                      : "text-slate-500 hover:bg-blue-100 hover:text-blue-600"
                                  }`}
                                >
                                  {child.title}
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    ) : (
                      /* REGULAR BUTTON (No Dropdown) */
                      <SidebarMenuButton
                        onClick={() => navigate(item.path)}
                        className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-md font-medium transition-colors ${
                          isActive
                            ? "bg-blue-500 text-white shadow-sm hover:bg-blue-500" 
                            : "text-slate-600 hover:bg-blue-100 hover:text-blue-600"
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.title}
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        {/* RIGHT CONTENT */}
        <div className="flex flex-1 flex-col">

          {/* TOP BAR ACTION PANEL */}
          <div className="relative w-full bg-white flex items-center justify-between h-16">
            <div className="flex-1">
              <Navigation />
            </div>
          </div>

          {/* PAGE CONTENT */}
          <main className="flex-1 px-4 pt-4 pb-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}