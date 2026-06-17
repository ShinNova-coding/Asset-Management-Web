"use client";

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AssignmentTable } from "@/components/features/Assignment/AssignmentTable";
import { assignmentData as fallbackData } from "@/data/assignmentdata";
import type { Assignment } from "@/data/assignmentdata";
import { FiTrash2, FiEdit2, FiX } from "react-icons/fi";
import axios from "axios";
import { AssignmentAssign } from "@/components/features/Assignment/AssignmentAssign";

// Targeted Local Network Endpoint
const API_URL = "http://192.168.100.185:1010/api/assignment";

const AssignmentPage = () => {
  const [data, setData] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    targetId: null as string | number | null,
  });

  // Helper function to dynamically generate authentication headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
  };

  // Fetch from live database URL with security tokens
  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: getAuthHeaders().headers.Authorization,
          Accept: "application/json",
        }
      });

      if (response.data?.success) {
        setData(response.data.data);
      } else {
        setError(response.data?.message || "Failed to parse system data structure.");
      }
    } catch (err: any) {
      console.error("API error reading assignments:", err);
      setError(`Network error: ${err.response?.data?.message || err.message || "Could not reach local server"}`);
      setData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  // Synchronize incoming react router mutations (Deletions)
  useEffect(() => {
    const state = location.state as { deleteItem?: string | number } | null;
    
    if (state?.deleteItem) {
      setData((prev) => prev.filter((item) => item.id !== state.deleteItem));
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  const handleEdit = (row: Assignment) => {
    // Navigate to dedicated edit page and pass row data via state
    navigate(`/assignment/edit/${row.id}`, { state: { assignment: row } });
  };

  const handleDelete = (id: string | number) => {
    setDeleteModal({ isOpen: true, targetId: id });
  };

  // Perform operational DELETE network method with security tokens matching API endpoint
  const handleConfirmDelete = async () => {
    if (!deleteModal.targetId) return;

    try {
      await axios.delete(`${API_URL}/assignment_id`, {
        ...getAuthHeaders(),
        data: {
          assignment_id: deleteModal.targetId,
        }
      });
      setData((prev) => prev.filter((item) => item.id !== deleteModal.targetId));
    } catch (err: any) {
      console.error("Could not run delete execution:", err);
      alert(`Delete operation failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setDeleteModal({ isOpen: false, targetId: null });
    }
  };

  return (
    <div className="pt-6 px-8 pb-8 space-y-4 min-h-screen bg-slate-50/30">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Assignment
          </h1>
        </div>
        <AssignmentAssign />
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-48 space-y-2 text-slate-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
          <p className="text-sm">Loading...</p>
        </div>
      ) : error ? (
        <div className="space-y-4">
          <div className="bg-amber-50 text-amber-800 p-4 rounded-xl border border-amber-200 text-sm">
            💡 <strong>Notice:</strong> Using offline local mock data template. (Reason: {error})
          </div>
          <div className="rounded-xl bg-white shadow-sm overflow-hidden opacity-75">
            <AssignmentTable data={data} meta={{ editRow: handleEdit, deleteRow: handleDelete }} />
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-white shadow-sm overflow-hidden">
          <AssignmentTable data={data} meta={{ editRow: handleEdit, deleteRow: handleDelete }} />
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <div className="flex justify-end">
              <button
                onClick={() => setDeleteModal({ isOpen: false, targetId: null })}
                className="text-slate-400 hover:text-slate-600"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="mt-2 text-center">
              <div className="p-2 inline-block bg-red-50 rounded-md">
                <FiTrash2 className="text-red-600" size={24} />
              </div>
              <h2 className="text-lg font-semibold text-slate-800 mt-2">Delete Assignment</h2>
              <p className="mt-2 text-sm text-slate-500">Are you sure you want to drop this assignment record from the database?</p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteModal({ isOpen: false, targetId: null })}
                className="flex-1 rounded-lg border border-slate-300 py-2 text-sm font-medium hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentPage;