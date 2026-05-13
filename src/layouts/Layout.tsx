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

} from "lucide-react"
import { BsFillBoxFill } from "react-icons/bs"

import {
  useNavigate,
  Outlet,
  useLocation,
} from "react-router-dom"

import Navigation from "@/components/ui/navigation"

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
  <>
    <Navigation/>

    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50">

        {/* Sidebar */}
        <Sidebar className="w-[250px] border-r bg-[#F8FAFC]">

          {/* Logo */}
          <SidebarHeader className="px-4 py-4">
            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 ml-4 items-center justify-center rounded-xl bg-[#0070EB] shadow-md">
                <BsFillBoxFill className="text-white  h-5 w-5"/>
              </div>

              <h1 className="text-xl font-bold tracking-wide  text-[#0070EB]">
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
                    <SidebarMenuButton
                onClick={() => navigate(item.path)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors

                ${
                  isActive
                    ? "bg-blue-500 text-white shadow-sm hover:bg-blue-500"
                    : "text-slate-600 hover:bg-blue-100 hover:text-blue-600"
                }
                `}
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

        {/* Main Content */}
        <main className="flex-1 p-6">

          <SidebarTrigger />

          <div className="mt-4">
            <Outlet />
          </div>

        </main>
      </div>
    </SidebarProvider> </>
  )
}