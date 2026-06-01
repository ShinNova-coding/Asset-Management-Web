// InventoryColumns.tsx
"use client"

import type { ColumnDef } from "@tanstack/react-table"
import Delete from "./InventoryDelete"
import Edit from "./InventoryEdit"

export type Inventory = {
  id?: string
  asset: string
  name: string
  category?: string
  model?: string
  ram?: string
  storage?: string
  purchase: string
  purchaseDate?: string
  warranty: string
  status: "Assigned" | "Available" | "Maintenance" | "Expired" | "Pending" | "Retired"
}

export const columns: ColumnDef<Inventory>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "purchase", header: "Purchase Date" },
  { 
    accessorKey: "warranty", 
    header: "Warranty",
    cell: ({ row }) => {
      const warranty = row.getValue("warranty") as string || ""
      const isExpired = warranty.toLowerCase().includes("expired")
      return (
        <span className={isExpired ? "text-red-600 font-semibold" : "text-slate-700"}>
          {warranty}
        </span>
      )
    },
  },
  { 
    accessorKey: "status", 
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string || "Available"
      
      // Dynamic color tags matching your UI architecture
      const statusStyles: Record<string, string> = {
        "Assigned": "bg-blue-100 text-blue-700 border-blue-200",
        "Maintenance": "bg-amber-100 text-amber-700 border-amber-200",
        "Available": "bg-green-100 text-green-700 border-green-200",
        "Pending": "bg-yellow-100 text-yellow-700 border-yellow-200",
        "Expired": "bg-rose-100 text-rose-700 border-rose-200",
        "Retired": "bg-red-100 text-red-700 border-red-200 font-bold", // Cleaned up styling alignment
      }
      
      const style = statusStyles[status] || "bg-slate-100 text-slate-700 border-slate-200"
      return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${style}`}>
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
      const targetIdentifier = item.id || item.asset

      return (
        <div className="flex items-center gap-2">
          <Edit 
            onEdit={() => {
              if (meta?.editRow) {
                meta.editRow({
                  ...item,
                  id: targetIdentifier
                })
              }
            }} 
          />
          <Delete 
            onDelete={() => {
              if (meta?.deleteRow) {
                meta.deleteRow(targetIdentifier)
              }
            }} 
          />
        </div>
      )
    },
  },
]