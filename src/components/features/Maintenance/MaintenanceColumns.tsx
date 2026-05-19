"use client"

import type { ColumnDef } from "@tanstack/react-table"
import Delete from "./MaintenanceDelete"
import Edit from "./MaintenanceEdit"

export type Maintenance = {
  asset: string
  name: string
  purchase: string
  warranty: string
  status: "Assigned" | "Available" | "Maintenance" | "Expired"
}

export const columns: ColumnDef<Maintenance>[] = [
  {
    accessorKey: "name",
    header: "Asset Name",
  },

  {
    accessorKey: "purchase",
    header: "Purchase Date",
  },

  {
    accessorKey: "warranty",
    header: "Warranty",
    cell: ({ row }) => {
      const warranty = row.getValue("warranty") as string
      const isExpired = warranty.toLowerCase().includes("expired")

      return (
        <span
          className={`text-sm font-medium ${
            isExpired ? "text-red-600" : "text-gray-700"
          }`}
        >
          {warranty}
        </span>
      )
    },
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string

      const statusStyles: Record<string, string> = {
        Assigned:
          "bg-blue-100 text-blue-700 border border-blue-200",

        Maintenance:
          "bg-yellow-100 text-yellow-700 border border-yellow-200",

        Available:
          "bg-green-100 text-green-700 border border-green-200",

        Expired:
          "bg-red-100 text-red-700 border border-red-200",
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

          <Delete onDelete={() => meta?.deleteRow(item.asset)} />
        </div>
      )
    },
  },
]