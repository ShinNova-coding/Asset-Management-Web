"use client"

import * as React from "react"

import { useNavigate } from "react-router-dom" 
import { FiChevronLeft, FiChevronRight, FiTrash2, FiAlertCircle, FiCheckCircle, FiX,FiSearch } from "react-icons/fi"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnFiltersState,
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
import { columns, type ActivityLog } from "./ActivityColumns"

interface ActivityTableProps {
  data: ActivityLog[]
}

export function ActivityTable({ data: initialData }: ActivityTableProps) {
  const navigate = useNavigate()
  
 
  const [tableData, setTableData] = React.useState<ActivityLog[]>(initialData)
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  
  const [deleteModal, setDeleteModal] = React.useState<{ isOpen: boolean; targetId: string | null }>({
    isOpen: false,
    targetId: null,
  })
  const [showToast, setShowToast] = React.useState(false)

 
  React.useEffect(() => {
    setTableData(initialData)
  }, [initialData])

  
  const handleDeleteTrigger = (id: string) => {
    setDeleteModal({ isOpen: true, targetId: id })
  }

  const handleEdit = (item: any) => {
    navigate("/activity/add", { state: { editItem: item } })
  }

  const handleConfirmDelete = () => {
    if (deleteModal.targetId) {
      setTableData((prev) => prev.filter((item) => item.id !== deleteModal.targetId))
      setDeleteModal({ isOpen: false, targetId: null })
      setShowToast(true)
    }
  }

  
  React.useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showToast])

  // Single TanStack instance configurations
  const table = useReactTable({
    data: tableData,
    columns,
    state: { 
      globalFilter,
      columnFilters, 
    },
    meta: {
      deleteRow: handleDeleteTrigger,
      editRow: handleEdit, 
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters, 
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  })

  const pageCount = table.getPageCount()
  const currentPage = table.getState().pagination.pageIndex

  return (
    <div className="w-full space-y-4">
      
      <div className="relative max-w-sm">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search activity logs..."
          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none text-sm focus:ring-2 focus:ring-blue-400 transition-all bg-slate-50"
        />
      </div>

      
      <div className="rounded-md border border-slate-200 overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-blue-300">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-none">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-white font-bold py-3 text-sm">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow 
                  key={row.id} 
                  className="border-b border-slate-100 transition-colors hover:bg-slate-50/60"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3 text-slate-700 text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-slate-400 text-sm">
                  No matches found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end items-center space-x-2 pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="p-2 disabled:opacity-40"
        >
          <FiChevronLeft size={16} />
        </Button>

        <div className="flex gap-1 items-center">
          {Array.from({ length: pageCount }).map((_, index) => {
            const isFirst = index === 0
            const isLast = index === pageCount - 1
            const isWithinRange = index >= currentPage - 1 && index <= currentPage + 1

            if (isFirst || isLast || isWithinRange) {
              return (
                <Button
                  key={index}
                  variant={currentPage === index ? "default" : "outline"}
                  size="sm"
                  className={currentPage === index ? "bg-blue-300 text-slate-800 font-semibold border-none hover:bg-blue-400" : "bg-slate-100 text-slate-700"}
                  onClick={() => table.setPageIndex(index)}
                >
                  {index + 1}
                </Button>
              )
            }

            if (index === 1 || index === pageCount - 2) {
              return (
                <span key={index} className="px-2 text-slate-400 text-sm select-none">
                  ...
                </span>
              )
            }

            return null
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="p-2 disabled:opacity-40"
        >
          <FiChevronRight size={16} />
        </Button>
      </div>

      {/* Temporary Inline Toast Representation (Style/move this custom element where needed) */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-slate-900 text-white px-4 py-2 rounded shadow-lg text-sm transition-all z-50">
          Row successfully deleted.
        </div>
      )}

      
       {deleteModal.isOpen && (
             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs animate-fade-in">
               <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4 border border-slate-100 text-center space-y-4 animate-scale-up">
                 <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-50 text-red-600">
                   <FiAlertCircle size={24} />
                 </div>
                 <div className="space-y-2">
                   <h3 className="text-lg font-semibold text-slate-900">Are you absolutely sure?</h3>
                   <p className="text-sm text-slate-500">
                     This action cannot be undone. This item will be permanently removed.
                   </p>
                 </div>
                 <div className="flex gap-3 pt-2">
                   <button
                     type="button"
                     onClick={() => setDeleteModal({ isOpen: false, targetId: null })}
                     className="w-full px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                   >
                     Cancel
                   </button>
                   <button
                     type="button"
                     onClick={handleConfirmDelete}
                     className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors"
                   >
                     Delete
                   </button>
                 </div>
               </div>
             </div>
           )}
     
           {showToast && (
             <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-800 transition-all duration-300 transform translate-x-0 max-w-md animate-slide-in">
               <FiCheckCircle className="text-green-400 shrink-0" size={20} />
               <div className="flex-1">
                 <p className="text-sm font-semibold">Delete Successful</p>
                 <p className="text-xs text-slate-400">The requested asset data records were updated safely.</p>
               </div>
               <button 
                 type="button" 
                 onClick={() => setShowToast(false)}
                 className="text-slate-400 hover:text-white transition-colors p-1"
               >
                 <FiX size={16} />
               </button>
             </div>
           )}
     
           
    </div>
  )
}