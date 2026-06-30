"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";

import {
  LayoutDashboard,
  Boxes,
  Users,
  FileEdit,
  ClipboardList,
  Wrench,
  UserCog,
  ReceiptText,
} from "lucide-react";

import { useNavigate, Outlet, useLocation } from "react-router-dom";
import Navigation from "@/components/ui/navigation";
import { BsFillBoxFill } from "react-icons/bs";
import { useAuth } from "@/hooks/useAuth";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard", permission: "view-dashboard" },
  { title: "Inventory", icon: Boxes, path: "/inventory", permission: "view-assets" },
  { title: "Assignment", icon: FileEdit, path: "/assignment", permission: "view-assignments" },
  { title: "Maintenance", icon: Wrench, path: "/maintenance", permission: "view-maintenances" },
  { title: "Expense", icon: ReceiptText, path: "/expense", permission: "view-expenses" },
  { title: "UserManagement", icon: Users, path: "/usermanagement", permission: "view-users" },
  { title: "Roles", icon: UserCog, path: "/roles", permission: "view-roles" },
  { title: "Activity", icon: ClipboardList, path: "/activity", permission: "view-activitylogs" },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { permissions } = useAuth();

  // Array ဖြစ်မဖြစ်နဲ့ Data ရှိမရှိ စစ်ဆေးခြင်း
  if (!permissions || !Array.isArray(permissions)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F4F8] text-[#1E3A8A] font-medium">
        Loading Auth Data...
      </div>
    );
  }

  // API မှလာသော Permission များသည် Object (ဥပမာ - {name: 'view-assets'}) သို့မဟုတ် String ဖြစ်နေနိုင်သဖြင့် Name များကိုသာ စစ်ထုတ်ခြင်း
  const permissionNames = permissions.map((p: any) => {
    return typeof p === "string" ? p : p.name;
  });
console.log("3. Data inside Layout:", permissions);
  console.log("4. Extracted Names:", permissionNames);
  // လက်ရှိ User တွင်ရှိသော Permission များနှင့် ကိုက်ညီမည့် Menu များကိုသာ ရွေးချယ်ခြင်း
  const filteredMenuItems = menuItems.filter((item) =>
    permissionNames.includes(item.permission)
  );

  return (
    <SidebarProvider style={{ "--sidebar-width": "240px" } as React.CSSProperties}>
      <div className="flex min-h-screen w-full bg-[#F0F4F8]">
        {/* Sidebar Section */}
        <Sidebar className="border-r border-blue-100 bg-[#1E3A8A]">
          <SidebarContent className="bg-[#1E3A8A] px-4 py-8">
            {/* Logo and Title */}
            <div className="flex items-center gap-3 px-2 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 shadow-lg shadow-blue-900/20">
                <BsFillBoxFill className="text-white h-6 w-6" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white">ITAMS</h1>
            </div>

            {/* Navigation Menu */}
            <SidebarMenu className="space-y-1">
              {filteredMenuItems.length > 0 ? (
                filteredMenuItems.map((item) => {
                  const isActive =
                    location.pathname.startsWith(item.path) ||
                    (item.path === "/dashboard" && location.pathname === "/");

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        onClick={() => navigate(item.path)}
                        className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-blue-300 "
                            : "text-blue-200 hover:bg-blue-800/50 hover:text-white"
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.title}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              ) : (
                <div className="px-4 text-blue-300 text-xs italic">
                  No menu access available.
                </div>
              )}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col">
          <div className="w-full bg-white/80 backdrop-blur-sm border-b border-blue-100 z-20">
            <Navigation />
          </div>
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}