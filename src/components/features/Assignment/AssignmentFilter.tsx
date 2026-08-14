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
   <SelectItem value="All Status">All Status</SelectItem>
          <SelectItem value="Active">Active</SelectItem>
          <SelectItem value="Returned">Returned</SelectItem>
</SelectContent>
</Select>
    </div>
  )
}
 
