"use client"

import type { ColumnDef } from "@tanstack/react-table"
import Delete from "./InventoryDelete"
import Edit from "./InventoryEdit"

export type Inventory = {
  asset_id: string        
  name: string
  model?: string
  ram_capacity?: string   
  storage?: string
  purchased_date: string  
  warranty_period: number | string 
  status: "assigned" | "available" | "maintenance" | "expired" | "pending" | "retired"
  category?: { id: number; name: string }
}

export const columns: ColumnDef<Inventory>[] = [
  { 
    accessorKey: "name", 
    header: "Name" 
  },
  { 
    accessorKey: "purchased_date", 
    header: "Purchase Date" 
  },
  { 
    accessorKey: "warranty_period", 
    header: "Warranty",
    cell: ({ row }) => {
      const rawWarranty = row.getValue("warranty_period")
      
      let warrantyDisplay = ""
      if (typeof rawWarranty === "number") {
        warrantyDisplay = `${rawWarranty} Months`
      } else {
        warrantyDisplay = (rawWarranty as string) || "No Warranty"
      }

      const isExpired = warrantyDisplay.toLowerCase().includes("expired")
      
      return (
        <span className={isExpired ? "text-red-600 font-semibold" : "text-slate-700"}>
          {warrantyDisplay}
        </span>
      )
    },
  },
  { 
    accessorKey: "status", 
    header: "Status",
    cell: ({ row }) => {
      const status = (row.getValue("status") as string || "available").toLowerCase()
      
      const statusStyles: Record<string, string> = {
        "assigned": "bg-blue-100 text-blue-700 border-blue-200",
        "maintenance": "bg-amber-100 text-amber-700 border-amber-200",
        "available": "bg-green-100 text-green-700 border-green-200",
        "pending": "bg-yellow-100 text-yellow-700 border-yellow-200",
        "expired": "bg-rose-100 text-rose-700 border-rose-200",
        "retired": "bg-red-100 text-red-700 border-red-200 font-bold", 
      }
      
      const style = statusStyles[status] || "bg-slate-100 text-slate-700 border-slate-200"
      const displayLabel = status.charAt(0).toUpperCase() + status.slice(1)

      return (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${style}`}>
          {displayLabel}
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
      const targetIdentifier = item.asset_id 

      return (
        /* ✨ DOUBLE PROTECTION: e.stopPropagation() combined with e.preventDefault() 
          instantly cancels event bubbling out to parent <TableRow /> components.
        */
        <div 
          className="flex items-center gap-2" 
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <Edit 
            onEdit={() => {
              if (meta?.editRow) {
                meta.editRow(item)
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