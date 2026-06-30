"use client"

import * as React from "react"
import { useNavigate } from "react-router-dom"
import { FiChevronLeft, FiChevronRight, FiCheckCircle, FiCheck, FiChevronUp, FiChevronDown, FiX } from "react-icons/fi" 
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
  const [editVoucher, setEditVoucher] = React.useState("") 
  
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
    setEditVoucher("")
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
    
    const catName = 
      (item as any).category?.name || 
      (item as any).asset?.category?.name || 
      (item as any).category_name || 
      "";
    setEditCategory(catName);
    
    setEditApprover(typeof item.accepted_by === 'object' && item.accepted_by !== null ? (item.accepted_by as any).name : (item.accepted_by ?? "—"))
    setEditMaintenanceDate(item.maintenance_date ?? "") 
    const today = new Date().toISOString().split('T')[0]
    setEditCompletedDate(item.completed_date ?? today) 
    setEditVendor(item.vendor ?? "")
    setEditVendorPhno(item.vendor_phno ?? "")
    setEditVendorAddress(item.vendor_address ?? "")
    setEditCost(item.cost?.toString() ?? "")
    setEditPayment(item.payment ?? "paid")
    setEditDuration(item.duration ?? "")
    setEditVoucher((item as any).voucher ?? "")

    setDialogMode("edit")
  }

  const openViewDialog = (item: Maintenance) => {
    setSelectedItem(item)
    setDialogMode("view")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        const cleanBase64 = base64String.split(",")[1] || base64String
        setEditVoucher(cleanBase64)
      }
      reader.readAsDataURL(file)
    }
  }

  const submitRemark = async () => {
    if (!selectedItem) return
    const targetAssetId = selectedItem.asset?.id || (selectedItem as any).asset_id;
    if (!targetAssetId) return

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
    } catch (error) {
      console.error(error)
    }
  }

  const submitEdit = async () => {
    if (!selectedItem) return
    const sanitizedCompletedDate = editCompletedDate.trim()
    if (!sanitizedCompletedDate) return

    try {
      await apiFetch(`/maintenance/edit`, { 
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          maintenance_id: selectedItem.id,            
          completed_date: sanitizedCompletedDate, 
          vendor: editVendor || null,
          vendor_phno: editVendorPhno || null,
          vendor_address: editVendorAddress || null,
          cost: editCost ? Number(editCost) : 0,     
          payment: editPayment || "paid",
          duration: editDuration ? Number(editDuration) : 0, 
          voucher: editVoucher || null 
        }),
      })

      setData((prev) =>
        prev.map((row: any) =>
          row.id === selectedItem.id
            ? { 
                ...row, 
                completed_date: sanitizedCompletedDate, 
                status: "Complete", 
                vendor: editVendor,
                vendor_phno: editVendorPhno,
                vendor_address: editVendorAddress,
                cost: editCost ? Number(editCost) : 0,
                payment: editPayment,
                duration: editDuration ? Number(editDuration) : 0,
                voucher: editVoucher
              }
            : row
        )
      )

      setToastMessage("Marked as Complete Successfully!")
      closeDialog()
      onRefresh?.() 
    } catch (err) {
      console.error(err)
    }
  }

  const deleteRow = async (item: Maintenance, label: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return
    const targetAssetId = item.asset?.id || (item as any).asset_id;
    if (!targetAssetId) return

    try {
      await apiFetch(`/admin/maintenance/status`, {
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

      setData((prev) => prev.map((r) => r.id === item.id ? { ...r, status: "canceled" } : r))
      setToastMessage(`${(item as any).user?.name ?? "Asset"} ${label}`)
    } catch (err) {
      console.error(err)
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
              canceled: "bg-red-200 text-red-600 border border-red-300",
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
                  <button onClick={(e) => { e.stopPropagation(); openRemarkDialog(item) }} className="text-green-500 hover:text-green-700 p-1">
                    <FiCheck size={20} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); deleteRow(item, "request cancelled.") }} className="text-red-500 hover:text-red-700 p-1">
                    <RiDeleteBin4Fill size={20} />
                  </button>
                </div>
              )
            }

            if (status === "approved" || status === "in progress") {
              return (
                <div className="flex items-center gap-3">
                  <button onClick={(e) => { e.stopPropagation(); openEditDialog(item) }} className="text-blue-500 hover:text-blue-700 p-1">
                    <FaEdit size={20} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); deleteRow(item, "record deleted.") }} className="text-red-500 hover:text-red-700 p-1">
                    <RiDeleteBin4Fill size={20} />
                  </button>
                </div>
              )
            }

            return (
              <button onClick={(e) => { e.stopPropagation(); openViewDialog(item) }} className="text-slate-500 hover:text-slate-700 p-1">
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

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, columnFilters, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,          
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),  
    globalFilterFn: (row, columnId, filterValue) => {
      const search = filterValue.toLowerCase()
      const item = row.original as any
      
      const employeeName = item.user?.name?.toLowerCase() || ""
      const assetCode = item.asset?.asset_code?.toLowerCase() || ""
      const status = item.status?.toLowerCase() || ""
      const vendor = item.vendor?.toLowerCase() || ""
      const category = item.category?.name?.toLowerCase() || item.asset?.category?.name?.toLowerCase() || ""
      
      return (
        employeeName.includes(search) ||
        assetCode.includes(search) ||
        status.includes(search) ||
        vendor.includes(search) ||
        category.includes(search)
      )
    },
    initialState: { pagination: { pageSize: 5 } },
  })

  return (
    <div className="max-w-6xl mx-auto space-y-4 p-3 bg-white rounded-xl border border-slate-200 shadow-sm relative">
      
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
                        {canSort && (
                          <div className="flex flex-col">
                            <FiChevronUp size={12} className={header.column.getIsSorted() === "asc" ? "text-white" : "text-white/40"} />
                            <FiChevronDown size={12} className={header.column.getIsSorted() === "desc" ? "text-white" : "text-white/40"} />
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
                    if (target.closest('[data-actions-cell="true"]') || target.closest('button')) return
                    navigate(`/maintenance/${item.id}`)
                  }}
                >
                  {row.getVisibleCells().map((cell) => {
                    const isActions = cell.column.id === "actions"
                    return (
                      <TableCell key={cell.id} className="py-3 text-slate-700 text-sm" {...(isActions ? { "data-actions-cell": "true" } : {})}>
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
      <div className="flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm">
        {/* Left Status Text */}
        <div className="text-sm text-slate-500 font-medium">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()} ({table.getFilteredRowModel().rows.length} total maintenance)
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1">
          {/* Previous Button */}
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <FiChevronLeft size={16} />
          </button>

          {/* Page Numbers */}
          {(() => {
            const currentPage = table.getState().pagination.pageIndex + 1
            const pageCount = table.getPageCount()
            const pages: (number | string)[] = []

            
            const siblingCount = 1 

            
            pages.push(1)

      
            if (currentPage > siblingCount + 3) {
              pages.push("...")
            } else if (pageCount > 2) {
              
              for (let i = 2; i < Math.min(currentPage - siblingCount, pageCount); i++) {
                if (!pages.includes(i)) pages.push(i)
              }
            }

           
            const startRange = Math.max(2, currentPage - siblingCount)
            const endRange = Math.min(pageCount - 1, currentPage + siblingCount)

            for (let i = startRange; i <= endRange; i++) {
              if (!pages.includes(i)) pages.push(i)
            }

            
            if (currentPage < pageCount - siblingCount - 2) {
              pages.push("...")
            } else if (pageCount > 1) {
              
              for (let i = Math.max(currentPage + siblingCount + 1, 2); i < pageCount; i++) {
                if (!pages.includes(i)) pages.push(i)
              }
            }

            
            if (pageCount > 1 && !pages.includes(pageCount)) {
              pages.push(pageCount)
            }

            return pages.map((page, index) => {
              if (page === "...") {
                return (
                  <span key={`ellipsis-${index}`} className="px-2 text-slate-400 text-sm tracking-widest">
                    ...
                  </span>
                )
              }

              const isPageActive = currentPage === page

              return (
                <button
                  key={`page-${page}`}
                  onClick={() => table.setPageIndex((page as number) - 1)}
                  className={`w-8 h-8 text-sm font-semibold rounded-lg border transition-all flex items-center justify-center ${
                    isPageActive
                      ? "bg-[#0a46b4] border-[#0a46b4] text-white shadow-sm"
                      : "bg-[#e9edf5] border-transparent text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {page}
                </button>
              )
            })
          })()}

          {/* Next Button */}
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <FiChevronRight size={16} />
          </button>
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

      {/* ── EDIT / COMPLETE DIALOG ── */}
      {dialogMode === "edit" && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Edit Maintenance & Mark Complete</h2>
              <button onClick={closeDialog} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                <FiX size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
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

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1">
                  <label className="text-sm text-slate-900 font-semibold uppercase tracking-wide">Vendor Address</label>
                  <input type="text" value={editVendorAddress} onChange={(e) => setEditVendorAddress(e.target.value)} className={`${inputCls} !bg-white`} />
                </div>
                <div className="grid gap-1">
                  <label className="text-sm text-slate-900 font-semibold uppercase tracking-wide">Duration (Days)</label>
                  <input 
                    type="number" 
                    value={editDuration} 
                    onChange={(e) => setEditDuration(e.target.value)} 
                    className={`${inputCls} !bg-white`} 
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1">
                  <label className="text-sm text-slate-900 font-semibold uppercase tracking-wide">Cost (MMK)</label>
                  <input type="number" value={editCost} onChange={(e) => setEditCost(e.target.value)} className={`${inputCls} !bg-white`} />
                </div>
                <div className="grid gap-1">
                  <label className="text-sm text-slate-900 font-semibold uppercase tracking-wide">Payment Status</label>
                  <select value={editPayment} onChange={(e) => setEditPayment(e.target.value)} className={`${inputCls} !bg-white cursor-pointer`}>
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-1 sm:col-span-2 border-t border-slate-100 pt-3">
                <label className="text-sm text-slate-900 font-semibold uppercase tracking-wide">Voucher Receipt (Image)</label>
                <input type="file" accept="image/*" onChange={handleFileChange} className={`${inputCls} !bg-white pt-1.5`} />
                
                {editVoucher && (
                  <div className="mt-3 border border-slate-200 rounded-xl p-3 bg-slate-50 flex flex-col items-center justify-center w-full">
                    <p className="text-xs text-emerald-600 font-medium mb-1.5 self-start">✓ Preview:</p>
                    <img 
                      src={`data:image/jpeg;base64,${editVoucher}`} 
                      alt="Voucher Preview" 
                      className="max-h-44 w-auto object-contain rounded-lg shadow-sm border border-slate-200"
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 p-4 sm:flex-row sm:justify-end -mx-6 -mb-6 mt-4">
                <Button variant="outline" onClick={closeDialog}>Cancel</Button>
                <Button onClick={submitEdit} className="bg-blue-500 hover:bg-blue-600 text-white">Save & Complete</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── VIEW DETAILS DIALOG ── */}
      {dialogMode === "view" && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Maintenance Details</h2>
              <button onClick={closeDialog} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                <FiX size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: "Employee Name", value: selectedItem?.user?.name || "—" },
                  { label: "Asset Code", value: selectedItem?.asset?.asset_code || "—" },
                  { label: "Category", value: (selectedItem as any).category?.name || "—" },
                  { 
                    label: "Approver", 
                    value: typeof selectedItem?.accepted_by === 'object' && selectedItem?.accepted_by !== null 
                      ? (selectedItem.accepted_by as any).name 
                      : (selectedItem?.accepted_by || "—") 
                  }, 
                  { label: "Maintenance Date", value: selectedItem?.maintenance_date || "—" },
                  { label: "Completed Date", value: selectedItem?.completed_date || "—" },
                  { label: "Vendor", value: selectedItem?.vendor || "—" },
                  { label: "Vendor Phone", value: selectedItem?.vendor_phno || "—" },
                  { label: "Vendor Address", value: selectedItem?.vendor_address || "—" },
                  { label: "Cost", value: selectedItem?.cost ? `${selectedItem.cost.toLocaleString()} MMK` : "—" },
                  { label: "Payment Status", value: selectedItem?.payment || "—" },
                  { label: "Duration", value: selectedItem?.duration ? `${selectedItem.duration} Days` : "—" },
                  { label: "Remark", value: selectedItem?.remark || "No Remark" },
                ].map(({ label, value }) => (
                  <div key={label} className="border-b border-slate-100 pb-2">
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">{label}</p>
                    <p className="text-sm font-medium text-slate-800 mt-0.5">{value}</p>
                  </div>
                ))}
              </div>

              {(selectedItem as any).voucher && (
                <div className="mt-4 border-t border-slate-100 pt-3">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-2">Voucher Attachment</p>
                  <img 
                    src={`data:image/jpeg;base64,${(selectedItem as any).voucher}`} 
                    alt="Voucher Receipt" 
                    className="max-w-md h-auto rounded-lg border border-slate-200 shadow-sm"
                  />
                </div>
              )}

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