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
    <div className=" w-full bg-transparent">
      
      <Select
        value={currentValue}
        onValueChange={(value) => {
          statusColumn.setFilterValue(value === "all" ? undefined : value)
        }}
      >
       
<SelectTrigger className="w-full ...">
 
  <SelectValue placeholder="Select Status" />
</SelectTrigger>
        
      
     <SelectContent 
  className="bg-white border border-slate-200 rounded-xl shadow-lg" 
  sideOffset={2}//to set distance from trigger
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
 
