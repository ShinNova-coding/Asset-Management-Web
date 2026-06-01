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

  return (
    <div className=" bg-gray-50">
      <Select
        value={(statusColumn.getFilterValue() as string) ?? "Status"}
        onValueChange={(value) => {
         
          statusColumn.setFilterValue(value === "all" ? undefined : value)
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Status" />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md z-5">
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="suspended">Suspended</SelectItem>
          <SelectItem value="resigned">Resigned</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}