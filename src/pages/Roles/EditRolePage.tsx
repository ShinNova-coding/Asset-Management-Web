"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox"; // Assuming you have shadcn Checkbox
import { fetchRoles } from "@/lib/axios";

export default function EditRolePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [role, setRole] = useState<any>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadRole = async () => {
      try {
        setLoading(true);
        const data = await fetchRoles();
        const allRoles = Array.isArray(data) ? data : (data.data || []);
        const foundRole = allRoles.find((r: any) => (r.role_id || r.id).toString() === id);
        
        if (foundRole) {
          setRole(foundRole);
          // Extract just the permission names into an array
          setSelectedPermissions(foundRole.permissions.map((p: any) => p.name));
        }
      } catch (error) {
        console.error("Failed to fetch role", error);
      } finally {
        setLoading(false);
      }
    };
    loadRole();
  }, [id]);

  const handleUpdate = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`http://192.168.100.183:1011/api/role/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role_id: id,
          name: role.name,
          permissions: selectedPermissions
        })
      });

      if (!response.ok) throw new Error("Failed to update");
      alert("Role updated successfully!");
      navigate("/roles");
    } catch (error) {
      console.error(error);
      alert("Update failed.");
    } finally {
      setIsSaving(false);
    }
  };

  const togglePermission = (permName: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permName) ? prev.filter(p => p !== permName) : [...prev, permName]
    );
  };

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin w-8 h-8 text-blue-500" /></div>;

  return (
    <div className="p-6 min-h-screen bg-[#F3F0F7]">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate("/roles")}><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Editing: {role.name}</CardTitle>
            <Button onClick={handleUpdate} disabled={isSaving}><Save className="w-4 h-4 mr-2" /> Save Changes</Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {/* Note: You should ideally fetch a master list of all available permissions here */}
              {selectedPermissions.map((perm) => (
                <div key={perm} className="flex items-center space-x-2">
                  <Checkbox checked={selectedPermissions.includes(perm)} onCheckedChange={() => togglePermission(perm)} />
                  <label className="text-sm capitalize">{perm.replace(/-/g, ' ')}</label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}