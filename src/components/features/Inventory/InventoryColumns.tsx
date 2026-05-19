"use client"
import type { ColumnDef } from "@tanstack/react-table"
import Delete from "./InventoryDelete"
import Edit from "./InventoryEdit"

export type Inventory = {
  id: string
  asset: string
  name: string
  no: string
  purchase: string
  warranty: string
  status: "Deployed" | "Available" | "In Repair" | "Expired";
}

export const columns: ColumnDef<Inventory>[] = [
  { accessorKey: "asset", header: "Asset ID" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "no", header: "Serial No" },
  { accessorKey: "purchase", header: "Purchase Date" },
  { 
    accessorKey: "warranty", 
    header: "Warranty",
    cell: ({ row }) => {
      const warranty = row.getValue("warranty") as string;
      const isExpired = warranty.toLowerCase().includes("expired");
      return (
        <span className={isExpired ? "text-red-600 font-medium" : ""}>
          {warranty}
        </span>
      );
    },
  },
  { 
    accessorKey: "status", 
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusStyles: Record<string, string> = {
        "Deployed": "bg-blue-100 text-blue-700 border-blue-200",
        "In Repair": "bg-yellow-100 text-yellow-700 border-yellow-200",
        "Available": "bg-green-100 text-green-700 border-green-200",
      };
      const style = statusStyles[status] || "bg-gray-100 text-gray-200";
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${style}`}>
          {status}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row, table }) => {
      const item = row.original
      
      
      const meta = table.options.meta as any;

      return (
        <div className="flex items-center gap-2">
          
          <Edit onEdit={() => meta?.editRow(item.id)} />
          
          
          <Delete onDelete={() => meta?.deleteRow(item.id)} />
        </div>
      )
    },
  },
]