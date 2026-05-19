"use client"

import * as React from "react"

import { FiChevronLeft, FiChevronRight } from "react-icons/fi" 
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import { columns } from "./InventoryColumns"
import { InventorySearch } from "./InventorySearchBox"
import { InventoryFilter } from "./InventoryFilter"

interface InventoryTableProps {
  data: any[]
}

export function InventoryTable({ data: initialData }: InventoryTableProps) {
  const [data, setData] = React.useState(initialData)
  const [globalFilter, setGlobalFilter] = React.useState("")
  
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState<any>(null)

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      setData((prev) => prev.filter((item) => item.id !== id))
    }
  }

  const handleEdit = (id: string) => {
    const item = data.find((i) => i.id === id)
    setSelectedItem({ ...item }) 
    setIsEditDialogOpen(true) 
  }

  const handleSave = () => {
    setData((prev) =>
      prev.map((item) => (item.id === selectedItem.id ? selectedItem : item))
    )
    setIsEditDialogOpen(false)
  }

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    meta: {
      deleteRow: handleDelete,
      editRow: handleEdit,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 6 } },
  })

  const pageCount = table.getPageCount()
  const currentPage = table.getState().pagination.pageIndex

  return (
    <div className="w-full space-y-4 p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <InventorySearch value={globalFilter} onChange={setGlobalFilter} />
          <InventoryFilter table={table} />
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-blue-300">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-none">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-white font-semibold py-3">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">No results.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      
      <div className="flex justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          
          <FiChevronLeft size={16} />
          
        </Button>

        <div className="flex gap-1 justify-end">
          {Array.from({ length: pageCount }).map((_, index) => (
            <Button
              key={index}
              variant={currentPage === index ? "default" : "outline"}
              size="sm"
              className={currentPage === index ? "bg-blue-300 hover:bg-blue-400 text-white border-none" : ""}
              onClick={() => table.setPageIndex(index)}
            >
              {index + 1}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          
          
          <FiChevronRight size={16} />
        </Button>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Asset Information</DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input 
                  id="name" 
                  value={selectedItem.name} 
                  className="col-span-3" 
                  onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="asset" className="text-right">Asset ID</Label>
                <Input 
                  id="asset" 
                  value={selectedItem.asset} 
                  className="col-span-3" 
                  onChange={(e) => setSelectedItem({ ...selectedItem, asset: e.target.value })}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button className="bg-blue-300 hover:bg-blue-400" onClick={handleSave}>Confirm Edit</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}