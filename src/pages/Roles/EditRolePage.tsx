"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { fetchRoles } from "@/lib/axios";
import { apiRequest } from "@/lib/apiService"; 

export default function EditRolePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [role, setRole] = useState<any>(null);
  const [allPermissions, setAllPermissions] = useState<any[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
       
        const [rolesData, permsResponse] = await Promise.all([
          fetchRoles(),
          apiRequest("/permission", "GET")
        ]);

        const allRoles = Array.isArray(rolesData) ? rolesData : (rolesData.data || []);
        const permsData = permsResponse.data || permsResponse;

        const foundRole = allRoles.find((r: any) => (r.role_id || r.id).toString() === id);
        
        if (foundRole) {
          setRole(foundRole);
          setSelectedPermissions(foundRole.permissions.map((p: any) => p.name));
        }
        
        setAllPermissions(permsData);
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
      
      await apiRequest(`/role/${id}`, "PATCH", {
        role_id: id,
        name: role.name,
        permissions: selectedPermissions 
      });

      alert("Role updated successfully!");
      navigate("/roles");
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Update failed.");
    } finally {
      setIsSaving(false);
    }
  };

  
  const togglePermission = (permName: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permName) 
        ? prev.filter(p => p !== permName) 
        : [...prev, permName]
    );
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin w-8 h-8 text-blue-500" /></div>;
  if (!role) return <div className="p-10 text-center">Role not found.</div>;

  return (
    <div className="p-6 min-h-screen bg-[#F3F0F7]">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" className="text-blue-800 hover:text-blue-900" onClick={() => navigate("/roles")}>
          <ArrowLeft className="w-4 h-4 mr-2 text-blue-800" /> Back
        </Button>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Editing: {role.name}</CardTitle>
            <Button onClick={handleUpdate} disabled={isSaving}>
              {isSaving ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />} 
              Save Changes
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {allPermissions.map((perm) => (
                <div key={perm.id} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 transition-colors">
                  <Checkbox 
                    checked={selectedPermissions.includes(perm.name)} 
                    onCheckedChange={() => togglePermission(perm.name)} 
                  />
                  <label className="text-sm cursor-pointer capitalize">
                    {perm.name.replace(/-/g, ' ')}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}