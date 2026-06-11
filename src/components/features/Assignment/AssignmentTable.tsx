"use client"

import * as React from "react"
import { useNavigate } from "react-router-dom"
import { FiChevronLeft, FiChevronRight, FiCheckCircle, FiX } from "react-icons/fi"
import { Search } from "lucide-react"

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
import type { Assignment } from "@/data/assignmentdata"
import { columns as baseColumns } from "./AssignmentColumns"

interface AssignmentTableProps {
  data: Assignment[]
  onDeleteSuccess?: (id: string | number) => void
}

export function AssignmentTable({ data: initialData, onDeleteSuccess }: AssignmentTableProps) {
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [data, setData] = React.useState<Assignment[]>(initialData)

  const [deleteModal, setDeleteModal] = React.useState<{ isOpen: boolean; targetId: string | number | null }>({
    isOpen: false,
    targetId: null,
  })
  const [showToast, setShowToast] = React.useState(false)

  React.useEffect(() => {
    setData(initialData)
  }, [initialData])

  const navigate = useNavigate()

  const handleDeleteTrigger = (id: string | number) => {
    setDeleteModal({ isOpen: true, targetId: id })
  }

  const handleConfirmDelete = async () => {
    if (!deleteModal.targetId) return

    const targetId = String(deleteModal.targetId).trim()
    const API_URL = `http://192.168.100.186:1010/api/assignment/${targetId}`
    const token = localStorage.getItem("token") || ""

    try {
      const response = await fetch(API_URL, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const result = await response.json().catch(() => ({}))
        throw new Error(result.message || "Delete failed")
      }

      setData((prev) => prev.filter((item) => String(item.id) !== targetId))
      if (onDeleteSuccess) {
        onDeleteSuccess(targetId)
      }
      setShowToast(true)
    } catch (error: any) {
      console.error("❌ Delete failed:", error)
      alert(`Delete failed: ${error.message}`)
    } finally {
      setDeleteModal({ isOpen: false, targetId: null })
    }
  }

  const handleEdit = (item: any) => {
    navigate(`/assignment/edit/${item.id}`, { state: { assignment: item } })
  }

  const table = useReactTable({
    data,
    columns: baseColumns,
    meta: {
      deleteRow: handleDeleteTrigger,
      editRow: handleEdit,
    },
    state: {
      globalFilter,
      columnFilters,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  })

  const pageCount = table.getPageCount()
  const currentPage = table.getState().pagination.pageIndex

  return (
    <div className="w-full space-y-4 p-3 relative">
      {/* SEARCH + FILTER AREA */}
      <div className="flex gap-4 rounded-xl bg-white p-4 border border-slate-200 shadow-sm items-center">
        {/* SEARCH */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700" size={18} />
          <input
            type="text"
            placeholder="Search..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full rounded-md border border-slate-400 bg-slate-50 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* FILTER */}
        <div className="relative w-48">
          <select
            value={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
            onChange={(e) => table.getColumn("status")?.setFilterValue(e.target.value)}
            className="w-full rounded-md border border-slate-400 bg-slate-50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="returned">Returned</option>
          </select>
        </div>
      </div>

      {/* MAIN DATA TABLE */}
      <div className="rounded-md border border-slate-200 overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-blue-400">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-none">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-white font-semibold py-3 text-sm">
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
                  className="transition-colors hover:bg-slate-50/80 border-b border-slate-100 cursor-pointer"
                  onClick={(e) => {
                    const item = row.original as any
                    const target = e.target as HTMLElement
                    
                    if (target.closest('[data-actions-cell="true"]') || target.closest('button')) {
                      return
                    }
                    
                    navigate(`/assignment/${item.id}`)
                  }}
                >
                  {row.getVisibleCells().map((cell) => {
                    const isActions = cell.column.id === "actions"
                    return (
                      <TableCell 
                        key={cell.id} 
                        className="py-3 text-slate-700 text-sm"
                        {...(isActions ? { "data-actions-cell": "true" } : {})}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={baseColumns.length} className="h-24 text-center text-slate-400 text-sm">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION CONTROLS */}
      <div className="flex items-center justify-between px-2 py-1 bg-white rounded-lg border border-slate-200 p-2 shadow-sm">
        <div className="text-xs text-slate-500 font-medium">
          Page {currentPage + 1} of {pageCount} ({table.getFilteredRowModel().rows.length} total assignments)
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
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
                    className={currentPage === index ? "bg-blue-300 hover:bg-blue-400 text-white border-none" : "bg-slate-200"}
                    onClick={() => table.setPageIndex(index)}
                  >
                    {index + 1}
                  </Button>
                )
              }
              if (index === currentPage - 2 || index === currentPage + 2) {
                return <span key={index} className="px-2 text-gray-500">...</span>
              }
              return null
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <FiChevronRight size={16} />
          </Button>
        </div>
      </div>

      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">Confirm Delete</h3>
            <p className="text-xs text-slate-500">Are you sure you want to delete this assignment record?</p>
            <div className="flex justify-end gap-2.5 pt-2">
              <button 
                onClick={() => setDeleteModal({ isOpen: false, targetId: null })} 
                className="px-4 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmDelete} 
                className="px-4 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg animate-fade-in">
          <FiCheckCircle className="text-emerald-400" size={16} />
          <span className="text-xs font-medium">Assignment successfully deleted.</span>
          <button onClick={() => setShowToast(false)}><FiX size={14} /></button>
        </div>
      )}
    </div>
  )
}