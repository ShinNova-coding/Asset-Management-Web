"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, Save, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { fetchRoles, updateRole } from "@/lib/axios";
import { apiRequest } from "@/lib/apiService"; 
import { cacheRolePermissions } from "@/lib/utils";

const getResponseArray = (response: any) => {
  const data = response?.data?.data || response?.data || response || [];
  return Array.isArray(data) ? data : [];
};

const getRoleId = (role: any) => role?.role_id || role?.id;

const getPermissionName = (permission: any) =>
  typeof permission === "string" ? permission : permission?.name;

const uniquePermissionNames = (permissions: any[] = []) =>
  Array.from(
    new Set(
      permissions
        .map(getPermissionName)
        .filter(Boolean)
    )
  );

const getRequiredViewPermission = (permissionName: string) => {
  const parts = permissionName.split("-");
  const action = parts[0];
  const moduleName = parts.slice(1).join("-");

  if (action === "view" || !moduleName) return null;
  if (moduleName === "asset-requests") return "view-assets";
  if (moduleName === "maintenance-requests") return "view-maintenances";

  return `view-${moduleName}`;
};

export default function EditRolePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [role, setRole] = useState<any>(null);
  const [allPermissions, setAllPermissions] = useState<any[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(null), 2500);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const rolesData = await fetchRoles();
        const allRoles = getResponseArray(rolesData);
        const foundRole = allRoles.find((r: any) => String(getRoleId(r)) === id);
        
        if (foundRole) {
          setRole(foundRole);
          setSelectedPermissions(uniquePermissionNames(foundRole.permissions || []));
        }

        try {
          const permsResponse = await apiRequest("/permission", "GET");
          const permsData = getResponseArray(permsResponse);
          setAllPermissions(permsData.length > 0 ? permsData : (foundRole?.permissions || []));
        } catch (permissionError) {
          console.error("Error loading permissions:", permissionError);
          setAllPermissions(foundRole?.permissions || []);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleUpdate = async () => {
    setIsSaving(true);
    try {
      const roleId = getRoleId(role) || id;

      await updateRole(roleId, {
        role_id: roleId,
        name: role.name,
        permissions: selectedPermissions,
      });

      cacheRolePermissions(role.name, selectedPermissions);
      showToast("Role updated successfully!");
      window.setTimeout(() => navigate("/roles"), 900);
    } catch (error: any) {
      console.error(error);
      showToast(error.message || "Update failed.");
    } finally {
      setIsSaving(false);
    }
  };

  
  const togglePermission = (permName: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permName) 
        ? prev.filter(p => p !== permName) 
        : Array.from(new Set([...prev, permName, getRequiredViewPermission(permName)].filter(Boolean) as string[]))
    );
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin w-8 h-8 text-[#7C3AED]" /></div>;
  if (!role) return <div className="p-10 text-center">Role not found.</div>;

  return (
    <div className="p-6 min-h-screen bg-[#e9e5ff]">
      {toastMessage && (
        <div className="fixed right-6 top-6 z-50 flex max-w-sm items-center gap-3 rounded-xl border border-[#C4B5FD] bg-[#7C3AED] px-4 py-3 text-white shadow-xl shadow-purple-500/20">
          <CheckCircle size={16} />
          <span className="text-sm font-semibold">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-auto rounded-md p-1 text-white/80 transition hover:bg-white/15 hover:text-white"
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" className="text-[#7C3AED] hover:text-purple-700" onClick={() => navigate("/roles")}>
          <ArrowLeft className="w-4 h-4 mr-2 text-[#7C3AED]" /> Back
        </Button>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-[#7C3AED]">Editing: {role.name}</CardTitle>
            <Button onClick={handleUpdate} disabled={isSaving}>
              {isSaving ? <Loader2 className="animate-spin w-4 h-4 mr-2 text-[#7C3AED]  bg-[#7C3AED]" /> : <Save className="w-4 h-4 mr-2 text-[#7C3AED]" />} 
              Save Changes
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {allPermissions.map((perm) => {
                const permissionName = getPermissionName(perm);
                if (!permissionName) return null;

                return (
                <div key={perm.id || permissionName} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 transition-colors">
                  <Checkbox 
                    checked={selectedPermissions.includes(permissionName)} 
                    onCheckedChange={() => togglePermission(permissionName)} 
                  />
                  <label className="text-sm cursor-pointer capitalize">
                    {permissionName.replace(/-/g, ' ')}
                  </label>
                </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
