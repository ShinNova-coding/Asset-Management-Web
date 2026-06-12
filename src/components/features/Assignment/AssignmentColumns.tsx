"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { RiDeleteBin4Fill } from "react-icons/ri"
import { FaEdit } from "react-icons/fa"

export const columns: ColumnDef<any>[] = [
  {
    id: "employeeId",
    accessorFn: (row) => row.user?.employee_id || row.users_id,
    header: "Employee ID",
    enableGlobalFilter: true,
  },
  {
    id: "userName",
    accessorFn: (row) => row.user?.name || "Unknown User",
    header: "Employee Name",
    enableGlobalFilter: true,
  },
  {
    id: "assetCode",
    accessorFn: (row) => row.asset?.asset_code || "N/A",
    header: "Asset Code",
    enableGlobalFilter: true,
  },
  {
    id: "assetName",
    accessorFn: (row) => row.asset?.name || "Unknown Asset",
    header: "Asset Name",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "assigned_date",
    header: "Assigned Date",
    enableGlobalFilter: true,
  },
  {
    accessorKey: "returned_date",
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

      const statusStyles: Record<string, string> = {
        active: "bg-green-100 text-green-700 border-green-200",
        inactive: "bg-gray-100 text-gray-700 border-gray-200",
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
          {status || "N/A"}
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

      
      const status = (item.status || "").toLowerCase()
      const isDeleteDisabled = status === "active"

      return (
        <div className="flex items-center gap-3">
          
          <button
            className="text-blue-400 hover:text-blue-700 transition p-1"
            onClick={(e) => {
              e.stopPropagation()
              onEdit?.(item)
            }}
            title="Edit Assignment"
          >
            <FaEdit size={20} />
          </button>

         
          <button
            className={`transition p-1 ${
              isDeleteDisabled 
                ? "text-red-300 cursor-not-allowed opacity-50" 
                : "text-red-500 hover:text-red-700"
            }`}
            disabled={isDeleteDisabled}
            onClick={(e) => {
              e.stopPropagation()
              onDelete?.(item.id)
            }}
            title={
              isDeleteDisabled 
                ? "Cannot delete an active assignment" 
                : "Delete Assignment"
            }
          >
            <RiDeleteBin4Fill size={20} />
          </button>
        </div>
      )
    },
  },
]