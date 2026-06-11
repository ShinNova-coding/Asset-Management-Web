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
      const response = await fetch(`http://192.168.100.186:1010/api/assignment/${id}`, requestOptions);
      
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
    <div className="min-h-0 bg-slate-50/30 p-6">
      <div className="w-full max-w-xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 mb-6"
        >
          <FiArrowLeft /> Back
        </button>

        <div className="w-full rounded-xl bg-white p-6 shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3 border-b pb-3 mb-6">
            <FiEdit2 className="text-indigo-600" /> Edit Assignment 
          </h2>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Asset Code
              </label>
              <input
                type="text"
                value={assetCode}
                onChange={(e) => setAssetCode(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Assigned Date
              </label>
              <input
                type="date"
                value={assignedDate}
                onChange={(e) => setAssignedDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Note
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t mt-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-500 text-sm font-medium text-white hover:bg-blue-600 shadow-sm transition-colors"
              >
                Save 
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAssignmentPage;