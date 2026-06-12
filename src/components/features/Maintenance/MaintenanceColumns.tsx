"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import type { Maintenance } from "@/data/maintenance"

export const columns: ColumnDef<Maintenance>[] = [
  {
    accessorKey: "employee name",
    header: "Employee Name",
  },

  {
    accessorKey: "asset Name",
    header: "Asset Name",
  },

  {
    accessorKey: "category",
    header: "Category",
  },
// NEW COLUMN
  {
    accessorKey: "maintenanceDate",
    header: "Maintenance Date",
    cell: ({ row }) => row.getValue("maintenanceDate") || "-",
  },

  // NEW COLUMN
  {
    accessorKey: "returnedDate",
    header: "Returned Date",
    cell: ({ row }) => row.getValue("returnedDate") || "-",
  },



  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string

      const statusStyles: Record<string, string> = {
        Request:  "bg-red-100 text-red-700 border border-red-200",
        Pending:  "bg-gray-200 text-gray-700 border border-gray-200",
        Approved: "bg-green-100 text-green-700 border border-green-200",
        "In Progress": "bg-amber-100 text-amber-700 border border-amber-200",
        Complete: "bg-blue-100 text-blue-700 border border-blue-200",
        Cancelled:"bg-gray-200 text-gray-600 border border-gray-300",
      }

      return (
        <div className="flex items-center">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[status] ?? "bg-slate-100 text-slate-700 border border-slate-200"}`}
          >
            {status}
          </span>
        </div>
      )
    },
  },

  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const item = row.original
      const meta = table.options.meta as any

      const actionLabel =
        item.stage === "pending"
          ? "Approve"
          : item.stage === "approved"
          ? "Maintain"
          : "Complete"

      return (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={item.stage === "completed" ? "outline" : "default"}
            disabled={item.stage === "completed"}
            onClick={(e) => {
              e.stopPropagation()
              meta?.handleRowAction?.(item)
            }}
          >
            {actionLabel}
          </Button>
        </div>
      )
    },
  },
]