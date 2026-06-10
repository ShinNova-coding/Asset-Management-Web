"use client"

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from "react-router-dom"; 
import { ArrowLeft, User, Package, Calendar } from 'lucide-react';

const AddNewAsset = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: routeId } = useParams<{ id: string }>(); 

  const stateId = location.state?.id;
  const stateEditItem = location.state?.editItem;

  const isEditMode = !!stateEditItem || !!stateId || !!routeId;

  const [formData, setFormData] = useState({
    users_name: '',
    assets_name: '',        
    assigned_date: '',
    note: '',
    status: 'active'     
  });

  const [usersList, setUsersList] = useState<any[]>([]);
  const [assetsList, setAssetsList] = useState<any[]>([]);

  useEffect(() => {
    const fetchDropdownData = async () => {
      const currentToken = localStorage.getItem("token") || "38|5WXyvmXnbjTmcDeqSQDda6J8UsUSpKeMvdSGwaM546e4040d";
      const headers = {
        "Accept": "application/json",
        "Authorization": `Bearer ${currentToken}`
      };

      try {
        // Fetch Users (handling Laravel pagination structure)
        const usersResponse = await fetch("http://192.168.100.186:1010/api/user", { headers });
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          setUsersList(usersData.data?.data || usersData.data || []);
        }

        // Fetch Assets
        const assetsResponse = await fetch("http://192.168.100.186:1010/api/asset", { headers });
        if (assetsResponse.ok) {
          const assetsData = await assetsResponse.json();
          setAssetsList(assetsData.data?.data || assetsData.data || []);
        }
      } catch (err) {
        console.error("Failed to load dropdown data", err);
      }
    };

    fetchDropdownData();
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
        users_name: '',
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
        users_name: activeItem.users_name || activeItem.employee_name || '',
        assets_name: activeItem.assets_name || activeItem.asset_name || '',
        assigned_date: formatToInputDate(activeItem.assigned_date),
        note: activeItem.note || '',
        status: activeItem.status || 'active'
      });
    }
  }, [stateId, stateEditItem, routeId, isEditMode]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const goBack = () => {
    navigate("/assignment"); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.users_name.trim()) {
      alert("Employee Name is required!");
      return;
    }

    if (!formData.assets_name.trim()) {
      alert("Asset Name is required!");
      return;
    }

    if (!formData.assigned_date) {
      alert("Assigned Date is required!");
      return;
    }

    try {
      const assignmentPayload = {
        users_name: formData.users_name.trim(),
        assets_name: formData.assets_name.trim(),
        assigned_date: formData.assigned_date,
        note: formData.note.trim() || null,
        status: formData.status
      };

      console.log("🚀 Sending Payload to Assignment API:", assignmentPayload);

      const API_URL = "http://192.168.100.186:1010/api/assignment"; 
      
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

      alert(isEditMode ? "Assignment record updated!" : "Successfully assigned asset to employee!");
      navigate("/assignment");

    } catch (err: any) {
      console.error("Transmission Error details:", err);
      alert(`Could not save assignment:\n${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-10 font-sans text-slate-900">
      <div className="max-w-3xl mx-auto space-y-6">
        
        <div className="space-y-2">
          <button 
            type="button" 
            onClick={goBack} 
            className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back   
          </button>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEditMode ? "Edit Handover Record" : "New Assignment"}
          </h1>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
            {/* EMPLOYEE INFO */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                <User size={18} className="text-blue-600" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Employee</h2>
              </div>
              <div className="relative">
                <label className="text-xs font-semibold text-slate-600 block mb-1">Employee Name</label>
                <select 
                  name="users_name"
                  value={formData.users_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                  required
                >
                  <option value="">Select an Employee</option>
                  {usersList.map((user: any) => (
                    <option key={user.id} value={user.name}>{user.name} ({user.employee_id})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* ASSET INFO */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                <Package size={18} className="text-blue-600" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Asset</h2>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Asset Name</label>
                <select 
                  name="assets_name"
                  value={formData.assets_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white" 
                  required
                >
                  <option value="">Select an Asset</option>
                  {assetsList.map((asset: any) => (
                    <option key={asset.id} value={asset.name}>{asset.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* TIMELINE & STATUS */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                <Calendar size={18} className="text-blue-600" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Timeline & Status</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Assigned Date</label>
                  <input
                    type="date"
                    name="assigned_date"
                    value={formData.assigned_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Status</label>
                  <input
                    type="text"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                  />
                </div>
              </div>
            </div>

            {/* NOTE FIELD */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 block mb-1">Admin Remarks / Notes</label>
              <textarea 
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                placeholder="Write reason or remarks here..."
                rows={3}
                className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button type="button" onClick={goBack} className="px-5 py-2 rounded-md border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 text-xs">Cancel</button>
              <button type="submit" className="px-5 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-sm text-xs">
                {isEditMode ? "Update Record" : "Assign"}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default AddNewAsset;