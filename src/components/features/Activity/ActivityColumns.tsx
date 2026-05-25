"use client"

import type { ColumnDef } from "@tanstack/react-table"

export type ActivityLog = {
  id?: string
  username: string
  category: string
  name: string
  action: "Active" | "Pending" | "Returned"
  date: string | Date
}

const formatDate = (dateValue: string | Date) => {
  if (!dateValue) return "-"

  const date = new Date(dateValue)

  if (isNaN(date.getTime())) {
    return String(dateValue)
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export const columns: ColumnDef<ActivityLog>[] = [
  {
    accessorKey: "username",
    header: "Username",
  },

  {
    accessorKey: "category",
    header: "Category",
  },

  {
    accessorKey: "name",
    header: "Asset Name",
  },

  {
    accessorKey: "action",
    header: "Activity",
    cell: ({ row }) => {
      const action = row.getValue("action") as string

      const badgeStyles: Record<string, string> = {
        Active: "bg-green-100 text-green-700 border-green-200",
        Returned: "bg-blue-100 text-blue-700 border-blue-200",
        Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      }

      const style =
        badgeStyles[action] ||
        "bg-slate-100 text-slate-700 border-slate-200"

      return (
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${style}`}
        >
          {action}
        </span>
      )
    },
  },

  {
    accessorKey: "date",
    header: "Date",
    cell: ({ getValue }) => {
      return formatDate(getValue<string | Date>())
    },
  },
]