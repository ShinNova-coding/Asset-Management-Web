"use client"

import type { Table } from "@tanstack/react-table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface InventoryFilterProps<TData> {
  table: Table<TData>
}

export function InventoryFilter<TData>({ table }: InventoryFilterProps<TData>) {
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
          <SelectItem value="Returned">Returned</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}