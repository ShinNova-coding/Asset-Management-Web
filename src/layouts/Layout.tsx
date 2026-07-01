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
  { title: "Activity", icon: ClipboardList, path: "/activity", permission: "view-activitylogs" },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { permissions } = useAuth();
  
  
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

 
  if (!permissions || !Array.isArray(permissions)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F4F8] text-[#1E3A8A] font-medium">
        Loading...
      </div>
    );
  }

  

  const permissionNames = permissions.map((p: any) => {
    return typeof p === "string" ? p : p.name;
  });

  console.log("3. Data inside Layout:", permissions);
  console.log("4. Extracted Names:", permissionNames);

  
  const filteredMenuItems = menuItems.filter((item) =>
    permissionNames.includes(item.permission)
  );

  
  const hasUserManagementPermission = permissionNames.includes("view-users");
  const hasRolesPermission = permissionNames.includes("view-roles");

  return (
    <SidebarProvider style={{ "--sidebar-width": "240px" } as React.CSSProperties}>
      <div className="flex min-h-screen w-full bg-[#F0F4F8]">
       
        <Sidebar className="border-r border-blue-100 bg-[#1E3A8A]">
          <SidebarContent className="bg-[#1E3A8A] px-4 py-8">
           
            <div className="flex items-center gap-3 px-2 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 shadow-lg shadow-blue-900/20">
                <BsFillBoxFill className="text-white h-6 w-6" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white">ITAMS</h1>
            </div>

            
            <SidebarMenu className="space-y-1">
              {/* Regular Filtered Menu Items */}
              {filteredMenuItems.map((item) => {
                const isActive =
                  location.pathname.startsWith(item.path) ||
                  (item.path === "/dashboard" && location.pathname === "/");

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => navigate(item.path)}
                      className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-blue-300 text-[#1E3A8A]"
                          : "text-blue-200 hover:bg-blue-800/50 hover:text-white"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.title}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              {/* Collapsible User Management & Roles Menu */}
              {(hasUserManagementPermission || hasRolesPermission) && (
                <SidebarMenuItem>
                  {/* Dropdown Header Button */}
                  <SidebarMenuButton
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      location.pathname.startsWith("/usermanagement") || location.pathname.startsWith("/roles")
                        ? "text-white font-semibold"
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

                  {/* Dropdown Sub-Items (Child Links) */}
                  {isUserMenuOpen && (
                    <div className="mt-1 pl-4 space-y-1 border-l border-blue-800/60 ml-6">
                      {/* Sub item: User List */}
                      {hasUserManagementPermission && (
                        <SidebarMenuButton
                          onClick={() => navigate("/usermanagement")}
                          className={`flex w-full items-center gap-3 rounded-lg px-4 py-2 text-xs font-medium transition-all duration-200 ${
                            location.pathname.startsWith("/usermanagement")
                              ? "bg-blue-300 text-[#1E3A8A]"
                              : "text-blue-300 hover:bg-blue-800/30 hover:text-white"
                          }`}
                        >
                          <Users className="h-4 w-4" />
                          <span>Users</span>
                        </SidebarMenuButton>
                      )}

                      {/* Sub item: Roles */}
                      {hasRolesPermission && (
                        <SidebarMenuButton
                          onClick={() => navigate("/roles")}
                          className={`flex w-full items-center gap-3 rounded-lg px-4 py-2 text-xs font-medium transition-all duration-200 ${
                            location.pathname.startsWith("/roles")
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

              {/* fallback if no menu access at all */}
              {filteredMenuItems.length === 0 && !hasUserManagementPermission && !hasRolesPermission && (
                <div className="px-4 text-blue-300 text-xs italic">
                  No menu access available.
                </div>
              )}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

       
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