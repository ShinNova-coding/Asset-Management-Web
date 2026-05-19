"use client"
import type { ColumnDef } from "@tanstack/react-table"
import Delete from "./InventoryDelete"
import Edit from "./InventoryEdit"

export type Inventory = {
  asset: string
  name: string
  purchase: string
  warranty: string
  status: "Assigned" | "Available" | "Maintenance" | "Expired";
}

export const columns: ColumnDef<Inventory>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "purchase", header: "Purchase Date" },
  { 
    accessorKey: "warranty", 
    header: "Warranty",
    cell: ({ row }) => {
      const warranty = row.getValue("warranty") as string;
      const isExpired = warranty.toLowerCase().includes("expired");
      return (
        <span className={isExpired ? " font-medium" : ""}>
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
        "Assigned": "bg-blue-100 text-blue-700 border-blue-200",
        "Maintenance": "bg-yellow-100 text-yellow-700 border-yellow-200",
        "Available": "bg-green-100 text-green-700 border-green-200",
      };
      const style = statusStyles[status] || "bg-black text-gray-200";
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
         
          <Edit onEdit={() => meta?.editRow(item)} />
          
          <Delete onDelete={() => meta?.deleteRow(item.asset)} />
        </div>
      )
    },
  },
]