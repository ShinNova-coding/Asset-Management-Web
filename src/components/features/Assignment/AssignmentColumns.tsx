"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { RiDeleteBin4Fill } from "react-icons/ri"
import { FaEdit } from "react-icons/fa"
import type { Assignment } from "@/data/assignmentdata"

export const columns: ColumnDef<Assignment>[] = [
  {
    accessorKey: "employee_id", // Updated to match backend key
    header: "Employee ID",
    enableGlobalFilter: true,
  },
  {
    // API lacks direct employeeName, parsing dynamically from employee_id or fallback
    id: "employeeName",
    accessorFn: (row) => `Employee (${row.employee_id})`,
    header: "Employee Name",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "asset_id", // Updated to match backend key
    header: "Asset ID",
    enableGlobalFilter: true,
  },
  {
    // Accessing the nested asset name safely via row data object
    id: "assetName",
    accessorFn: (row) => row.asset?.name || "Unknown Asset",
    header: "Asset Name",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "assigned_date", // Updated to match backend key
    header: "Assigned Date",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "returned_date", // Updated to match backend key
    header: "Returned Date",
    enableGlobalFilter: true,
    cell: ({ getValue }) => {
      const val = getValue() as string | null
      return val || "—"
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    enableGlobalFilter: true,
    cell: ({ row }) => {
      const status = (row.getValue("status") as string || "").toLowerCase()

      // Normalized style mapping to handle any case variation from API strings
      const statusStyles: Record<string, string> = {
        active: "bg-green-100 text-green-700 border-green-200",
        assigned: "bg-green-100 text-green-700 border-green-200",
        returned: "bg-yellow-100 text-yellow-700 border-yellow-200",
        pending: "bg-blue-100 text-blue-700 border-blue-200",
      }

      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold capitalize border ${
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
            className="text-blue-400 hover:text-blue-700 transition p-1"
            onClick={(e) => {
              e.stopPropagation() // Block standard parent TableRow click navigation
              onEdit?.(item)
            }}
            title="Edit Assignment"
          >
            <FaEdit size={20} />
          </button>

          {/* DELETE */}
          <button
            className="text-red-500 hover:text-red-700 transition p-1"
            onClick={(e) => {
              e.stopPropagation() // Block standard parent TableRow click navigation
              onDelete?.(item.id) // FIXED: Passing database incremental ID integer instead of assetId
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