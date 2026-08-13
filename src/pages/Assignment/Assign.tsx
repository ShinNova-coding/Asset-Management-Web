"use client"

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useParams } from "react-router-dom"; 
import { ArrowLeft, User, Package, Calendar, ChevronDown, X } from 'lucide-react';
import { apiRequest } from '@/lib/apiService';

const AddNewAsset = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: routeId } = useParams<{ id: string }>(); 

  const stateId = location.state?.id;
  const stateEditItem = location.state?.editItem;

  const isEditMode = !!stateEditItem || !!stateId || !!routeId;

  const [formData, setFormData] = useState({
    users_id: '',
    users_name: '',
    assets_id: '',
    assets_name: '',        
    assigned_date: '',
    note: '',
    status: 'active'     
  });

  const [usersList, setUsersList] = useState<any[]>([]);
  const [assetsList, setAssetsList] = useState<any[]>([]);

  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isAssetOpen, setIsAssetOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const assetDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [usersData, assetsData] = await Promise.all([
          apiRequest("/user", "GET"),
          apiRequest("/asset", "GET"),
        ]);

        const users = usersData?.data?.data || usersData?.data || usersData?.users || [];
        const assets = assetsData?.data?.data || assetsData?.data || assetsData?.assets || [];

        setUsersList(Array.isArray(users) ? users : []);
        setAssetsList(Array.isArray(assets) ? assets : []);
      } catch (err) {
        console.error("Failed to load dropdown data", err);
        setUsersList([]);
        setAssetsList([]);
      }
    };

    fetchDropdownData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserOpen(false);
      }
      if (assetDropdownRef.current && !assetDropdownRef.current.contains(event.target as Node)) {
        setIsAssetOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatToInputDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
    return ""; 
  };

  useEffect(() => {
    if (!isEditMode) {
      setFormData({
        users_id: '',
        users_name: '',
        assets_id: '',
        assets_name: '',
        assigned_date: '',
        note: '',
        status: 'active'
      });
      return;
    }

    let activeItem = stateEditItem;
    const targetId = stateId || routeId;

    if (!activeItem && targetId) {
      const localRawData = localStorage.getItem("assignment_data");
      if (localRawData) {
        const currentInventory = JSON.parse(localRawData);
        activeItem = currentInventory.find((item: any) => 
          item.id === Number(targetId) || item.assets_name === targetId || item.asset_id === targetId
        );
      }
    }

    if (activeItem) {
      setFormData({
        users_id: activeItem.users_id || activeItem.user_id || activeItem.user?.id || '',
        users_name: activeItem.users_name || activeItem.employee_name || '',
        assets_id: activeItem.assets_id || activeItem.asset_id || activeItem.asset?.id || '',
        assets_name: activeItem.assets_name || activeItem.asset_name || '',
        assigned_date: formatToInputDate(activeItem.assigned_date),
        note: activeItem.note || '',
        status: activeItem.status || 'active'
      });
    }
  }, [stateId, stateEditItem, routeId, isEditMode]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUserSelect = (user: any) => {
    setFormData({
      ...formData,
      users_id: String(user.id || user.users_id || user.employee_id || ''),
      users_name: user.name,
    });
    setIsUserOpen(false);
  };

  const handleAssetSelect = (asset: any) => {
    setFormData({
      ...formData,
      assets_id: String(asset.id || asset.assets_id || asset.asset_id || ''),
      assets_name: asset.name,
    });
    setIsAssetOpen(false);
  };

  const goBack = () => {
    navigate("/assignment"); 
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.users_name.trim()) {
      showToast("Employee Name is required!");
      return;
    }

    if (!formData.assets_name.trim()) {
      showToast("Asset Name is required!");
      return;
    }

    if (!formData.assigned_date) {
      showToast("Assigned Date is required!");
      return;
    }

    try {
      const assignmentPayload = {
        users_id: formData.users_id,
        users_name: formData.users_name.trim(),
        assets_id: formData.assets_id,
        assets_name: formData.assets_name.trim(),
        assigned_date: formData.assigned_date,
        note: formData.note.trim() || null,
        status: formData.status || 'active'
      };

      console.log(" Sending Payload to Assignment API:", assignmentPayload);

      const API_URL = "http://192.168.100.163:1011/api/assignment"; 
      
      const targetId = stateEditItem?.id || stateId || routeId;
      const url = isEditMode ? `${API_URL}/${targetId}` : API_URL;
      const method = isEditMode ? "PUT" : "POST";
      
      const currentToken = localStorage.getItem("token") || "38|5WXyvmXnbjTmcDeqSQDda6J8UsUSpKeMvdSGwaM546e4040d";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${currentToken}`
        },
        body: JSON.stringify(assignmentPayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ Backend Validation Errors:", errorData);
        
        if (errorData.errors) {
          const validationErrors = Object.entries(errorData.errors)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join("\n");
          throw new Error(validationErrors);
        }
        throw new Error(errorData.message || `Server responded with status ${response.status}`);
      }

      showToast(isEditMode ? "Assignment record updated!" : "Successfully assigned asset to employee!");
      window.setTimeout(() => navigate("/assignment"), 900);

    } catch (err: any) {
      console.error("Transmission Error details:", err);
      showToast(`Could not save assignment: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#e9e5ff] p-10 font-sans text-slate-900">
      {toastMessage && (
        <div className="fixed right-6 top-6 z-50 flex max-w-sm items-center gap-3 rounded-xl border border-[#C4B5FD] bg-[#7C3AED] px-4 py-3 text-white shadow-xl shadow-purple-500/20">
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
      
        
        <div className="space-y-2">
          <button 
            type="button" 
            onClick={goBack} 
            className="flex items-center text-sm font-medium text-[#7C3AED] hover:text-purple-700 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back   
          </button>
          <h1 className="text-2xl font-bold text-[#7C3AED]">
            {isEditMode ? "Edit Handover Record" : "New Assignment"}
          </h1>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
           
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                  <User size={18} className="text-[#7C3AED]" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#7C3AED]">Employee</h2>
                </div>
                <div className="relative" ref={userDropdownRef}>
                  <label className="text-xs font-semibold text-[#7C3AED] block mb-1">Employee Name</label>
                  
                  <button
                    type="button"
                    onClick={() => setIsUserOpen(!isUserOpen)}
                    className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white flex justify-between items-center focus:ring-2 focus:ring-[#7C3AED] outline-none text-sm text-left"
                  >
                    <span className={formData.users_name ? "text-slate-900" : "text-slate-400"}>
                      {formData.users_name || "Select an Employee"}
                    </span>
                    <ChevronDown size={16} className={`text-slate-500 transition-transform ${isUserOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isUserOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                      {usersList.map((user: any, index: number) => (
                        <div
                          key={user.id}
                          onClick={() => handleUserSelect(user)}
                          className="px-3 py-2 hover:bg-violet-50 cursor-pointer text-sm flex justify-between items-center border-b border-slate-50 last:border-b-0"
                        >
                          <span>{String(index + 1).padStart(2, '0')} {user.name}</span>
                          <span className="text-xs text-slate-400">{user.employee_id}</span>
                        </div>
                      ))}
                      {usersList.length === 0 && (
                        <div className="px-3 py-4 text-center text-sm text-slate-400">No employees found</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                  <Package size={18} className="text-[#7C3AED]" />
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#7C3AED]">Asset</h2>
                </div>
                <div className="relative" ref={assetDropdownRef}>
                  <label className="text-xs font-semibold text-[#7C3AED] block mb-1">Asset Name</label>
                  
                  <button
                    type="button"
                    onClick={() => setIsAssetOpen(!isAssetOpen)}
                    className="w-full px-3 py-2 rounded-md border border-slate-300 bg-white flex justify-between items-center focus:ring-2 focus:ring-[#7C3AED] outline-none text-sm text-left"
                  >
                    <span className={formData.assets_name ? "text-slate-900" : "text-slate-400"}>
                      {formData.assets_name || "Select an Asset"}
                    </span>
                    <ChevronDown size={16} className={`text-slate-500 transition-transform ${isAssetOpen ? 'rotate-180' : ''}`} />
                  </button>

                 {isAssetOpen && (
  <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
  
    {assetsList
      .filter((asset: any) => asset.status === "available") 
      .map((asset: any, index: number) => (
        <div
          key={asset.id}
          onClick={() => handleAssetSelect(asset)}
          className="px-3 py-2 hover:bg-violet-50 cursor-pointer text-sm border-b border-slate-50 last:border-b-0"
        >
          <span>{String(index + 1).padStart(2, '0')} {asset.name}</span>
        </div>
      ))}
      
   
    {assetsList.filter((asset: any) => asset.status === "available").length === 0 && (
      <div className="px-3 py-4 text-center text-sm text-slate-400">No available assets found</div>
    )}
  </div>
)}
                </div>
              </div>
            </div>
            
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                <Calendar size={18} className="text-[#7C3AED]" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#7C3AED]">Timeline & Status</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
  <label className="text-xs font-semibold text-[#7C3AED] block mb-1">Assigned Date</label>
  <input
    type="date"
    name="assigned_date"
    value={formData.assigned_date}
    onChange={handleInputChange}
    max={new Date().toISOString().split("T")[0]} 
    className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-[#7C3AED] outline-none text-sm bg-white"
    required
  />
</div>
                <div>
                  <label className="text-xs font-semibold text-[#7C3AED] block mb-1">Status</label>
                  <input
                    type="text"
                    name="status"
                    value={formData.status}
                    onChange={() => {}}
                    readOnly
                    className="w-full px-3 py-2 rounded-md border border-slate-200 bg-slate-50 text-slate-600 outline-none text-sm cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

           
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#7C3AED] block mb-1">Admin Remarks / Notes</label>
              <textarea 
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                placeholder="Write reason or remarks here..."
                rows={6}
                className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-[#7C3AED] outline-none text-sm resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button type="button" onClick={goBack} className="px-5 py-2 rounded-md border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 text-xs">Cancel</button>
              <button type="submit" className="px-5 py-2 rounded-md bg-[#7C3AED] text-white font-medium hover:bg-purple-700 shadow-sm text-xs">
                {isEditMode ? "Update Record" : "Assign"}
              </button>
            </div>
          </form>
        </div>

      </div>
    
  );
};

export default AddNewAsset;
