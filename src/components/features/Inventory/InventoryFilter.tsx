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
        <SelectContent className="bg-white">
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="available">Available</SelectItem>
          <SelectItem value="Returned">Returned</SelectItem>
          <SelectItem value="Maintenance">Maintenance</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}