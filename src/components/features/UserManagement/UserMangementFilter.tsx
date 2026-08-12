"use client"

import type { Table } from "@tanstack/react-table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface UserManagementFilterProps<TData> {
  table: Table<TData>
}

export function UserManagementFilter<TData>({ table }: UserManagementFilterProps<TData>) {
  const statusColumn = table.getColumn("status")

  if (!statusColumn) return null

 //if there's no filter set is to select status
  const currentValue = statusColumn.getFilterValue() as string | undefined

  return (
    <div className="w-full bg-transparent">
      <Select
        value={currentValue}
        onValueChange={(value) => {
          statusColumn.setFilterValue(value === "all" ? undefined : value)
        }}
      >
        <SelectTrigger className="h-9 w-full border-slate-300 bg-slate-50 text-slate-700 focus-visible:border-[#A78BFA] focus-visible:ring-[#EDE9FE]">
          <SelectValue placeholder="Select Status" />
        </SelectTrigger>

        <SelectContent
          className="rounded-xl border border-[#DDD6FE] bg-white shadow-lg"
          sideOffset={2}
          alignItemWithTrigger={false}
        >
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="suspended">Suspended</SelectItem>
          <SelectItem value="resigned">Resigned</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
 
