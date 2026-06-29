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
  getSortedRowModel,       
  type SortingState,       
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
  const [sorting, setSorting] = React.useState<SortingState>([]) 

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
  const [editVendor, setEditVendor] = React.useState("")
  const [editVendorPhno, setEditVendorPhno] = React.useState("")
  const [editVendorAddress, setEditVendorAddress] = React.useState("")
  const [editCost, setEditCost] = React.useState("")
  const [editPayment, setEditPayment] = React.useState("")
  const [editDuration, setEditDuration] = React.useState("")
  
  
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
    setEditVendor("")
    setEditVendorPhno("")
    setEditVendorAddress("")
    setEditCost("")
    setEditPayment("")
    setEditDuration("")
  }

  const openRemarkDialog = (item: Maintenance) => {
    setSelectedItem(item)
    setRemarkText(item.remark ?? "")
    setDialogMode("remark")
  }

  const openEditDialog = (item: Maintenance) => {
    setSelectedItem(item)
    setEditEmployeeName(item.user?.name ?? "")      
    setEditAssetCode(item.asset?.asset_code ?? "")     
    setEditCategory(item.category?.name ?? "")         
    setEditApprover(typeof item.accepted_by === 'object' && item.accepted_by !== null ? (item.accepted_by as any).name : (item.accepted_by ?? "—"))
    setEditMaintenanceDate(item.maintenance_date ?? "") 
    const today = new Date().toISOString().split('T')[0]
    setEditCompletedDate(item.completed_date ?? today) 
    setEditVendor(item.vendor ?? "")
    setEditVendorPhno(item.vendor_phno ?? "")
    setEditVendorAddress(item.vendor_address ?? "")
    setEditCost(item.cost?.toString() ?? "")
    setEditPayment(item.payment ?? "")
    setEditDuration(item.duration ?? "")

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

  
  const targetAssetId = selectedItem.asset?.id || (selectedItem as any).asset_id;

  if (!targetAssetId) {
    alert("Asset ID not found in the selected record.")
    return
  }

  try {
    
    await apiFetch(`/admin/maintenance/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        assets_id: targetAssetId, 
        status: "approved",
        remark: remarkText,
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

  
  // ── Submit EDIT (BACKEND INTEGRATION FIXED) ────────────────────────
  const submitEdit = async () => {
    if (!selectedItem) return
    
    const sanitizedCompletedDate = editCompletedDate.trim()
    if (!sanitizedCompletedDate) {
      alert("Please select a valid completed date.")
      return
    }

    try {
      // ⚠️ FIX 1: Backend Endpoint ပုံစံအရ URL Parameter အစား သီးသန့် Route သုံးရင် 
      // `/admin/maintenance/edit` သို့မဟုတ် Payload အလုပ်လုပ်မည့် နေရာကို သတ်မှတ်ပေးပါ
      // လက်ရှိ ပေးထားချက်အရ တိုက်ရိုက် API Join ရန် အောက်ပါအတိုင်း ပို့ပေးရပါမယ် -
      await apiFetch(`/maintenance/edit`, { // 👈 Endpoint လမ်းကြောင်း သေချာစစ်ဆေးပါ (e.g. `/maintenance/edit` သို့မဟုတ် `/maintenance`)
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          maintenance_id: selectedItem.id,            // Backend တောင်းထားသည့် UUID
          completed_date: sanitizedCompletedDate, 
          vendor: editVendor || null,
          vendor_phno: editVendorPhno || null,
          vendor_address: editVendorAddress || null,
          cost: editCost ? Number(editCost) : 0,     // 👈 FIX 2: String မှ Number Type သို့ ပြောင်းလဲခြင်း
          payment: editPayment || "unpaid",
          duration: editDuration || "0",
        }),
      })

      // Frontend State ကို Live Update လုပ်ပေးခြင်း
      setData((prev) =>
        prev.map((row: any) =>
          row.id === selectedItem.id
            ? { 
                ...row, 
                completed_date: sanitizedCompletedDate, 
                status: "Complete", // သို့မဟုတ် "Completed" (Backend တန်ဖိုးအတိုင်း စာလုံးကြီးသေး စစ်ပါ)
                vendor: editVendor,
                vendor_phno: editVendorPhno,
                vendor_address: editVendorAddress,
                cost: editCost ? Number(editCost) : 0,
                payment: editPayment,
                duration: editDuration,
              }
            : row
        )
      )

      setToastMessage("Marked as Complete Successfully!")
      closeDialog()
      onRefresh?.() 
    } catch (err: any) {
      console.error("Submit Edit Error:", err)
      alert(err?.message || "Failed to submit edit. Please check your network or inputs.")
    }
  }

 // ── Delete (Cancel) a row ───────────────────────────────────────────
const deleteRow = async (item: Maintenance, label: string) => {
  if (!confirm("Are you sure you want to delete this record?")) return

  try {
    const targetAssetId = item.asset?.id || (item as any).asset_id;

    if (!targetAssetId) {
      alert("Asset ID not found in this record.")
      return
    }

    const response = await apiFetch(`/admin/maintenance/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        assets_id: targetAssetId, 
        status: "canceled",
        issue_type: item.issue_type || "N/A",
        problem_description: (item as any).problem_description || "Canceled from UI",
        evidence_image: (item as any).evidence_image || "",
      }),
    })

    if (response) {

      setData((prev) => 
        prev.map((r) => 
          r.id === item.id ? { ...r, status: "canceled" } : r
        )
      )
      
      const clientName = (item as any).user?.name ?? "Asset" 
      setToastMessage(`${clientName} ${label}`)
    } else {
      throw new Error("Failed to cancel record on server.")
    }

  } catch (err: any) {
    console.error("Delete (Cancel) Error:", err)
    alert(err?.message || "Failed to cancel record.")
  }
}
  
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
              Cancelled: "bg-red-200 text-red-600 border border-red-300",
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

            if (status === "complete" || status === "completed" || status === "returned") {
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


            if (
              status === "complete" || 
              status === "completed" || 
              status === "returned" || 
              status === "cancelled" || 
              status === "canceled" || 
              status === "unknown" ||
              !status
            ) {
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

      
            return (
              <button
                title="View Details"
                className="text-slate-500 hover:text-slate-700 transition p-1"
                onClick={(e) => { e.stopPropagation(); openViewDialog(item) }}
              >
                <LuEye size={20} />
              </button>
            )
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
      sorting 
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
    <div className="max-w-6xl mx-auto space-y-4 p-3 bg-white rounded-xl border border-slate-200 shadow-sm  relative">
      
      {/* ── SEARCH BOX ── */}
      <div className=" flex gap-4 rounded-xl bg-white p-4 border border-slate-200 shadow-sm items-center">
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
          <TableHeader className="bg-blue-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-none">
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort() 
                  return (
                    <TableHead 
                      key={header.id} 
                      className={`text-white font-semibold py-3 text-sm ${canSort ? "cursor-pointer select-none hover:bg-blue-500/30" : ""}`}
                      onClick={header.column.getToggleSortingHandler()} 
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
{/* ── ဖြည့်စွက်ရမည့် Input Fields များ ── */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1">
                  <label className="text-sm text-slate-900 font-semibold uppercase tracking-wide">Vendor Name</label>
                  <input type="text" value={editVendor} onChange={(e) => setEditVendor(e.target.value)} className={`${inputCls} !bg-white`} />
                </div>
                <div className="grid gap-1">
                  <label className="text-sm text-slate-900 font-semibold uppercase tracking-wide">Vendor Phone</label>
                  <input type="text" value={editVendorPhno} onChange={(e) => setEditVendorPhno(e.target.value)} className={`${inputCls} !bg-white`} />
                </div>
              </div>

              <div className="grid gap-1">
                <label className="text-sm text-slate-900 font-semibold uppercase tracking-wide">Vendor Address</label>
                <input type="text" value={editVendorAddress} onChange={(e) => setEditVendorAddress(e.target.value)} className={`${inputCls} !bg-white`} />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="grid gap-1">
                  <label className="text-sm text-slate-900 font-semibold uppercase tracking-wide">Cost</label>
                  <input type="number" value={editCost} onChange={(e) => setEditCost(e.target.value)} className={`${inputCls} !bg-white`} />
                </div>
                <div className="grid gap-1">
                  <label className="text-sm text-slate-900 font-semibold uppercase tracking-wide">Payment Method</label>
                  <input type="text" value={editPayment} onChange={(e) => setEditPayment(e.target.value)} className={`${inputCls} !bg-white`} />
                </div>
                <div className="grid gap-1">
                  <label className="text-sm text-slate-900 font-semibold uppercase tracking-wide">Duration</label>
                  <input type="text" value={editDuration} onChange={(e) => setEditDuration(e.target.value)} className={`${inputCls} !bg-white`} />
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
                { label: "Employee Name", value: selectedItem?.user?.name || "—" },
                { label: "Asset Code", value: selectedItem?.asset?.asset_code || "—" },
                { label: "Category", value: selectedItem?.category?.name || "—" },
                { 
                  label: "Approver", 
                  value: typeof selectedItem?.accepted_by === 'object' && selectedItem?.accepted_by !== null 
                   ? (selectedItem.accepted_by as any).name 
                    : (selectedItem?.accepted_by || "—") 
                }, 
                { label: "Maintenance Date", value: selectedItem?.maintenance_date || "—" },
                { label: "Completed Date", value: selectedItem?.completed_date || "—" },
                { label: "Remark", value: selectedItem?.remark || "No Remark" },
                ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-sm text-slate-900 font-semibold uppercase tracking-wide">{label}</p>
                  <p className="text-sm font-medium text-gray-500 mt-0.5">{value}</p>
                </div>
            ))}
          </div>
      </div>

                  <div className="flex justify-end border-t border-slate-200 bg-slate-50 p-4 -mx-6 -mb-6 mt-4">
                  <Button variant="outline" onClick={closeDialog}>Close</Button>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}