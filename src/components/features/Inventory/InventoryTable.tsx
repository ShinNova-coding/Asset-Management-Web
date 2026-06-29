"use client"

import * as React from "react"
import { useNavigate } from "react-router-dom"
import { FiChevronLeft, FiChevronRight, FiCheckCircle, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi"
import { Search } from "lucide-react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
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

import { columns as baseColumns } from "./InventoryColumns"
import { apiRequest } from "@/lib/apiService";
interface InventoryTableProps {
  data: any[]
}

export function InventoryTable({ data: initialData }: InventoryTableProps) {
  const navigate = useNavigate()

  const processExpiredWarranties = (items: any[]): any[] => {
    if (!Array.isArray(items)) return []
    return items.map((item) => {
      const warrantyValue = item.warranty_period || item.warranty || ""
      const warrantyText = String(warrantyValue).toLowerCase()
      if (warrantyText.includes("expired")) {
        return { ...item, status: "retired" }
      }
      return item
    })
  }

  const getExcludedDeletedItems = (baseItems: any[]): any[] => {
    if (typeof window === "undefined") return baseItems
    const excludedTrack = localStorage.getItem("deleted_asset_ids")
    const deletedIds: string[] = excludedTrack ? JSON.parse(excludedTrack) : []
    return baseItems.filter((item) => !deletedIds.includes(item.id))
  }

  const [data, setData] = React.useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const cachedData = localStorage.getItem("inventory_data")
      if (cachedData) {
        const parsed = JSON.parse(cachedData)
        if (parsed.length > 0) return getExcludedDeletedItems(processExpiredWarranties(parsed))
      }
    }
    return getExcludedDeletedItems(processExpiredWarranties(initialData || []))
  })

  const [globalFilter, setGlobalFilter] = React.useState("")
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [deleteModal, setDeleteModal] = React.useState<{ isOpen: boolean; targetId: string | null }>({
    isOpen: false,
    targetId: null,
  })
  const [showToast, setShowToast] = React.useState(false)

  React.useEffect(() => {
    if (initialData) {
      setData(getExcludedDeletedItems(processExpiredWarranties(initialData)))
    }
  }, [initialData])

  React.useEffect(() => {
    if (data) localStorage.setItem("inventory_data", JSON.stringify(data))
  }, [data])

  const handleDeleteTrigger = (id: string) => {
    setDeleteModal({ isOpen: true, targetId: id })
  }
const handleConfirmDelete = async () => {
    if (!deleteModal.targetId) return

    const targetId = deleteModal.targetId.trim()
    const targetItem = data.find(item => item.id === targetId)

    
    if (targetItem?.status === "maintenance") {
      alert("Delete failed: Asset under maintenance")
      setDeleteModal({ isOpen: false, targetId: null })
      return
    }

    try {
     
      await apiRequest(`/asset/${targetId}`, "DELETE", { id: targetId });

     
      setData((prev) => prev.filter((item) => item.id !== targetId))
      setShowToast(true)
    } catch (error: any) {
     
      console.error("❌ Delete failed:", error)
      alert(`Delete failed: ${error.message}`)
    } finally {
      setDeleteModal({ isOpen: false, targetId: null })
    }
  }

    

  const handleEdit = (item: any) => {
    navigate("/inventory/add", { state: { id: item.id, editItem: item } })
  }

  const handleViewDetails = (item: any) => {
    navigate(`/inventory/${item.id}`, { state: { id: item.id, detailsItem: item } })
  }

  const columns = React.useMemo(() => {
    return [
      {
        id: "number",
        header: "No.",
        cell: ({ row }: any) => row.index + 1,
        enableSorting: false,
      },
      ...baseColumns.map((col: any) => 
        (col.accessorKey === "status" || col.id === "status") 
          ? { ...col, enableSorting: false } 
          : col
      ),
    ]
  }, [])

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, columnFilters, sorting },
    meta: {
      deleteRow: handleDeleteTrigger,
      editRow: handleEdit,
      updateRowAction: (targetId: string, newAction: string) => {
        setData((prevData) => prevData.map((item) => (item.id === targetId ? { ...item, action: newAction } : item)))
      },
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  })

  const pageCount = table.getPageCount()
  const currentPage = table.getState().pagination.pageIndex

  return (
    <div className="w-full space-y-4 p-3 relative">
      <div className="flex gap-4 rounded-md rounded-t-xl bg-white p-4 border border-slate-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700" size={18} />
          <input
            type="text"
            placeholder="Search by name,date,warranty,status..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full rounded-md border border-slate-400 bg-slate-50 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="relative w-48">
          <select
            value={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
            onChange={(e) => table.getColumn("status")?.setFilterValue(e.target.value)}
            className="w-full rounded-md border border-slate-400 bg-slate-50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="assigned">Assigned</option>
            <option value="maintenance">Maintenance</option>
            <option value="retired">Retired</option>
          </select>
        </div>
      </div>

      <div className="rounded-md rounded-b-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-blue-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-none">
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort()
                  return (
                    <TableHead
                      key={header.id}
                      className={`text-white font-semibold py-3 text-sm ${canSort ? "cursor-pointer select-none hover:bg-blue-500/50" : ""}`}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-2">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {canSort && (
                          <div className="flex flex-col">
                            <FiChevronUp 
                              size={12} 
                              className={header.column.getIsSorted() === "asc" ? "text-white" : "text-white/40"} 
                            />
                            <FiChevronDown 
                              size={12} 
                              className={header.column.getIsSorted() === "desc" ? "text-white" : "text-white/40"} 
                            />
                          </div>
                        )}
                      </div>
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="transition-colors hover:bg-slate-50/80 border-b border-slate-100 cursor-pointer">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3 text-slate-700 text-sm" onClick={() => cell.column.id !== "actions" && handleViewDetails(row.original)}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={columns.length} className="h-24 text-center text-slate-400 text-sm">No assets available.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2 py-1 bg-white rounded-lg border border-slate-200 p-2 shadow-sm">
        <div className="text-xs text-slate-500 font-medium">
          Page {currentPage + 1} of {pageCount} ({table.getFilteredRowModel().rows.length} total assets)
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
                    className={currentPage === index ? "bg-blue-800 hover:bg-blue-700 text-white border-none" : "bg-slate-200"}
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
            <p className="text-xs text-slate-500">Are you sure you want to delete this asset?</p>
            <div className="flex justify-end gap-2.5 pt-2">
              <button onClick={() => setDeleteModal({ isOpen: false, targetId: null })} className="px-4 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50">Cancel</button>
              <button onClick={handleConfirmDelete} className="px-4 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}

      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg animate-fade-in">
          <FiCheckCircle className="text-emerald-400" size={16} />
          <span className="text-xs font-medium">Asset successfully deleted.</span>
          <button onClick={() => setShowToast(false)}><FiX size={14} /></button>
        </div>
      )}
    </div>
  )
}