"use client"

import * as React from "react"
import { useNavigate } from "react-router-dom" 
import { FiChevronLeft, FiChevronRight, FiTrash2, FiAlertCircle, FiCheckCircle, FiX } from "react-icons/fi" 
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

import { columns } from "./MaintenanceColumns"
import { MaintenanceSearch } from "./MaintenanceSearchBox"


interface MaintenanceTableProps {
  data: any[]
}

export function MaintenanceTable({ data: initialData }: MaintenanceTableProps) {
  const navigate = useNavigate() 
  const [data, setData] = React.useState(initialData)
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  
  const [deleteModal, setDeleteModal] = React.useState<{ isOpen: boolean; targetId: string | null }>({
    isOpen: false,
    targetId: null,
  })
  const [showToast, setShowToast] = React.useState(false)

 
  const handleDeleteTrigger = (id: string) => {
    setDeleteModal({ isOpen: true, targetId: id })
  }

  
  const handleConfirmDelete = () => {
    if (deleteModal.targetId) {
      
      setData((prev) => prev.filter((item) => item.asset !== deleteModal.targetId && item.id !== deleteModal.targetId))
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

  const handleEdit = (item: any) => {
    navigate("/maintenance/add", { state: { editItem: item } })
  }

  const table = useReactTable({
    data,
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
    <div className="w-full space-y-4 p-4 relative">
      
      <div className="flex w-full items-center justify-between gap-4">
        <MaintenanceSearch value={globalFilter} onChange={setGlobalFilter} />
      
      </div>

     
      <div className="rounded-md border-slate-400 overflow-hidden">
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
                <TableRow 
                  key={row.id} 
                  className="transition-colors hover:bg-slate-50 border-slate-300 cursor-pointer"
                  onClick={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.closest('button') || target.closest('svg') || target.closest('a')) {
                      return; 
                    }
                    navigate(`/maintenance/${row.original.id}`, { 
                      state: { item: row.original } 
                    })
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-slate-500">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

     
      <div className="flex justify-end items-center space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 disabled:opacity-50"
          onClick={(e) => {
            e.stopPropagation() 
            table.previousPage()
          }}
          disabled={!table.getCanPreviousPage()}
        >
          <FiChevronLeft size={16} />
        </Button>

        <div className="flex gap-1 items-center">
          {Array.from({ length: pageCount }).map((_, index) => {
            if (
              index === 0 ||
              index === pageCount - 1 ||
              (index >= currentPage - 1 && index <= currentPage + 1)
            ) {
              return (
                <Button
                  key={index}
                  variant={currentPage === index ? "default" : "outline"}
                  size="sm"
                  className={`disabled:opacity-50 ${
                    currentPage === index
                      ? "bg-blue-300 hover:bg-blue-400 text-white border-none"
                      : "bg-slate-200"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation() 
                    table.setPageIndex(index)
                  }}
                >
                  {index + 1}
                </Button>
              )
            }
            if (index === currentPage - 2 || index === currentPage + 2) {
              return <span key={index} className="px-2 flex items-center text-gray-500">...</span>
            }
            return null
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 disabled:opacity-50"
          onClick={(e) => {
            e.stopPropagation() 
            table.nextPage()
          }}
          disabled={!table.getCanNextPage()}
        >
          <FiChevronRight size={16} />
        </Button>
      </div>

      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4 border border-slate-100 text-center space-y-4 animate-scale-up">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-50 text-red-600">
              <FiAlertCircle size={24} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-900">Are you absolutely sure?</h3>
              <p className="text-sm text-slate-500">
                {/* Are you sure you want to delete this employe */}
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