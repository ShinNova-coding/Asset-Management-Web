"use client"
import { IoFilterSharp } from "react-icons/io5"
import type{ Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface InventoryFilterProps<TData> {
  table: Table<TData>
}

export function InventoryFilter<TData>({ table }: InventoryFilterProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger  asChild>
        <Button variant="outline" className="flex gap-2">
          <IoFilterSharp className="h-4 w-4" />
          Filters
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {table
          .getAllColumns()
          .filter((col) => col.getCanHide())
          .map((col) => (
            <DropdownMenuCheckboxItem
              key={col.id}
              className="capitalize"
              checked={col.getIsVisible()}
              onCheckedChange={(value) => col.toggleVisibility(!!value)}
            >
              {col.id}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}