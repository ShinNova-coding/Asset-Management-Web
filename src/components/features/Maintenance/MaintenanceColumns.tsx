"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Maintenance } from "@/data/maintenance"

export const columns: ColumnDef<Maintenance>[] = [
  {
    accessorKey: "employee_name", 
    header: "Employee Name",
  },
  {
    accessorKey: "asset_code",
    header: "Asset Code",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "approver",
    header: "Approver",
  },
  {
    accessorKey: "maintenance_date",
    header: "Maintenance Date",
  },
  {
    accessorKey: "completed_date",
    header: "Completed Date",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    header: "Actions",
  
  },
]