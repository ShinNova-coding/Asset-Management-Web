"use client"

import * as React from "react"
import { useNavigate } from "react-router-dom"
import { FiChevronLeft, FiChevronRight, FiCheckCircle, FiCheck, FiChevronUp, FiChevronDown, FiX } from "react-icons/fi" // ✨ Icons များ စုံလင်စွာ Import ထားပါသည်
import { FaEdit } from "react-icons/fa"
import { RiDeleteBin4Fill } from "react-icons/ri"
import { LuEye } from "react-icons/lu"
import { Search } from "lucide-react"

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  getSortedRowModel,       // ✨ Sorting အတွက် ထည့်သွင်းထားပါသည်
  type SortingState,       // ✨ Sorting အတွက် ထည့်သွင်းထားပါသည်
  type ColumnFiltersState,
} from "@tanstack/react-table"

import { apiFetch } from "@/lib/api"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import type { Maintenance } from "@/data/maintenance"
import { columns as baseColumns } from "./MaintenanceColumns"
import { MaintenanceRemark } from "./MaintenanceRemark"

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"

interface MaintenanceTableProps {
  data: Maintenance[]
  onRefresh?: () => void
}

export function MaintenanceTable({ data: initialData, onRefresh }: MaintenanceTableProps) {
  const [data, setData] = React.useState(initialData)
  const [sorting, setSorting] = React.useState<SortingState>([]) // ✨ Sorting State သတ်မှတ်ခြင်း

  React.useEffect(() => {
    setData(initialData)
  }, [initialData])

  const [globalFilter, setGlobalFilter] = React.useState("")
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [toastMessage, setToastMessage] = React.useState<string | null>(null)
  const [selectedItem, setSelectedItem] = React.useState<Maintenance | null>(null)

  const [dialogMode, setDialogMode] = React.useState<"remark" | "edit" | "view" | null>(null)

  const [remarkText, setRemarkText] = React.useState("")

  const [editEmployeeName, setEditEmployeeName] = React.useState("")
  const [editAssetCode, setEditAssetCode] = React.useState("")
  const [editCategory, setEditCategory] = React.useState("")
  const [editApprover, setEditApprover] = React.useState("")
  const [editMaintenanceDate, setEditMaintenanceDate] = React.useState("")
  const [editCompletedDate, setEditCompletedDate] = React.useState("")

  const navigate = useNavigate()

  const closeDialog = () => {
    setDialogMode(null)
    setSelectedItem(null)
    setRemarkText("")
    setEditEmployeeName("")
    setEditAssetCode("")
    setEditCategory("")
    setEditApprover("")
    setEditMaintenanceDate("")
    setEditCompletedDate("")
  }

  const openRemarkDialog = (item: Maintenance) => {
    setSelectedItem(item)
    setRemarkText(item.remark ?? "")
    setDialogMode("remark")
  }

  const openEditDialog = (item: Maintenance) => {
    setSelectedItem(item)
    setEditEmployeeName(item.employee_name ?? "")        
    setEditAssetCode(item.asset_code ?? "")      
    setEditCategory(item.category ?? "")          
    setEditApprover(typeof item.approver === 'object' && item.approver !== null ? (item.approver as any).name : (item.approver ?? "—")) 
    setEditMaintenanceDate(item.maintenance_date ?? "") 
    
    const today = new Date().toISOString().split('T')[0]
    setEditCompletedDate(item.completed_date ?? today) 
    
    setDialogMode("edit")
  }

  const openViewDialog = (item: Maintenance) => {
    setSelectedItem(item)
    setDialogMode("view")
  }

  // ── Submit REMARK ──────────────────────────────────────────────────
  const submitRemark = async () => {
    if (!selectedItem) {
      alert("No maintenance record selected")
      return
    }
    if (!remarkText.trim()) {
      alert("Please enter a remark")
      return
    }

    try {
      await apiFetch(`/maintenance/${selectedItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          maintenance_id: selectedItem.id,
          status: "approved",
          remark: remarkText,
          completed_date: null
        }),
      })

      setData((prev) =>
        prev.map((row) =>
          row.id === selectedItem.id
            ? { ...row, status: "Approved", remark: remarkText }
            : row
        )
      )

      setToastMessage("Approved successfully")
      closeDialog()
      onRefresh?.()  
    } catch (error: any) {
      console.error("Submit Remark Error:", error)
      alert(error?.message || "Failed to submit remark.")
    }
  }

  // ── Submit EDIT ────────────────────────────────────────────────────
  const submitEdit = async () => {
    if (!selectedItem) return
    
    const sanitizedCompletedDate = editCompletedDate.trim()
    if (!sanitizedCompletedDate) {
      alert("Please select a valid completed date.")
      return
    }

    try {
      await apiFetch(`/maintenance/${selectedItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          maintenance_id: selectedItem.id,
          completed_date: sanitizedCompletedDate, 
          status: "completed"
        }),
      })

      setData((prev) =>
        prev.map((row) =>
          row.id === selectedItem.id
            ? { ...row, completed_date: sanitizedCompletedDate, status: "Complete" }
            : row
        )
      )

      setToastMessage("Marked as Complete")
      closeDialog()
      onRefresh?.() 
    } catch (err: any) {
      console.error("Submit Edit Error:", err)
      alert(err?.message || "Failed to submit edit.")
    }
  }

  // ── Delete a row ───────────────────────────────────────────────────
  const deleteRow = async (item: Maintenance, label: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return

    try {
      await apiFetch(`/maintenance/${item.id}`, { method: "DELETE" })
      setData((prev) => prev.filter((r) => r.id !== item.id))
      setToastMessage(`${item.employee_name ?? "Asset"} ${label}`)
      onRefresh?.()
    } catch (err: any) {
      console.error("Delete Error:", err)
      alert(err?.message || "Failed to delete record.")
    }
  }

  React.useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toastMessage])

  // ── Column overrides & Prepend Numbering ───────────────────────────
  const columns = React.useMemo(() => {
    const indexColumn = {
      id: "rowNumber",
      header: "No.",
      cell: ({ row, table }: { row: any; table: any }) => {
        const pageIndex = table.getState().pagination.pageIndex
        const pageSize = table.getState().pagination.pageSize
        return <span>{pageIndex * pageSize + row.index + 1}</span>
      },
    }

    const customizedColumns = baseColumns.map((col) => {
      if ((col as any).accessorKey === "status" || (col as any).id === "status") {
        return {
          ...col,
          header: "Status",
          cell: ({ row }: { row: any }) => {
            const status = row.getValue("status") as string
            const statusStyles: Record<string, string> = {
              Request: "bg-red-100 text-red-700 border border-red-200",
              Pending: "bg-gray-200 text-gray-700 border border-gray-200",
              Approved: "bg-green-100 text-green-700 border border-green-200",
              "In Progress": "bg-amber-100 text-amber-700 border border-amber-200",
              Complete: "bg-blue-100 text-blue-700 border border-blue-200",
              Cancelled: "bg-gray-200 text-gray-600 border border-gray-300",
            }
            return (
              <div className="flex items-center">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[status] ?? "bg-slate-100 text-slate-700 border border-slate-200"}`}>
                  {status}
                </span>
              </div>
            )
          },
        }
      }

      if ((col as any).id === "actions") {
        return {
          ...col,
          cell: ({ row }: { row: any }) => {
            const item = row.original as Maintenance
            const status = item.status?.trim().toLowerCase()

            if (status === "request" || status === "requested") {
              return (
                <div className="flex items-center gap-3">
                  <button
                    title="Approve Request"
                    className="text-green-500 hover:text-green-700 transition p-1"
                    onClick={(e) => { e.stopPropagation(); openRemarkDialog(item) }}
                  >
                    <FiCheck size={20} />
                  </button>
                  <button
                    title="Cancel Request"
                    className="text-red-500 hover:text-red-700 transition p-1"
                    onClick={(e) => { e.stopPropagation(); deleteRow(item, "request cancelled.") }}
                  >
                    <RiDeleteBin4Fill size={20} />
                  </button>
                </div>
              )
            }

            if (status === "approved") {
              return (
                <div className="flex items-center gap-3">
                  <button
                    title="Edit"
                    className="text-blue-500 hover:text-blue-700 transition p-1"
                    onClick={(e) => { e.stopPropagation(); openEditDialog(item) }}
                  >
                    <FaEdit size={20} />
                  </button>
                  <button
                    title="Delete"
                    className="text-red-500 hover:text-red-700 transition p-1"
                    onClick={(e) => { e.stopPropagation(); deleteRow(item, "record deleted.") }}
                  >
                    <RiDeleteBin4Fill size={20} />
                  </button>
                </div>
              )
            }

            if (status === "complete" || status === "completed") {
              return (
                <button
                  title="View Details"
                  className="text-slate-500 hover:text-slate-700 transition p-1"
                  onClick={(e) => { e.stopPropagation(); openViewDialog(item) }}
                >
                  <LuEye size={20} />
                </button>
              )
            }

            return <span className="text-red-500 text-xs">Unknown: {item.status}</span>
          },
        }
      }

      return col
    })

    return [indexColumn, ...customizedColumns]
  }, [baseColumns])

  // ── ⚙️ USE REACT TABLE CONFIGURATION ────────────────────────────────
  const table = useReactTable({
    data,
    columns,
    state: { 
      globalFilter, 
      columnFilters,
      sorting // ✨ Sorting state ချိတ်ဆက်ခြင်း
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,             // ✨ Sorting trigger ချိတ်ဆက်ခြင်း
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),  // ✨ Sorting logic ချိတ်ဆက်ခြင်း
    initialState: { pagination: { pageSize: 5 } },
  })

  const pageCount = table.getPageCount()
  const currentPage = table.getState().pagination.pageIndex

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm p-3 space-y-2 relative">
      
      {/* ── SEARCH BOX ── */}
      <div className="flex gap-4 rounded-xl bg-white p-4 border border-slate-200 shadow-sm items-center">
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
      </div>

      {/* ── TABLE VIEW ── */}
      <div className="rounded-md border border-slate-200 overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-blue-400">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-none">
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort() // Sorting လုပ်လို့ရတဲ့ ကော်လံလား စစ်ဆေးခြင်း
                  return (
                    <TableHead 
                      key={header.id} 
                      className={`text-white font-semibold py-3 text-sm ${canSort ? "cursor-pointer select-none hover:bg-blue-500/30" : ""}`}
                      onClick={header.column.getToggleSortingHandler()} // ✨ နှိပ်လိုက်လျှင် Sort အပိတ်အဖွင့်လုပ်မည့် Handler
                    >
                      <div className="flex items-center gap-2">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        
                        {/* ✨ SORTING FEEDBACK ICONS ── */}
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
                <TableRow
                  key={row.id}
                  className="transition-colors hover:bg-slate-50/80 border-b border-slate-100 cursor-pointer"
                  onClick={(e) => {
                    const item = row.original as any
                    const target = e.target as HTMLElement

                    if (target.closest('[data-actions-cell="true"]') || target.closest('button')) {
                      return
                    }

                    navigate(`/maintenance/${item.id}`)
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
                <TableCell colSpan={columns.length} className="h-24 text-center text-slate-400 text-sm">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── PAGINATION ── */}
      <div className="flex items-center justify-between px-2 py-1 bg-white rounded-lg border border-slate-200 p-2 shadow-sm">
        <div className="text-xs text-slate-500 font-medium">
          Page {currentPage + 1} of {pageCount} ({table.getFilteredRowModel().rows.length} total records)
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
              if (index === 0 || index === pageCount - 1 || (index >= currentPage - 1 && index <= currentPage + 1)) {
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

      {/* ── TOAST MESSAGE ── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg animate-fade-in">
          <FiCheckCircle className="text-emerald-400" size={16} />
          <span className="text-xs font-medium">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)}><FiX size={14} /></button>
        </div>
      )}

      {/* ── REMARK DIALOG ── */}
      <MaintenanceRemark
        open={dialogMode === "remark"}
        item={selectedItem}
        remarkText={remarkText}
        onChange={setRemarkText}
        onClose={closeDialog}
        onSubmit={submitRemark}
      />

      {/* ── EDIT DIALOG ── */}
      {dialogMode === "edit" && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Edit Maintenance Record</h2>
              <button onClick={closeDialog} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                <FiX size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1">
                  <label className="text-sm text-slate-900 font-semibold uppercase tracking-wide">Employee Name</label>
                  <input type="text" value={editEmployeeName} readOnly className={inputCls} />
                </div>
                <div className="grid gap-1">
                  <label className="text-sm text-slate-900 font-semibold uppercase tracking-wide">Asset Code</label>
                  <input type="text" value={editAssetCode} readOnly className={inputCls} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1">
                  <label className="text-sm text-slate-900 font-semibold uppercase tracking-wide">Category</label>
                  <input type="text" value={editCategory} readOnly className={inputCls} />
                </div>
                <div className="grid gap-1">
                  <label className="text-sm text-slate-900 font-semibold uppercase tracking-wide">Approver</label>
                  <input type="text" value={editApprover} readOnly className={inputCls} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1">
                  <label className="text-sm text-slate-900 font-semibold uppercase tracking-wide">Maintenance Date</label>
                  <input type="date" value={editMaintenanceDate} readOnly className={inputCls} />
                </div>
                <div className="grid gap-1">
                  <label className="text-sm text-slate-900 font-semibold uppercase tracking-wide">Completed Date</label>
                  <input type="date" value={editCompletedDate} onChange={(e) => setEditCompletedDate(e.target.value)} className={`${inputCls} !bg-white cursor-pointer`} />
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 p-4 sm:flex-row sm:justify-end -mx-6 -mb-6 mt-4">
                <Button variant="outline" onClick={closeDialog}>Cancel</Button>
                <Button onClick={submitEdit} className="bg-blue-500 hover:bg-blue-600 text-white">Save Changes</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {dialogMode === "view" && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Maintenance Details</h2>
              <button onClick={closeDialog} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                <FiX size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Employee Name", value: selectedItem.employee_name || "—" },
                  { label: "Asset Code", value: selectedItem.asset_code || "—" },
                  { label: "Category", value: selectedItem.category || "—" },
                  { label: "Approver", value: typeof selectedItem.approver === 'object' && selectedItem.approver !== null ? (selectedItem.approver as any).name : (selectedItem.approver || "—") }, 
                  { label: "Maintenance Date", value: selectedItem.maintenance_date || "—" },
                  { label: "Completed Date", value: selectedItem.completed_date || "—" },
                  { label: "Remark", value: selectedItem.remark || "No Remark" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-sm text-slate-900 font-semibold uppercase tracking-wide">{label}</p>
                    <p className="text-sm font-medium text-gray-500 mt-0.5">{value}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-end border-t border-slate-200 bg-slate-50 p-4 -mx-6 -mb-6 mt-4">
                <Button variant="outline" onClick={closeDialog}>Close</Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}