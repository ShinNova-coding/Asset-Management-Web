"use client"

import type { ColumnDef } from "@tanstack/react-table"
import Delete from "./ActivityDelete"
import Edit from "./ActivityEdit"

export type ActivityLog = {
  id: string
  action: "Active" | "Pending" | "Returned" 
  assigndate: string | Date
  returndate: string | Date
  actions: string
}

const formatDate = (dateValue: string | Date) => {
  if (!dateValue) return "-"
  const date = new Date(dateValue)
  if (isNaN(date.getTime())) return String(dateValue) 
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  })
}

export const columns: ColumnDef<ActivityLog>[] = [
  { 
    accessorKey: "id", 
    header: "Employee ID" 
  },
  { 
    accessorKey: "action", 
    header: "Status",
    cell: ({ row }) => {
      const action = row.getValue("action") as string;
      
      const badgeStyles: Record<string, string> = {
        "Active": "bg-green-100 text-green-700 border-green-200",
        "Returned": "bg-blue-100 text-blue-700 border-blue-200",
        "Pending": "bg-red-100 text-red-700 border-red-200",
      };
      
      const style = badgeStyles[action] || "bg-slate-100 text-slate-700 border-slate-200";
      
      return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${style}`}>
          {action}
        </span>
      );
    },
  },
  { 
    accessorKey: "assigndate", 
    header: "Assign Date",
    cell: ({ getValue }) => formatDate(getValue<string | Date>())
  },
  { 
    accessorKey: "returndate", 
    header: "Return Date",
    cell: ({ getValue }) => formatDate(getValue<string | Date>())
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
          
        
          <Delete onDelete={() => meta?.deleteRow(item.id)} />
        </div>
      )
    },
  },
]