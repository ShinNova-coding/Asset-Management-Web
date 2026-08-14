import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { apiRequest } from '@/lib/apiService';
import { cacheRolePermissions } from '@/lib/utils';

interface PermissionItem {
  id: string; 
  label: string;
  checked: boolean;
}

const getRequiredViewPermission = (permissionId: string) => {
  const parts = permissionId.split('-');
  const action = parts[0];
  const moduleName = parts.slice(1).join('-');

  if (action === 'view' || !moduleName) return null;
  if (moduleName === 'asset-requests') return 'view-assets';
  if (moduleName === 'maintenance-requests') return 'view-maintenances';

  return `view-${moduleName}`;
};

export default function CreateRolePage() {
  const navigate = useNavigate();
  const [roleName, setRoleName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [managePermissions, setManagePermissions] = useState<PermissionItem[]>([
    { id: 'create-categories', label: 'Categories (Create)', checked: false },
    { id: 'create-assets', label: 'Assets (Create)', checked: false },
    { id: 'create-users', label: 'Users (Create)', checked: false },
    { id: 'create-assignments', label: 'Assignments (Create)', checked: false },
    { id: 'create-maintenances', label: 'Maintenances (Create)', checked: false },
    { id: 'create-expenses', label: 'Expenses (Create)', checked: false },
    { id: 'create-roles', label: 'Roles (Create)', checked: false },
    { id: 'create-asset-requests', label: 'Asset Requests (Create)', checked: false },
    { id: 'create-maintenance-requests', label: 'Maintenance Requests (Create)', checked: false },

    { id: 'update-categories', label: 'Categories (Update)', checked: false },
    { id: 'update-assets', label: 'Assets (Update)', checked: false },
    { id: 'update-users', label: 'Users (Update)', checked: false },
    { id: 'update-assignments', label: 'Assignments (Update)', checked: false },
    { id: 'update-maintenances', label: 'Maintenances (Update)', checked: false },
    { id: 'update-expenses', label: 'Expenses (Update)', checked: false },
    { id: 'update-roles', label: 'Roles (Update)', checked: false },
    { id: 'update-maintenance-requests', label: 'Maintenance Requests (Update)', checked: false },
    
    { id: 'delete-categories', label: 'Categories (Delete)', checked: false },
    { id: 'delete-assets', label: 'Assets (Delete)', checked: false },
    { id: 'delete-users', label: 'Users (Delete)', checked: false },
    { id: 'delete-assignments', label: 'Assignments (Delete)', checked: false },
    { id: 'delete-maintenances', label: 'Maintenances (Delete)', checked: false },
    { id: 'delete-expenses', label: 'Expenses (Delete)', checked: false },
    { id: 'delete-roles', label: 'Roles (Delete)', checked: false },

    { id: 'approve-asset-requests', label: 'Asset Requests (Approve)', checked: false },
    { id: 'approve-maintenance-requests', label: 'Maintenance Requests (Approve)', checked: false },

    { id: 'cancel-asset-requests', label: 'Asset Requests (Cancel)', checked: false },
    { id: 'cancel-maintenance-requests', label: 'Maintenance Requests (Cancel)', checked: false },
  ]);

  const [viewPermissions, setViewPermissions] = useState<PermissionItem[]>([
    { id: 'view-categories', label: 'Categories', checked: false },
    { id: 'view-assets', label: 'Assets', checked: false },
    { id: 'view-users', label: 'Users', checked: false },
    { id: 'view-dashboard', label: 'Dashboard', checked: false },
    { id: 'view-assignments', label: 'Assignments', checked: false },
    { id: 'view-maintenances', label: 'Maintenances', checked: false },
    { id: 'view-expenses', label: 'Expenses', checked: false },
    { id: 'view-roles', label: 'Roles', checked: false },
    { id: 'get-notifications', label: 'Notifications', checked: false },
  ]);

  const handleCheckboxChange = (id: string, type: 'manage' | 'view') => {
    if (type === 'manage') {
      const wasChecked = managePermissions.find(p => p.id === id)?.checked;
      setManagePermissions(prev =>
        prev.map(p => p.id === id ? { ...p, checked: !p.checked } : p)
      );

      const requiredViewPermission = getRequiredViewPermission(id);
      if (!wasChecked && requiredViewPermission) {
        setViewPermissions(prev =>
          prev.map(p => p.id === requiredViewPermission ? { ...p, checked: true } : p)
        );
      }
    } else {
      setViewPermissions(prev =>
        prev.map(p => p.id === id ? { ...p, checked: !p.checked } : p)
      );
    }
  };

  const handleToggleModule = (moduleType: 'create' | 'update' | 'delete' | 'approve' | 'cancel' | 'view') => {
    if (moduleType === 'view') {
      const isAllChecked = viewPermissions.every(p => p.checked);
      setViewPermissions(prev => prev.map(p => ({ ...p, checked: !isAllChecked })));
    } else {
      const targetPrefix = `${moduleType}-`;
      const modulePermissions = managePermissions.filter(p => p.id.startsWith(targetPrefix));
      const isAllChecked = modulePermissions.every(p => p.checked);

      setManagePermissions(prev =>
        prev.map(p => p.id.startsWith(targetPrefix) ? { ...p, checked: !isAllChecked } : p)
      );
    }
  };

  const isAllManageChecked = managePermissions.every(p => p.checked);
  const isAllViewChecked = viewPermissions.every(p => p.checked);
  const isEverythingChecked = isAllManageChecked && isAllViewChecked;

  const handleSelectAll = () => {
    const targetState = !isEverythingChecked;
    setManagePermissions(prev => prev.map(p => ({ ...p, checked: targetState })));
    setViewPermissions(prev => prev.map(p => ({ ...p, checked: targetState })));
  };

  
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  const selectedPermissions = [
    ...managePermissions.filter(p => p.checked).map(p => p.id),
    ...viewPermissions.filter(p => p.checked).map(p => p.id),
  ];
  const hasPageViewPermission = selectedPermissions.some(permission =>
    permission.startsWith("view-")
  );

  if (!roleName.trim()) {
    setError("Role name is required.");
    setLoading(false);
    return;
  }

  if (selectedPermissions.length === 0) {
    setError("Please select at least one permission.");
    setLoading(false);
    return;
  }

  if (!hasPageViewPermission) {
    setError("Please select at least one view permission so this role has a page to open after login.");
    setLoading(false);
    return;
  }

  try {
    await apiRequest("/role", "POST", {
      name: roleName.trim(),
      permissions: selectedPermissions 
    });

    cacheRolePermissions(roleName.trim(), selectedPermissions);
    navigate("/roles");
  } catch (err: any) {
    setError(err?.message || "Something went wrong.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#e9e5ff] p-8 flex justify-center items-start">
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        
       
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-[#7C3AED] rounded-2xl border border-indigo-100/50">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#7C3AED]">Add New Role</h1>
            </div>
          </div>
          
          <button 
            type="button"
            onClick={() => navigate("/roles")} 
            className="px-4 py-2 text-sm  text-[#7C3AED]  text-shadow-violet-400 flex items-center gap-2"
          >
              <ArrowLeft size={16} className="mr-2" />
              
            
            Back
          </button>
        </div>

       
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

         
          <div className="space-y-2">
            <label className="text-xs font-bold tracking-wider text-[#7C3AED] uppercase">
              Role Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="e.g. Admin,Employee..."
              className="w-full max-w-md px-4 py-3 rounded-xl border border-slate-200 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition duration-200"
              required
              disabled={loading}
            />
          </div>

          
          <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
            <div>
              <h2 className="text-sm font-bold text-[#7C3AED]">Assign Permissions</h2>
            </div>
          
            <button
              type="button"
              onClick={handleSelectAll}
              disabled={loading}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition duration-200 ${
                isEverythingChecked 
                  ? 'text-red-600 bg-red-50 hover:bg-red-100/70' 
                  : 'text-[#7C3AED] bg-purple-50 hover:bg-purple-400'
              }`}
            >
              {isEverythingChecked ? 'Unselect All Permissions' : 'Select All Permissions'}
            </button>
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-xs font-extrabold tracking-wider text-[#7C3AED] flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-[#A78BFA] rounded-full"></span>
                  MANAGE (CREATE)
                </span>
                <button
                  type="button"
                  onClick={() => handleToggleModule('create')}
                  disabled={loading}
                  className="px-2 py-0.5 text-[10px] font-bold text-[#7C3AED] bg-blue-50 hover:bg-blue-100/80 border border-blue-100 rounded-md uppercase transition duration-150"
                >
                  {managePermissions.filter(p => p.id.startsWith('create-')).every(p => p.checked) ? 'Unselect All' : 'Select Module'}
                </button>
              </div>
              <div className="space-y-2.5">
                {managePermissions.filter(p => p.id.startsWith('create-')).map((permission) => (
                  <label key={permission.id} className="group flex items-center justify-between bg-slate-50/50 border border-slate-100/70 border-l-4 border-l-[#A78BFA] rounded-xl p-3 cursor-pointer hover:bg-white hover:border-slate-200 transition">
                    <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-900">
                      {permission.label.replace(' (Create)', '')}
                    </span>
                    <input type="checkbox" checked={permission.checked} onChange={() => handleCheckboxChange(permission.id, 'manage')} disabled={loading} className="w-4 h-4 text-[#A78BFA] border-slate-300 rounded accent-[#A78BFA]" />
                  </label>
                ))}
              </div>
            </div>

            {/* CARD 2: MANAGE (UPDATE) */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-xs font-extrabold tracking-wider text-[#7C3AED] flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-[#A78BFA] rounded-full"></span>
                  MANAGE (UPDATE)
                </span>
                <button
                  type="button"
                  onClick={() => handleToggleModule('update')}
                  disabled={loading}
                  className="px-2 py-0.5 text-[10px] font-bold text-[#7C3AED] bg-blue-50 hover:bg-blue-100/80 border border-blue-100 rounded-md uppercase transition duration-150"
                >
                  {managePermissions.filter(p => p.id.startsWith('update-')).every(p => p.checked) ? 'Unselect All' : 'Select Module'}
                </button>
              </div>
              <div className="space-y-2.5">
                {managePermissions.filter(p => p.id.startsWith('update-')).map((permission) => (
                  <label key={permission.id} className="group flex items-center justify-between bg-slate-50/50 border border-slate-100/70 border-l-4 border-l-[#A78BFA] rounded-xl p-3 cursor-pointer hover:bg-white hover:border-slate-200 transition">
                    <span className="text-xs font-semibold text-[#7C3AED] group-hover:text-slate-900">
                      {permission.label.replace(' (Update)', '')}
                    </span>
                    <input type="checkbox" checked={permission.checked} onChange={() => handleCheckboxChange(permission.id, 'manage')} disabled={loading} className="w-4 h-4 text-[#A78BFA] border-slate-300 rounded accent-[#A78BFA]" />
                  </label>
                ))}
              </div>
            </div>

            {/* CARD 3: MANAGE (DELETE) */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-xs font-extrabold tracking-wider text-[#7C3AED] flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-[#A78BFA] rounded-full"></span>
                  MANAGE (DELETE)
                </span>
                <button
                  type="button"
                  onClick={() => handleToggleModule('delete')}
                  disabled={loading}
                  className="px-2 py-0.5 text-[10px] font-bold text-[#7C3AED] bg-blue-50 hover:bg-blue-100/80 border border-blue-100 rounded-md uppercase transition duration-150"
                >
                  {managePermissions.filter(p => p.id.startsWith('delete-')).every(p => p.checked) ? 'Unselect All' : 'Select Module'}
                </button>
              </div>
              <div className="space-y-2.5">
                {managePermissions.filter(p => p.id.startsWith('delete-')).map((permission) => (
                  <label key={permission.id} className="group flex items-center justify-between bg-slate-50/50 border border-slate-100/70 border-l-4 border-l-[#A78BFA] rounded-xl p-3 cursor-pointer hover:bg-white hover:border-slate-200 transition">
                    <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-900">
                      {permission.label.replace(' (Delete)', '')}
                    </span>
                    <input type="checkbox" checked={permission.checked} onChange={() => handleCheckboxChange(permission.id, 'manage')} disabled={loading} className="w-4 h-4 text-[#A78BFA] border-slate-300 rounded accent-[#A78BFA]" />
                  </label>
                ))}
              </div>
            </div>

            {/* CARD 4: MANAGE (APPROVE) */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-xs font-extrabold tracking-wider text-[#7C3AED] flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-[#A78BFA] rounded-full"></span>
                  MANAGE(APPROVE)
                </span>
                <button
                  type="button"
                  onClick={() => handleToggleModule('approve')}
                  disabled={loading}
                  className="px-2 py-0.5 text-[9px] font-bold text-[#7C3AED] bg-blue-50 hover:bg-blue-100/80 border border-blue-100 rounded-md uppercase transition duration-150"
                >
                  {managePermissions.filter(p => p.id.startsWith('approve-')).every(p => p.checked) ? 'Unselect All' : 'Select Module'}
                </button>
              </div>
              <div className="space-y-2.5">
                {managePermissions.filter(p => p.id.startsWith('approve-')).map((permission) => (
                  <label key={permission.id} className="group flex items-center justify-between bg-slate-50/50 border border-slate-100/70 border-l-4 border-l-[#A78BFA] rounded-xl p-3 cursor-pointer hover:bg-white hover:border-slate-200 transition">
                    <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-900">
                      {permission.label.replace(' (Approve)', '')}
                    </span>
                    <input type="checkbox" checked={permission.checked} onChange={() => handleCheckboxChange(permission.id, 'manage')} disabled={loading} className="w-4 h-4 text-[#A78BFA] border-slate-300 rounded accent-[#A78BFA]" />
                  </label>
                ))}
              </div>
            </div>

            {/* CARD 5: MANAGE (CANCEL) */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-xs font-extrabold tracking-wider text-[#7C3AED] flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-[#A78BFA] rounded-full"></span>
                  MANAGE (CANCEL)
                </span>
                <button
                  type="button"
                  onClick={() => handleToggleModule('cancel')}
                  disabled={loading}
                  className="px-2 py-0.5 text-[9px] font-bold text-[#7C3AED] bg-blue-50 hover:bg-blue-100/80 border border-blue-100 rounded-md uppercase transition duration-150"
                >
                  {managePermissions.filter(p => p.id.startsWith('cancel-')).every(p => p.checked) ? 'Unselect All' : 'Select Module'}
                </button>
              </div>
              <div className="space-y-2.5">
                {managePermissions.filter(p => p.id.startsWith('cancel-')).map((permission) => (
                  <label key={permission.id} className="group flex items-center justify-between bg-blue-50/50 border border-blue-100/70 border-l-4 border-l-[#A78BFA] rounded-xl p-3 cursor-pointer hover:bg-white hover:border-blue-200 transition">
                    <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-900">
                      {permission.label.replace(' (Cancel)', '')}
                    </span>
                    <input type="checkbox" checked={permission.checked} onChange={() => handleCheckboxChange(permission.id, 'manage')} disabled={loading} className="w-4 h-4 text-[#A78BFA] border-blue-300 rounded accent-[#A78BFA]" />
                  </label>
                ))}
              </div>
            </div>

            {/* CARD 6: VIEW / READ ONLY */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-xs font-extrabold tracking-wider text-[#7C3AED] flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-[#A78BFA] rounded-full"></span>
                  VIEW / READ ONLY
                </span>
                <button
                  type="button"
                  onClick={() => handleToggleModule('view')}
                  disabled={loading}
                  className="px-2 py-0.5 text-[9px] font-bold text-[#7C3AED] bg-blue-50 hover:bg-blue-100/80 border border-blue-100 rounded-md uppercase transition duration-150"
                >
                  {viewPermissions.every(p => p.checked) ? 'Unselect All' : 'Select Module'}
                </button>
              </div>
              <div className="space-y-2.5">
                {viewPermissions.map((permission) => (
                  <label key={permission.id} className="group flex items-center justify-between bg-blue-50/50 border border-blue-100/70 border-l-4 border-l-[#A78BFA] rounded-xl p-3 cursor-pointer hover:bg-white hover:border-blue-200 transition">
                    <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-900">
                      {permission.label}
                    </span>
                    <input type="checkbox" checked={permission.checked} onChange={() => handleCheckboxChange(permission.id, 'view')} disabled={loading} className="w-4 h-4 text-[#A78BFA] border-blue-300 rounded accent-[#A78BFA]" />
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex justify-end items-center gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate("/roles")}
              disabled={loading}
              className="px-5 py-3 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition duration-200 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#7C3AED] text-white font-semibold text-sm rounded-xl hover:bg-purple-700 focus:ring-4 focus:ring-[#7C3AED]/20 shadow-sm shadow-purple-500/10 transition duration-200 disabled:bg-[#7C3AED] disabled:opacity-70"
            >
              {loading ? 'Creating...' : 'Create Permissions'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
