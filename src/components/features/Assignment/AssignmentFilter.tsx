"use client"

import type { Table } from "@tanstack/react-table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AssignmentFilterProps<TData> {
  table: Table<TData>
}

export function AssignmentFilter<TData>({ table }: AssignmentFilterProps<TData>) {
  const statusColumn = table.getColumn("status")

  if (!statusColumn) return null

  return (
    <div className="bg-gray-50">
      <Select
        value={(statusColumn.getFilterValue() as string) ?? "All Status"}
        onValueChange={(value) => {
          statusColumn.setFilterValue(value === "All Status" ? undefined : value)
        }}
      >
        <SelectTrigger className="w-[200px] h-15">
  <SelectValue placeholder="Select Status" />
</SelectTrigger>
        
        <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md z-5">
          <SelectItem value="All Status">All Status</SelectItem>
          <SelectItem value="Active">Active</SelectItem>
          <SelectItem value="Returned">Returned</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}