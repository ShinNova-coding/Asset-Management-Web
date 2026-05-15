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
      <div className="flex flex-col min-h-screen w-full bg-blue-50">
        <Navigation />

        <div className="flex flex-1">
          <Sidebar className="w-[250px] border-none">
            <SidebarContent className="px-4 py-20 border-r border-slate-400 bg-[#F8FAFC]">
              <SidebarMenu className="space-y-3">
                {menuItems.map((item) => {
                  const isActive = location.pathname.startsWith(item.path)

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        onClick={() => navigate(item.path)}
                        className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
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

          <main className="flex-1 p-6">
            <div className="mt-4">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}