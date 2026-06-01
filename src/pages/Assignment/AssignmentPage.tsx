import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AssignmentTable } from "@/components/features/Assignment/AssignmentTable";
import { assignmentData as initialAssignmentData } from "@/data/assignmentdata";
import type { Assignment } from "@/data/assignmentdata";
import { FiTrash2 } from "react-icons/fi";

const AssignmentPage = () => {
  const [data, setData] = useState<Assignment[]>(initialAssignmentData);
  const navigate = useNavigate();
  const location = useLocation();

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    targetId: null as string | null,
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("assignment_data");

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);

        if (parsedData.length > 0) {
          setData(parsedData);
        }
      } catch (error) {
        console.error("Error loading assignment data:", error);
        setData(initialAssignmentData);
      }
    } else {
      localStorage.setItem(
        "assignment_data",
        JSON.stringify(initialAssignmentData)
      );
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem("assignment_data", JSON.stringify(data));
  }, [data]);

  // Handle updated or deleted item
  useEffect(() => {
    const state = location.state as {
      showMessage?: boolean;
      updatedItem?: Assignment;
      deleteItem?: string;
    } | null;

    if (state?.updatedItem) {
      setData((prevData) =>
        prevData.map((item) =>
          item.assetId === state.updatedItem?.assetId
            ? state.updatedItem
            : item
        )
      );
    }

    if (state?.deleteItem) {
      setData((prevData) =>
        prevData.filter((item) => item.assetId !== state.deleteItem)
      );
    }
  }, [location.state]);

  // Edit handler
  const handleEdit = (row: Assignment) => {
    navigate(`/assignment/${row.assetId}`, {
      state: { editItem: row },
    });
  };

  // Delete handler
  const handleDelete = (assetId: string) => {
    setDeleteModal({
      isOpen: true,
      targetId: assetId,
    });
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    if (deleteModal.targetId) {
      setData((prev) =>
        prev.filter((item) => item.assetId !== deleteModal.targetId)
      );

      setDeleteModal({
        isOpen: false,
        targetId: null,
      });
    }
  };

  return (
    <div className="p-10 space-y-6 min-h-screen bg-slate-50/30">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Assignment
          </h1>
        </div>
      </div>

      <div className="rounded-xl  bg-white shadow-sm overflow-hidden">
        <AssignmentTable
          key="assignment-table"
          data={data}
          meta={{
            editRow: handleEdit,
            deleteRow: handleDelete,
          }}
        />
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            {/* Close Button */}
            <div className="flex justify-end">
              <button
                onClick={() =>
                  setDeleteModal({
                    isOpen: false,
                    targetId: null,
                  })
                }
                className="text-slate-400 hover:text-slate-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="mt-2 text-center">
              <button className="p-2 hover:bg-gray-100 rounded-md">
                <FiTrash2
                  className="text-red-600"
                  size={24}
                />
              </button>

              <h2 className="text-lg font-semibold text-slate-800 mt-2">
                Delete Assignment
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Are you sure you want to delete this assignment?
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() =>
                  setDeleteModal({
                    isOpen: false,
                    targetId: null,
                  })
                }
                className="flex-1 rounded-lg border border-slate-300 py-2 text-sm font-medium hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmDelete}
                className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentPage;