"use client"

import * as React from "react"
import { useNavigate } from "react-router-dom" 
import { FiChevronLeft, FiChevronRight, FiAlertCircle, FiCheckCircle, FiX } from "react-icons/fi" 
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

import { columns } from "./InventoryColumns"
import { InventorySearch } from "./InventorySearchBox"
import { InventoryFilter } from "./InventoryFilter"

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
    return baseItems.filter((item) => !deletedIds.includes(item.asset_id));
  }

  const [data, setData] = React.useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const cachedData = localStorage.getItem("inventory_data")
      if (cachedData) {
        const parsed = JSON.parse(cachedData)
        if (parsed.length > 0) {
          return getExcludedDeletedItems(processExpiredWarranties(parsed))
        }
      }
    }
    return getExcludedDeletedItems(processExpiredWarranties(initialData || []))
  }) 

  const [globalFilter, setGlobalFilter] = React.useState("")
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

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
    if (data) {
      localStorage.setItem("inventory_data", JSON.stringify(data))
    }
  }, [data])

  const handleDeleteTrigger = (id: string) => {
    setDeleteModal({ isOpen: true, targetId: id })
  }

  const handleConfirmDelete = async () => {
    if (deleteModal.targetId) {
      const targetId = deleteModal.targetId
      
      try {
        const API_URL = `http://192.168.100.185:1010/api/asset/${targetId}`;
        const currentToken = localStorage.getItem("token") || "128|T7ZfI9NF6X0CnWSOpEIxdy4Xjka4mKtiYw4bllii6732bd8a";

        const response = await fetch(API_URL, {
          method: "DELETE",
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${currentToken}`
          }
        });

        if (!response.ok) {
          throw new Error(`Server returned status code: ${response.status}`);
        }

        const updatedList = data.filter((item) => item.asset_id !== targetId)
        setData(updatedList)
        localStorage.removeItem("inventory_data")

        if (typeof window !== "undefined") {
          const excludedTrack = localStorage.getItem("deleted_asset_ids")
          const deletedIds: string[] = excludedTrack ? JSON.parse(excludedTrack) : []
          if (!deletedIds.includes(targetId)) {
            deletedIds.push(targetId)
            localStorage.setItem("deleted_asset_ids", JSON.stringify(deletedIds))
          }
        }
        
        setShowToast(true)
      } catch (error: any) {
        console.error("❌ Failed to delete asset:", error);
        alert(`Could not delete asset from server:\n${error.message}`);
      } finally {
        setDeleteModal({ isOpen: false, targetId: null })
      }
    }
  }

  React.useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showToast])

  // 🛠️ Triggers when clicking "Edit" action button specifically (goes to /inventory/add)
  const handleEdit = (item: any) => {
    const targetId = item.asset_id || item.id;
    navigate("/inventory/add", { 
      state: { 
        id: targetId,
        editItem: item 
      } 
    })
  }

  // 🌟 NEW: Triggers when clicking a Table Row (goes to read-only details page /inventory/:id)
  const handleViewDetails = (item: any) => {
    const targetId = item.asset_id || item.id;
    navigate(`/inventory/${targetId}`, {
      state: {
        id: targetId,
        detailsItem: item // Passes item details directly to your inventoryDetail.tsx view
      }
    })
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
      editRow: handleEdit, // Kept for your dropdown action menus or edit icon columns
      updateRowAction: (targetId: string, newAction: string) => {
        setData((prevData) =>
          prevData.map((item) =>
            item.asset_id === targetId ? { ...item, action: newAction } : item
          )
        )
      },
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters, 
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  })

  return (
    <div className="w-full space-y-4 p-3 relative">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full">
        <div className="flex-1">
          <div className="w-full rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-blue-400 overflow-hidden">
            <InventorySearch value={globalFilter} onChange={setGlobalFilter} />
          </div>
        </div>
        <div className="w-full md:w-[180px]">
          <div className="bg-transparent p-0">
            <InventoryFilter table={table} />
          </div>
        </div>
      </div>

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
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell 
                      key={cell.id} 
                      className="py-3 text-slate-700 text-sm"
                      onClick={(e) => {
                        // 🌟 FIX: If the user clicks any standard column field, route them to Details. 
                        // If they specifically hit the "actions" block (edit/delete buttons), block this route.
                        if (cell.column.id !== "actions") {
                          handleViewDetails(row.original);
                        }
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-slate-400 text-sm">
                  No assets available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Confirmation Delete Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <FiAlertCircle size={22} />
              <h3 className="text-base font-bold text-slate-900">Confirm Permanent Removal</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to completely delete this asset? This action will permanently remove the record from the database server and Apidog history.
            </p>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModal({ isOpen: false, targetId: null })}
                className="px-4 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UI Action Notification Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-800">
          <FiCheckCircle className="text-emerald-400" size={16} />
          <span className="text-xs font-medium">Asset successfully deleted from database.</span>
          <button onClick={() => setShowToast(false)} className="text-slate-400 hover:text-white ml-2 transition-colors">
            <FiX size={14} />
          </button>
        </div>
      )}
    </div>
  )
}