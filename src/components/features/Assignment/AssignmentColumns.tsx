"use client"

import type { ColumnDef } from "@tanstack/react-table"
// import { FaEdit } from "react-icons/fa" // No longer needed
// Remove direct import of Edit form; use icon button for triggering edit mode
import { RiDeleteBin4Fill } from "react-icons/ri"
import type { Assignment } from "@/data/assignmentdata"
import { FaEdit } from "react-icons/fa";
export const columns: ColumnDef<Assignment>[] = [
  {
    accessorKey: "employeeId",
    header: "Employee ID",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "employeeName",
    header: "Employee Name",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "assetId",
    header: "Asset ID",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "assignedDate",
    header: "Assigned Date",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "returnedDate",
    header: "Returned Date",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "status",
    header: "Status",
    enableGlobalFilter: true,
    cell: ({ row }) => {
      const status = row.getValue("status") as string

      const statusStyles: Record<string, string> = {
        Active: "bg-green-100 text-green-700 border-green-200",
        Returned: "bg-yellow-100 text-yellow-700 border-yellow-200",
      }

      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold border ${
            statusStyles[status] || "bg-gray-100 text-gray-700"
          }`}
        >
          {status}
        </span>
      )
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const item = row.original
      const meta = table.options.meta as any

      const onEdit = meta?.editRow
      const onDelete = meta?.deleteRow

      return (
        <div className="flex items-center gap-3">

          {/* EDIT */}
          <button
            className="text-blue-300 hover:text-blue-700 transition p-1"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(item);
            }}
            title="Edit Assignment"
          >
            <FaEdit size={20} />
          </button>

          {/* DELETE */}
          <button
            className="text-red-500 hover:text-red-700 transition p-1"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(item.assetId);
            }}
            title="Delete Assignment"
          >
            <RiDeleteBin4Fill size={20} />
          </button>

        </div>
      )
    },
  },
]