"use client";

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { FiArrowLeft, FiEdit2 } from "react-icons/fi";

const EditAssignmentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const assignment = location.state?.assignment || {};

  const [assignedDate, setAssignedDate] = useState("");
  const [note, setNote] = useState("");
  const [assetCode, setAssetCode] = useState("");

  useEffect(() => {
    if (assignment) {
      setAssignedDate(assignment.assigned_date || "");
      setNote(assignment.note || "");
      setAssetCode(assignment.asset?.asset_code || assignment.assets_code || "");
    }
  }, [assignment]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = localStorage.getItem("token");

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("User-Agent", "Apidog/1.0.0 (https://apidog.com)");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Connection", "keep-alive");

    const raw = JSON.stringify({
      "assignment_id": id,
      "assets_code": assetCode,
      "note": note,
      "assigned_date": assignedDate
    });

    const requestOptions = {
      method: 'PATCH',
      headers: myHeaders,
      body: raw,
      redirect: 'follow' as RequestRedirect
    };

    try {
      const response = await fetch(`http://192.168.100.179:1010/api/assignment/${id}`, requestOptions);
      
      if (response.ok) {
        alert("Assignment updated successfully!");
        navigate("/assignment"); 
      } else {
        const errorData = await response.json();
        alert(`Failed to update: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('error', error);
      alert("Network error occurred while updating.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-10 font-sans text-slate-900">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors mb-2"
      >
        <FiArrowLeft size={16} /> Back
      </button>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-white">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
            <FiEdit2 className="text-indigo-600" size={20} /> Edit Assignment 
          </h2>
        </div>

        <form onSubmit={handleUpdate} className="p-8 space-y-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">
                Asset Code
              </label>
              <input
                type="text"
                value={assetCode}
                onChange={(e) => setAssetCode(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">
                Assigned Date
              </label>
              <input
                type="date"
                value={assignedDate}
                onChange={(e) => setAssignedDate(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">
              Note
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={6}
              placeholder="Write remarks or notes here..."
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2 rounded-md border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-sm text-xs transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAssignmentPage;