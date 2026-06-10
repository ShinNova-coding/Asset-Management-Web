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
    employee_id: '',
    asset_code: '',        
    assigned_date: '',
    returned_date: '',
    note: '',
    status: 'active'     
  });

  // Dropdown states for Employees and Assets
  const [employees, setEmployees] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);

  // Fetch dropdown data on mount
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const currentToken = localStorage.getItem("token") || "107|hJ8zVmOwBwWAjbODhurIz0EFCvEWc4MdiICpLPxPf5c8837f";
        const headers = { 
          "Authorization": `Bearer ${currentToken}`,
          "Accept": "application/json"
        };

        const empRes = await fetch("http://192.168.100.186:1010/api/users", { headers });
        const assetRes = await fetch("http://192.168.100.186:1010/api/assets", { headers });

        if (empRes.ok) {
          const empData = await empRes.json();
          setEmployees(Array.isArray(empData) ? empData : empData.data || []);
        }
        if (assetRes.ok) {
          const assetData = await assetRes.json();
          setAssets(Array.isArray(assetData) ? assetData : assetData.data || []);
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
        employee_id: '',
        asset_code: '',
        assigned_date: '',
        returned_date: '',
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
          item.id === Number(targetId) || item.users_id === targetId || item.assets_id === targetId
        );
      }
    }

    if (activeItem) {
      setFormData({
        employee_id: activeItem.users_id || activeItem.employee_id || '',
        asset_code: activeItem.assets_id || activeItem.asset_code || '',
        assigned_date: formatToInputDate(activeItem.assigned_date),
        returned_date: formatToInputDate(activeItem.returned_date),
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

    if (!formData.employee_id.trim()) {
      alert("Employee is required!");
      return;
    }

    if (!formData.asset_code.trim()) {
      alert("Asset is required!");
      return;
    }

    if (!formData.assigned_date) {
      alert("Assigned Date is required!");
      return;
    }

    try {
      const assignmentPayload = {
        users_id: formData.employee_id.trim(),
        assets_id: formData.asset_code.trim(),
        assigned_date: formData.assigned_date,
        returned_date: formData.returned_date || null,
        note: formData.note.trim() || null,
        status: formData.status
      };

      console.log("🚀 Sending Payload to Assignment API:", assignmentPayload);

      const API_URL = "http://192.168.100.186:1010/api/assignment"; 
      
      const targetId = stateEditItem?.id || stateId || routeId;
      const url = isEditMode ? `${API_URL}/${targetId}` : API_URL;
      const method = isEditMode ? "PUT" : "POST";
      
      const currentToken = localStorage.getItem("token") || "107|hJ8zVmOwBwWAjbODhurIz0EFCvEWc4MdiICpLPxPf5c8837f";

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
            Back to Assignment List
          </button>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEditMode ? "Edit Handover Record" : "New Handover Assignment"}
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
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Select Employee</label>
                <select 
                  name="employee_id"
                  value={formData.employee_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white text-slate-800" 
                  required
                >
                  <option value="">-- Choose an Employee --</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} {emp.employee_id ? `(${emp.employee_id})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ASSET INFO */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                <Package size={18} className="text-blue-600" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Asset to Assign</h2>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Select Asset</label>
                <select 
                  name="asset_code"
                  value={formData.asset_code}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white text-slate-800" 
                  required
                >
                  <option value="">-- Choose an Asset --</option>
                  {assets.map((ast) => (
                    <option key={ast.id} value={ast.id}>
                      {ast.name} {ast.asset_code ? `(${ast.asset_code})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* TIMELINE & STATUS */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                <Calendar size={18} className="text-blue-600" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Timeline</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Assigned Date</label>
                  <input 
                    type="date" 
                    name="assigned_date"
                    value={formData.assigned_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Returned Date</label>
                  <input 
                    type="date" 
                    name="returned_date"
                    value={formData.returned_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Assignment Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-md border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="returned">Returned</option>
                  </select>
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
                {isEditMode ? "Update Record" : "Confirm Handover"}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default AddNewAsset;