
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

 //if there's no filter set is to select status
  const currentValue = (statusColumn.getFilterValue() as string) ?? "Select status"

  return (
    <div className=" w-full bg-transparent">
      
      <Select
        value={currentValue}
        onValueChange={(value) => {
          statusColumn.setFilterValue(value === "all" ? undefined : value)
        }}
      >
       
<SelectTrigger className="w-full">
 
  <SelectValue placeholder="Select Status" />
</SelectTrigger>
        
      
     <SelectContent 
  className="bg-white border border-slate-200 rounded-xl shadow-lg" 
  sideOffset={2}//to set distance from trigger
  alignItemWithTrigger={false} 
>
  <SelectItem value="all">All Status</SelectItem>
  <SelectItem value="available">Available</SelectItem>
  <SelectItem value="assigned">Assigned</SelectItem>
  <SelectItem value="maintenance">Maintenance</SelectItem>
  <SelectItem value="retired">Retired</SelectItem>
</SelectContent>
</Select>
    </div>
  )
}
