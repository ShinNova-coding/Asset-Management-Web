"use client";

import React, { useState, useEffect } from "react";

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
  ChevronDown,
  Tag,
} from "lucide-react";

import { useNavigate, Outlet, useLocation } from "react-router-dom";
import Navigation from "@/components/ui/navigation";
import { BsFillBoxFill } from "react-icons/bs";
import { useAuth } from "@/hooks/useAuth";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard", permission: "view-dashboard" },
  { title: "Categories", icon: Tag, path: "/categories", permission: "view-categories" },
  { title: "Inventory", icon: Boxes, path: "/inventory", permission: "view-assets" },
  { title: "Assignment", icon: FileEdit, path: "/assignment", permission: "view-assignments" },
  { title: "Maintenance", icon: Wrench, path: "/maintenance", permission: "view-maintenances" },
  { title: "Expense", icon: ReceiptText, path: "/expense", permission: "view-expenses" },
  { title: "Activity", icon: ClipboardList, path: "/activity", permission: "view-activitylogs" },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { permissions } = useAuth();

  const currentPath = location.pathname.toLowerCase();

  // User Module တွေအောက် ရောက်နေသလား စစ်ဆေးချက် (Safety Net ပိုစိပ်အောင် /edit စာသားပါ ထည့်စစ်ပေးထားပါတယ်)
  const isUserModuleActive =
    currentPath.startsWith("/usermanagement") ||
    currentPath.startsWith("/roles") ||
    currentPath.startsWith("/add-employee") ||
    currentPath.includes("user") ||
    currentPath.includes("employee");

  const isUsersSubItemActive =
    currentPath.startsWith("/usermanagement") ||
    currentPath.startsWith("/add-employee") ||
    currentPath.includes("employee");

  // State initialization ကို ပထမဆုံးဝင်ကတည်းက လမ်းကြောင်းအလိုက် ပွင့်လျက်သားဖြစ်အောင် ထားခြင်း
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(() => isUserModuleActive);

  useEffect(() => {
    if (isUserModuleActive) {
      setIsUserMenuOpen(true);
    }
  }, [currentPath, isUserModuleActive]);

  // ဒုက္ခပေးနေတဲ့ ထိပ်ဆုံးက Block ဖြစ်စေမယ့် Return Loading ကို ဖယ်ထုတ်ပြီး Boolean ပြောင်းလိုက်ပါတယ်
  const isLoading = !permissions || !Array.isArray(permissions);

  const permissionNames = isLoading
    ? []
    : permissions.map((p: any) => (typeof p === "string" ? p : p.name));

  const filteredMenuItems = menuItems.filter((item) =>
    permissionNames.includes(item.permission)
  );

  const hasUserManagementPermission = permissionNames.includes("view-users");
  const hasRolesPermission = permissionNames.includes("view-roles");

  // Loading ဖြစ်နေရင်တောင် ဒီလမ်းကြောင်းပေါ်မှာ ရှိနေရင် User Management Button ကို DOM ကနေ လုံးဝအပျောက်မခံဘဲ အတင်းပြထားမယ့် Logic
  const showUserManagementMenu = isLoading ? isUserModuleActive : (hasUserManagementPermission || hasRolesPermission || isUserModuleActive);

  return (
    <SidebarProvider style={{ "--sidebar-width": "240px" } as React.CSSProperties}>
      <div className="flex min-h-screen w-full bg-[#F0F4F8]">
        {/* Sidebar Section - ၎င်းတည်ဆောက်ပုံကြီးတစ်ခုလုံး ဘယ်တော့မှ Unmount မဖြစ်တော့ပါ */}
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
              {isLoading ? (
                // ခေတ္တ Loading ဖြစ်ချိန်မှာ Sidebar ကြီး ပျောက်မသွားဘဲ စာသားလေးပဲ ငြိမ်ငြိမ်လေး ပြထားမယ်
                <div className="px-4 py-3 text-blue-300 text-xs animate-pulse">
                  Loading Menu...
                </div>
              ) : (
                <>
                  {/* Regular Filtered Menu Items */}
                  {filteredMenuItems.map((item) => {
                    const isActive =
                      currentPath.startsWith(item.path.toLowerCase()) ||
                      (item.path === "/dashboard" && currentPath === "/");

                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          onClick={() => navigate(item.path)}
                          className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? "bg-blue-500 text-[#1E3A8A]"
                              : "text-blue-200 hover:bg-blue-800/50 hover:text-white"
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                          {item.title}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </>
              )}

              {/* Collapsible User Management & Roles Menu */}
              {showUserManagementMenu && (
                <SidebarMenuItem>
                  {/* Dropdown Parent Header Button */}
                  <SidebarMenuButton
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      isUserModuleActive
                        ? "text-white font-semibold bg-blue-800/40"
                        : "text-blue-200 hover:bg-blue-800/50 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5" />
                      <span>User Management</span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isUserMenuOpen ? "transform rotate-180" : ""
                      }`}
                    />
                  </SidebarMenuButton>

                  {/* Dropdown Sub-Items */}
                  {isUserMenuOpen && (
                    <div className="mt-1 pl-4 space-y-1 border-l border-blue-800/60 ml-6">
                      {/* Sub item: Users - Loading ဖြစ်နေရင်တောင် လက်ရှိလမ်းကြောင်းအရ ပြထားပေးမယ် */}
                      {(hasUserManagementPermission || isUserModuleActive || isLoading) && (
                        <SidebarMenuButton
                          onClick={() => navigate("/usermanagement")}
                          className={`flex w-full items-center gap-3 rounded-lg px-4 py-2 text-xs font-medium transition-all duration-200 ${
                            isUsersSubItemActive
                              ? "bg-blue-300 text-[#1E3A8A]"
                              : "text-blue-300 hover:bg-blue-800/30 hover:text-white"
                          }`}
                        >
                          <Users className="h-4 w-4" />
                          <span>Users</span>
                        </SidebarMenuButton>
                      )}

                      {/* Sub item: Roles */}
                      {(hasRolesPermission || currentPath.startsWith("/roles") || (isLoading && currentPath.startsWith("/roles"))) && (
                        <SidebarMenuButton
                          onClick={() => navigate("/roles")}
                          className={`flex w-full items-center gap-3 rounded-lg px-4 py-2 text-xs font-medium transition-all duration-200 ${
                            currentPath.startsWith("/roles")
                              ? "bg-blue-300 text-[#1E3A8A]"
                              : "text-blue-300 hover:bg-blue-800/30 hover:text-white"
                          }`}
                        >
                          <UserCog className="h-4 w-4" />
                          <span>Roles</span>
                        </SidebarMenuButton>
                      )}
                    </div>
                  )}
                </SidebarMenuItem>
              )}

              {/* Fallback Screen */}
              {!isLoading && filteredMenuItems.length === 0 && !showUserManagementMenu && (
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
            {isLoading ? (
              // ကာကွယ်ရေးအနေနဲ့ Content ဧရိယာအလယ်ထဲမှာပဲ Loading ပြပေးထားပါတယ် (Sidebar ကြီး မထိခိုက်တော့ပါ)
              <div className="h-full flex items-center justify-center text-[#1E3A8A] font-medium bg-[#F0F4F8]">
                Loading Content Data...
              </div>
            ) : (
              <Outlet />
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}