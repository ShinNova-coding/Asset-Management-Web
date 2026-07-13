
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

 
  const currentValue = (statusColumn.getFilterValue() as string) ?? ""

  return (
    <div className="w-full bg-transparent">
      <Select
        value={currentValue}
        onValueChange={(value) => {
          
          statusColumn.setFilterValue(value === "all" ? undefined : value)
        }}
      >
        <SelectTrigger className="w-full h-10 border border-slate-200 bg-white rounded-xl focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED] data-[state=open]:ring-2 data-[state=open]:ring-[#7C3AED] data-[state=open]:border-[#7C3AED] transition-all duration-150">
          <SelectValue placeholder="Select Status" />
        </SelectTrigger>
        
        <SelectContent className="bg-white border border-slate-200 rounded-xl shadow-lg">
         
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="available">Available</SelectItem>
          <SelectItem value="returned">Returned</SelectItem>
          <SelectItem value="maintenance">Maintenance</SelectItem>
        
          <SelectItem value="retired">Retired</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
