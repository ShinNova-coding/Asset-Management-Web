"use client";

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AssignmentTable } from "@/components/features/Assignment/AssignmentTable";
import { assignmentData as fallbackData } from "@/data/assignmentdata";
import type { Assignment } from "@/data/assignmentdata";
import { FiTrash2, FiX } from "react-icons/fi";
import { IoCloudDownloadOutline } from "react-icons/io5";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { AssignmentAssign } from "@/components/features/Assignment/AssignmentAssign";
import { apiRequest } from "@/lib/apiService";

const AssignmentPage = () => {
  const [data, setData] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    targetId: null as string | number | null,
  });

  const navigate = useNavigate();
  const location = useLocation();

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiRequest("/assignment", "GET");
      if (response?.success) {
        setData(response.data);
      } else {
        throw new Error(response?.message || "Failed to parse system data structure.");
      }
    } catch (err: any) {
      console.error("API error reading assignments:", err);
      setError(err.message || "Could not reach local server");
      setData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const columns = ["Employee", "Asset", "Status", "Assigned Date", "Note"];
    const rows = data.map((item) => [
      item.user?.name || "N/A",
      item.asset?.name || "N/A",
      item.status,
      item.assigned_date,
      item.note || "-"
    ]);
    doc.text("Assignment Report", 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [columns],
      body: rows,
      theme: "striped",
    });
    doc.save(`assignments_report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const handleEdit = (row: Assignment) => {
    navigate(`/assignment/edit/${row.id}`, { state: { assignment: row } });
  };

  const handleDelete = (id: string | number) => {
    setDeleteModal({ isOpen: true, targetId: id });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.targetId) return;
    try {
      await apiRequest(`/assignment/${deleteModal.targetId}`, "DELETE");
      setData((prev) => prev.filter((item) => item.id !== deleteModal.targetId));
    } catch (err: any) {
      alert(`Delete operation failed: ${err.message}`);
    } finally {
      setDeleteModal({ isOpen: false, targetId: null });
    }
  };

  return (
    <div className="pt-6 px-8 pb-8 space-y-4 min-h-screen bg-[#F3F0F7]">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-blue-800">Assignment</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-blue-800 text-white rounded-lg transition-colors font-medium shadow-sm flex items-center gap-2"
          >
            <IoCloudDownloadOutline size={16} /> 
          </button>
          <AssignmentAssign />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">Loading...</div>
      ) : (
        <div className="rounded-xl bg-white shadow-sm overflow-hidden">
          <AssignmentTable data={data} meta={{ editRow: handleEdit, deleteRow: handleDelete }} />
        </div>
      )}

      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          {/* Modal content here */}
          <button onClick={handleConfirmDelete}>Confirm Delete</button>
        </div>
      )}
    </div>
  );
};

export default AssignmentPage;