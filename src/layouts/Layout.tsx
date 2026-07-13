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
    : permissions.map((p: any) => (typeof p === "string" ? p : p.name));

  const filteredMenuItems = menuItems.filter((item) =>
    permissionNames.includes(item.permission)
  );

  const hasUserManagementPermission = permissionNames.includes("view-users");
  const hasRolesPermission = permissionNames.includes("view-roles");

  
  const showUserManagementMenu = isLoading ? isUserModuleActive : (hasUserManagementPermission || hasRolesPermission || isUserModuleActive);

  return (
    <SidebarProvider style={{ "--sidebar-width": "240px" } as React.CSSProperties}>
      <div className="flex min-h-screen w-full bg-[#F0F4F8]">
       
        <Sidebar className="border-r border-blue-100 bg-[#e9e5ff]">
          <SidebarContent className="bg-[#e9e5ff] px-4 py-8">
           
            <div className="flex items-center gap-3 px-2 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7C3AED] shadow-lg shadow-blue-900/20">
                <BsFillBoxFill className="text-white h-6 w-6" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-[#7C3AED]">ITAMS</h1>
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
                          className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? "bg-[#ab8ffe] text-[#7C3AED]"
                              : "text-[#7C3AED] hover:bg-[#ab8ffe] hover:text-[#7C3AED]"
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

              
              {showUserManagementMenu && (
                <SidebarMenuItem>
                  
                  <SidebarMenuButton
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      isUserModuleActive
                        ? "bg-[#ab8ffe] text-[#7C3AED]"
                              : "text-[#7C3AED] hover:bg-[#ab8ffe] hover:text-[#7C3AED]"
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
                     
                      {(hasUserManagementPermission || isUserModuleActive || isLoading) && (
                        <SidebarMenuButton
                          onClick={() => navigate("/usermanagement")}
                          className={`flex w-full items-center gap-3 rounded-lg px-4 py-2 text-xs font-medium transition-all duration-200 ${
                            isUsersSubItemActive
                              ?"bg-[#ab8ffe] text-[#7C3AED]"
                              : "text-[#7C3AED] hover:bg-[#ab8ffe] hover:text-[#7C3AED]"
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
                              ? "bg-[#ab8ffe] text-[#7C3AED]"
                              : "text-[#7C3AED] hover:bg-[#ab8ffe] hover:text-[#7C3AED]"
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
             
              <div className="h-full flex items-center justify-center text-[#A78BFA] font-medium bg-[#F0F4F8]">
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