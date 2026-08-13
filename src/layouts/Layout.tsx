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
import { BsBoxFill } from "react-icons/bs";
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

  
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(() => isUserModuleActive);

  useEffect(() => {
    if (isUserModuleActive) {
      setIsUserMenuOpen(true);
    }
  }, [currentPath, isUserModuleActive]);

  
  const isLoading = !permissions || !Array.isArray(permissions);

  const permissionNames = isLoading
    ? []
    : permissions
        .map((permission: any) => (
          typeof permission === "string" ? permission : permission?.name
        ))
        .filter(Boolean);

  const hasSidebarViewPermission = (permission: string) =>
    permissionNames.includes(permission);

  const filteredMenuItems = menuItems.filter((item) =>
    hasSidebarViewPermission(item.permission)
  );

  const hasUserManagementPermission = !isLoading && hasSidebarViewPermission("view-users");
  const hasRolesPermission = !isLoading && hasSidebarViewPermission("view-roles");

  
  const showUserManagementMenu = isLoading
    ? isUserModuleActive
    : hasUserManagementPermission || hasRolesPermission || isUserModuleActive;

  return (
    <SidebarProvider style={{ "--sidebar-width": "240px" } as React.CSSProperties}>
      <div className="flex min-h-screen w-full bg-[#f4f1ff] dark:bg-slate-950">
       
        <Sidebar collapsible="icon" className="border-r-transparent bg-[#eee9ff] shadow-[10px_0_28px_rgba(124,58,237,0.06)] dark:border-slate-700 dark:bg-slate-900 dark:shadow-none">
          <SidebarContent className="bg-[#eee9ff] px-5 py-7 group-data-[collapsible=icon]:px-2 dark:bg-slate-900 dark:shadow-none">
           
           <div className="flex items-center gap-3 px-1 mb-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
  <div 
    className="w-12 h-12 flex-shrink-0 bg-white border border-violet-200 rounded-2xl flex items-center justify-center shadow-[0_10px_25px_rgba(124,58,237,0.15)] transition-transform hover:scale-105 group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:w-9 dark:rounded-full dark:bg-slate-800 dark:border-violet-400 dark:shadow-sm"
    style={{ animation: 'bounce 3s infinite ease-in-out' }}
  >
    <BsBoxFill className="w-6 h-6 text-[#7C3AED] group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5" />
  </div>
  <h1 className="text-xl font-bold tracking-tight text-[#7C3AED] group-data-[collapsible=icon]:hidden dark:text-violet-300">ITAMS</h1>
</div>

           
            <SidebarMenu className="space-y-1">
              {isLoading ? (
                
                <div className="px-4 py-3 text-blue-300 text-xs animate-pulse">
                  Loading Menu...
                </div>
              ) : (
                <>
                 
                  {filteredMenuItems.map((item) => {
                    const isActive =
                      currentPath.startsWith(item.path.toLowerCase()) ||
                      (item.path === "/dashboard" && currentPath === "/");

                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          onClick={() => navigate(item.path)}
                          tooltip={item.title}
                          className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 ${
                            isActive
                              ? "bg-[#A78BFA] text-white shadow-[0_10px_24px_rgba(124,58,237,0.22)] dark:bg-slate-800 dark:text-violet-200 dark:shadow-none"
                              : "text-[#7C3AED] hover:bg-white/70 hover:text-[#6D28D9] dark:text-violet-300 dark:hover:bg-slate-800 dark:hover:text-violet-200"
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                          <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </>
              )}

              
              {showUserManagementMenu && (
                <SidebarMenuItem>
                  
                  <SidebarMenuButton
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    tooltip="User Management"
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 ${
                      isUserModuleActive
                        ? "bg-[#A78BFA] text-white shadow-[0_10px_24px_rgba(124,58,237,0.22)] dark:bg-slate-800 dark:text-violet-200 dark:shadow-none"
                              : "text-[#7C3AED] hover:bg-white/70 hover:text-[#6D28D9] dark:text-violet-300 dark:hover:bg-slate-800 dark:hover:text-violet-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5" />
                      <span className="group-data-[collapsible=icon]:hidden">User Management</span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 group-data-[collapsible=icon]:hidden ${
                        isUserMenuOpen ? "transform rotate-180" : ""
                      }`}
                    />
                  </SidebarMenuButton>

                  {/* Dropdown Sub-Items */}
                  {isUserMenuOpen && (
                    <div className="mt-2 ml-6 space-y-1 border-l border-violet-300/70 pl-4 group-data-[collapsible=icon]:hidden dark:border-slate-600">
                     
                      {(hasUserManagementPermission || isUserModuleActive || isLoading) && (
                        <SidebarMenuButton
                          onClick={() => navigate("/usermanagement")}
                          className={`flex w-full items-center gap-3 rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                            isUsersSubItemActive
                              ?"bg-white text-[#7C3AED] shadow-sm dark:bg-slate-800 dark:text-violet-200"
                              : "text-[#7C3AED] hover:bg-white/70 hover:text-[#6D28D9] dark:text-violet-300 dark:hover:bg-slate-800 dark:hover:text-violet-200"
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
                          className={`flex w-full items-center gap-3 rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                            currentPath.startsWith("/roles")
                              ? "bg-white text-[#7C3AED] shadow-sm dark:bg-slate-800 dark:text-violet-200"
                              : "text-[#7C3AED] hover:bg-white/70 hover:text-[#6D28D9] dark:text-violet-300 dark:hover:bg-slate-800 dark:hover:text-violet-200"
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
        <div className="flex min-w-0 flex-1 flex-col bg-[#f4f1ff] dark:bg-slate-950">
          <div className="sticky top-0 z-20 px-5 pt-4">
            <Navigation />
          </div>
          <main className="flex-1 overflow-y-auto px-5 pb-5 pt-4">
            {isLoading ? (
             
              <div className="h-full flex items-center justify-center text-[#A78BFA] font-medium dark:bg-slate-950 dark:text-violet-300">
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
