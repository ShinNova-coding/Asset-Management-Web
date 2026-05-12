import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import {
  LayoutDashboard,
  Boxes,
  Users,
  ClipboardList,
  Wrench,
  Monitor,
} from "lucide-react"
import { BsFillBoxFill } from "react-icons/bs"

import {
  Link,
  Outlet,
  useLocation,
} from "react-router-dom"

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

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50">

        {/* Sidebar */}
        <Sidebar className="w-[260px] border-r bg-[#F8FAFC]">

          {/* Logo */}
          <SidebarHeader className="px-6 py-8">
            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0070EB] shadow-md">
                <BsFillBoxFill className="text-white h-5 w-5"/>
              </div>

              <h1 className="text-xl font-bold text-slate-700">
                ITAMS
              </h1>

            </div>
          </SidebarHeader>

          {/* Menu */}
          <SidebarContent className="px-4">
            <SidebarMenu className="space-y-3">

              {menuItems.map((item) => {
                const isActive =
                  location.pathname === item.path

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton >

                      <Link
                        to={item.path}
                        className={`flex w-full items-center gap-4 rounded-xl px-4 py-3 transition-all

                        ${
                          isActive
                            ? "bg-blue-500 text-white shadow-md"
                            : "text-gray-600 hover:bg-gray-100"
                        }
                        `}
                      >
                        <item.icon className="h-5 w-5" />

                        <span className="text-[15px] font-medium">
                          {item.title}
                        </span>

                      </Link>

                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}

            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1 p-6">

          <SidebarTrigger />

          <div className="mt-4">
            <Outlet />
          </div>

        </main>
      </div>
    </SidebarProvider>
  )
}