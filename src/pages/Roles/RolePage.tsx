"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ShieldCheck, UserCog, Settings, Database, Briefcase, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
const ROLES_DATA = [
  {
    id: 1, name: "Admin", description: "Full system access.",
    modules: [
      { title: "Dashboard", icon: <UserCog className="w-5 h-5 text-blue-500" />, perms: ["View", "Edit", "Delete"] },
      { title: "Asset Control", icon: <Database className="w-5 h-5 text-emerald-500" />, perms: ["Allocate", "Track"] },
      { title: "User Management", icon: <Settings className="w-5 h-5 text-slate-500" />, perms: ["Audit", "Status"] },
      { title: "Assignment", icon: <Briefcase className="w-5 h-5 text-amber-500" />, perms: ["Reports"] },
      { title: "Maintenance", icon: <ShieldCheck className="w-5 h-5 text-red-500" />, perms: ["Policies"] },
    ]
  },
  {
    id: 2, name: "HR", description: "Personnel management access.",
    modules: [
      { title: "View Assets", icon: <UserCog className="w-5 h-5 text-blue-500" />, perms: ["View", "Edit"] },
      { title: "Manage Users", icon: <Briefcase className="w-5 h-5 text-amber-500" />, perms: ["Reports"] },
    ]
  },
  {
    id: 3, name: "Employee", description: "Personal access only.",
    modules: [
      { title: "User Management", icon: <User className="w-5 h-5 text-slate-500" />, perms: ["View Profile"] },
    ]
  },
];

export default function RolesPage() {
  const [roleIndex, setRoleIndex] = useState(0);
  const currentRole = ROLES_DATA[roleIndex];
const navigate = useNavigate();
  return (
    /* Applied background color here */
    <div className="p-8 min-h-screen bg-[#F3F0F7]">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Permissions List</h1>
          </div>
          <Button 
      onClick={() => navigate("/roles/create")} 
      className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
    >
      <Plus className="w-4 h-4 mr-2" /> Add Permissions
    </Button>
        </div>

        <Card className="border-l-4 border-l-blue-600 shadow-md">
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-xl"><ShieldCheck className="w-8 h-8 text-blue-600" /></div>
              <div>
                <h2 className="text-xl font-bold">{currentRole.name} Role</h2>
                <p className="text-slate-600 text-sm">{currentRole.description}</p>
              </div>
            </div>
            <div className="flex items-center bg-slate-100 rounded-lg p-1">
              <Button variant="ghost" size="icon" onClick={() => setRoleIndex((p) => (p - 1 + ROLES_DATA.length) % ROLES_DATA.length)}><ChevronLeft /></Button>
              <span className="text-xs font-bold w-12 text-center">{roleIndex + 1}/{ROLES_DATA.length}</span>
              <Button variant="ghost" size="icon" onClick={() => setRoleIndex((p) => (p + 1) % ROLES_DATA.length)}><ChevronRight /></Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentRole.modules.map((module, idx) => (
            <Card key={idx} className="transition-all duration-300">
              <CardHeader className="pb-2"><CardTitle className="text-md flex items-center gap-2">{module.icon} {module.title}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {module.perms.map((p, i) => (
                  <div key={i} className="flex justify-between items-center text-sm font-medium">
                    {p} <Switch />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}