// InventoryFilter.tsx
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

  // 1. Change fallback to an empty string so the placeholder can render
  const currentValue = (statusColumn.getFilterValue() as string) ?? ""

  return (
    <div className="w-full bg-transparent">
      <Select
        value={currentValue}
        onValueChange={(value) => {
          // 2. Clear filter if "all" is picked, otherwise set the value
          statusColumn.setFilterValue(value === "all" ? undefined : value)
        }}
      >
        <SelectTrigger className="w-full h-10 border border-slate-200 bg-white rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 data-[state=open]:ring-2 data-[state=open]:ring-blue-400 data-[state=open]:border-blue-400 transition-all duration-150">
          <SelectValue placeholder="Select Status" />
        </SelectTrigger>
        
        <SelectContent className="bg-white border border-slate-200 rounded-xl shadow-lg">
          {/* 3. Leave value as "all" so your onValueChange handler clears the filter */}
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="available">Available</SelectItem>
          <SelectItem value="Returned">Returned</SelectItem>
          <SelectItem value="Maintenance">Maintenance</SelectItem>
          <SelectItem value="Pending">Pending</SelectItem>
          <SelectItem value="Retired">Retired</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}