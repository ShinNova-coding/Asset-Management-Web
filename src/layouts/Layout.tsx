// Layout.tsx

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
  ClipboardList,
  Wrench,
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
    title: "UserManagement",
    icon: Users,
    path: "/usermanagement",
  },
  {
    title: "Activity",
    icon: ClipboardList,
    path: "/activity",
  },
  {
    title: "Maintenance",
    icon: Wrench,
    path: "/maintenance",
  },
]

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#F8FAFC]">

        {/* SIDEBAR */}
        <Sidebar className="w-[255px] border-r border-slate-400 bg-white-100">

          <SidebarContent className="bg-blue-50 px-4 py-6">

            {/* LOGO */}
               <div className="hidden h-7 w-[1px] -mt-10 bg-slate-200 md:block" />
         <div className="flex items-center gap-2">

              <div className="flex h-10 w-10 items-center ml-8 justify-center rounded-xl bg-[#0070EB] shadow-md">
                <BsFillBoxFill className="text-white  h-6 w-6"/>
              </div>

              <h1 className="text-2xl font-bold tracking-wide  mr-8 ml-0 text-[#0070EB]">
                ITAMS
              </h1>
               </div>

            {/* MENU */}
            <SidebarMenu className="space-y-3 mt-6">

              {menuItems.map((item) => {
                const isActive =
                  location.pathname.startsWith(item.path) ||
                  (item.path === "/dashboard" &&
                    location.pathname === "/")

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                        onClick={() => navigate(item.path)}
                        className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-md font-medium transition-colors ${
                          isActive
                           ? "bg-blue-500 text-white shadow-sm hover:bg-blue-500" 
                            : "text-slate-600 hover:bg-blue-100 hover:text-blue-600"}
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

          {/* NAVIGATION */}
          <Navigation />

          {/* PAGE CONTENT */}
          <main className="flex-1 p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}