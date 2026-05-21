"use client"

import type { ColumnDef } from "@tanstack/react-table"
import Delete from "./MaintenanceDelete"
import Edit from "./MaintenanceEdit"

export type Maintenance = {
  employeeId: string
  name: string
  category: string
  status: "Active" | "Return" | "Request"
  action: string
}

export const columns: ColumnDef<Maintenance>[] = [
  {
    accessorKey: "employeeId",
    header: "Employee ID",
  },

  {
    accessorKey: "name",
    header: "Name",
  },

  {
    accessorKey: "category",
    header: "Category",
  },

  
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string

      const statusStyles: Record<string, string> = {
        Active:
          "bg-green-100 text-green-700 border border-green-200",

        Return:
          "bg-yellow-100 text-yellow-700 border border-yellow-200",

        Request:
          "bg-blue-100 text-blue-700 border border-blue-200",

        
      }

      return (
        <div className="flex items-center">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[status]}`}
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

      return (
        <div className="flex items-center gap-3">
          <Edit onEdit={() => meta?.editRow(item)} />

          <Delete onDelete={() => meta?.deleteRow(item.action)} />
        </div>
      )
    },
  },
]