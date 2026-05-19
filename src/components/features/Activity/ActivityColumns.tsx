"use client"

import type { ColumnDef } from "@tanstack/react-table"

export type ActivityLog = {
  id: string
  user: string
  action: "Created" | "Updated" | "Deleted" | "Maintenance Check"
  targetAsset: string
  timestamp: string
  details: string
}

export const columns: ColumnDef<ActivityLog>[] = [
  { 
    accessorKey: "user", 
    header: "User / Operator" 
  },
  { 
    accessorKey: "action", 
    header: "Action Run",
    cell: ({ row }) => {
      const action = row.getValue("action") as string;
      
      const badgeStyles: Record<string, string> = {
        "Created": "bg-green-100 text-green-700 border-green-200",
        "Updated": "bg-blue-100 text-blue-700 border-blue-200",
        "Deleted": "bg-red-100 text-red-700 border-red-200",
        "Maintenance Check": "bg-purple-100 text-purple-700 border-purple-200",
      };
      
      const style = badgeStyles[action] || "bg-slate-100 text-slate-700 border-slate-200";
      
      return (
        <span className={`px-2,5 py-1 rounded-full text-xs font-semibold border ${style}`}>
          {action}
        </span>
      );
    },
  },
  { 
    accessorKey: "targetAsset", 
    header: "Target Asset" 
  },
  { 
    accessorKey: "details", 
    header: "Changes Made" 
  },
  { 
    accessorKey: "timestamp", 
    header: "Timestamp",
    cell: ({ row }) => {
      const dateVal = row.getValue("timestamp") as string;
      return <span className="text-slate-500 text-sm">{dateVal}</span>;
    }
  }
]