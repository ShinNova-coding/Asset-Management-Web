"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ShieldCheck, Plus, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RiDeleteBinLine } from "react-icons/ri";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { fetchRoles, deleteRole } from "@/lib/axios"; 
import { apiRequest } from "@/lib/apiService";
import { MdOutlineModeEditOutline } from "react-icons/md";
export default function RolesPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRoles = async () => {
      try {
        setLoading(true);
        const data = await fetchRoles();
        setRoles(Array.isArray(data) ? data : (data.data || []));
      } catch (error) {
        console.error("Failed to fetch roles", error);
      } finally {
        setLoading(false);
      }
    };
    loadRoles();
  }, []);

  const handleDelete = async () => {
    const roleToDelete = roles[roleIndex];
    const id = roleToDelete.role_id || roleToDelete.id;

    if (!id) return;
    if (!confirm(`Are you sure you want to delete: ${roleToDelete.name}?`)) return;

    try {
      setIsDeleting(true);
      await deleteRole(id);
      
      setRoles(roles.filter((r) => (r.role_id || r.id) !== id));
      setRoleIndex(0);
      alert("Role deleted successfully!");
    } catch (error: any) {
      console.error("Delete failed:", error);
      alert(error.response?.data?.message || "Delete failed. Please check permissions.");
    } finally {
      setIsDeleting(false);
    }
  };

  const updateRolePermissions = async (roleId: number, name: string, permissionNames: string[]) => {
  try {
    setIsUpdating(true);
    
   
    await apiRequest(`/role/${roleId}`, "PATCH", { 
      role_id: roleId, 
      name, 
      permissions: permissionNames 
    });
    
   
    const data = await fetchRoles();
    setRoles(Array.isArray(data) ? data : (data.data || []));
    alert("Role updated successfully!");
  } catch (error: any) {
    console.error("Update error:", error);
    alert(error.message || "Failed to update role.");
  } finally {
    setIsUpdating(false);
  }
};
  const groupPermissions = (permissions: any[]) => {
    if (!permissions) return {};
    const groups: Record<string, any[]> = {};
    permissions.forEach((p) => {
      const parts = p.name ? p.name.split('-') : ['general', 'others'];
      const module = parts[1] || 'General';
      if (!groups[module]) groups[module] = [];
      groups[module].push(p);
    });
    return groups;
  };

 
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7C3AED]"></div>
      </div>
    );
  }

  

 
  if (roles.length === 0) return <div className="p-8 text-center text-slate-500">No roles found.</div>;

  const currentRole = roles[roleIndex];
  const groupedPermissions = groupPermissions(currentRole.permissions || []);

  return (
    <div className="p-4 min-h-screen bg-[#e9e5ff]">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-start mb-8">
          <h1 className="text-2xl font-bold text-[#7C3AED]">Permissions List</h1>
          <Button onClick={() => navigate("/roles/create")} className="bg-[#7C3AED] hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" /> Add Permissions
          </Button>
        </div>

        <Card className="border-l-4 border-[#7C3AED] shadow-md">
          <CardContent className="pt-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-xl"><ShieldCheck className="w-8 h-8 text-[#7C3AED]" /></div>
              <div>
                <h2 className="text-xl font-bold text-[#7C3AED]">{currentRole.name} Role</h2>
                <p className="text-xs text-[#A78BFA] uppercase tracking-wide">
                    {currentRole.permissions?.length || 0} Permissions Assigned
                </p>
              </div>
            </div>
           
           
              <div className="flex items-center gap-2">
   
    <Button 
      variant="outline" 
      
      className="text-[#7C3AED] border-purple-700 hover:bg-purple-600"
      onClick={() => navigate(`/roles/${currentRole.id}`)} 
    >
     <MdOutlineModeEditOutline className="w-5 h-5"/>
    </Button>
              <Button 
                variant="ghost" 
                className="text-red-600 hover:text-red-700 border-red-400 hover:bg-red-50"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                < RiDeleteBinLine className="w-5 h-5"/> {isDeleting ? "Deleting..." : ""}
              </Button>
             <div className="flex items-center gap-2">
  
  <div className="flex border rounded-lg overflow-hidden">
    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none border-r" onClick={() => setRoleIndex((p) => (p - 1 + roles.length) % roles.length)}><ChevronLeft className="w-4 h-4"/></Button>
    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none" onClick={() => setRoleIndex((p) => (p + 1) % roles.length)}><ChevronRight className="w-4 h-4"/></Button>
  </div>
</div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(groupedPermissions).map(([module, perms]) => (
            <Card key={module} className="hover:shadow-lg transition-all duration-300 border-t-2 border-[#7C3AED]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm capitalize flex items-center gap-2 text-[#7C3AED]">
                    <Database className="w-4 h-4 text-[#7C3AED]" />
                    {module} Control
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {perms.map((p: any, i: number) => (
                  <div key={i} className="flex justify-between items-center text-xs font-medium text-slate-900
                   bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="capitalize">{p.name.replace('-', ' ')}</span>
                    <Switch checked={true} disabled className="scale-75" />
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
