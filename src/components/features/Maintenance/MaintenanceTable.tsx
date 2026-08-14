"use client"

import * as React from "react"
import { useNavigate } from "react-router-dom"
import { FiChevronLeft, FiChevronRight, FiCheckCircle, FiCheck, FiChevronUp, FiChevronDown, FiX } from "react-icons/fi" 
import { MdOutlineModeEditOutline } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { LuEye } from "react-icons/lu"

import { MaintenanceSearch } from "./MaintenanceSearchBox";

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
import { hasStoredPermission } from "@/lib/utils"

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"

const getCategoryName = (item: any) => {
  const category = item?.category
  if (typeof category === "string" && category !== "-") return category

  return (
    category?.name ||
    item?.category_obj?.name ||
    item?.asset?.category?.name ||
    item?.category_name ||
    "-"
  )
}

const getMaintenanceAssetCode = (item: any) => {
  return (
    item?.asset?.asset_code ||
    (item?.asset_code && item.asset_code !== "-" ? item.asset_code : "") ||
    item?.assetCode ||
    item?.asset?.code ||
    item?.asset?.asset_id ||
    item?.assets_id ||
    "Maintenance request"
  )
}

const getMaintenanceAssetId = (item: any) => {
  return item?.asset?.id || item?.asset_id || item?.assets_id || null
}

const getEmployeeName = (item: any) => {
  return item?.user?.name || item?.employee_name || ""
}

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
  const [deleteTarget, setDeleteTarget] = React.useState<{ item: Maintenance; label: string } | null>(null)
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
  const canViewMaintenances = hasStoredPermission("view-maintenances")
  const canUpdateMaintenances = hasStoredPermission("update-maintenances")
  const canDeleteMaintenances = hasStoredPermission("delete-maintenances")
  const canApproveMaintenanceRequests = hasStoredPermission("approve-maintenance-requests")
  const canCancelMaintenanceRequests = hasStoredPermission("cancel-maintenance-requests")
  
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

  const openDeleteCard = (item: Maintenance, label: string) => {
    setDeleteTarget({ item, label })
    setToastMessage(null)
  }

  const closeDeleteCard = () => {
    setDeleteTarget(null)
  }

  const openEditDialog = (item: Maintenance) => {
    setSelectedItem(item)
    setEditEmployeeName(getEmployeeName(item))      
    setEditAssetCode(getMaintenanceAssetCode(item) === "Maintenance request" ? "" : getMaintenanceAssetCode(item))     
    
    setEditCategory(getCategoryName(item));
    
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

  void openEditDialog

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

  const handleVendorNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditVendor(e.target.value.replace(/[0-9]/g, ""))
  }

  const handleVendorPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditVendorPhno(e.target.value.replace(/\D/g, "").slice(0, 13))
  }

  const submitRemark = async () => {
    if (!selectedItem) return
    const item = selectedItem
    const targetAssetId = getMaintenanceAssetId(item);
    if (!targetAssetId) return

    closeDialog()

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
          row.id === item.id
            ? { ...row, status: "Approved", remark: remarkText }
            : row
        )
      )

      setToastMessage("Approved successfully")
      onRefresh?.()  
    } catch (error) {
      console.error(error)
      setToastMessage("Approval was sent, but the page did not receive a success response.")
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

  const deleteRow = async () => {
    if (!deleteTarget) return

    const { item, label } = deleteTarget
    const targetAssetId = getMaintenanceAssetId(item);
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
      setDeleteTarget(null)
    } catch (err) {
      console.error(err)
      setToastMessage("Failed to cancel maintenance request.")
    }
  }
  
  
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (canApproveMaintenanceRequests) openRemarkDialog(item);
                    }}
                    disabled={!canApproveMaintenanceRequests}
                    className="text-green-500 hover:text-green-700 p-1 disabled:cursor-not-allowed disabled:opacity-40"
                    title={canApproveMaintenanceRequests ? "Approve maintenance request" : "You do not have permission to approve maintenance requests"}
                  >
                    <FiCheck size={20} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (canCancelMaintenanceRequests) openDeleteCard(item, "request cancelled.");
                    }}
                    disabled={!canCancelMaintenanceRequests}
                    className="text-red-500 hover:text-red-700 p-1 disabled:cursor-not-allowed disabled:opacity-40"
                    title={canCancelMaintenanceRequests ? "Cancel maintenance request" : "You do not have permission to cancel maintenance requests"}
                  >
                    <RiDeleteBinLine size={20} />
                  </button>
                </div>
              )
            }

            if (status === "approved" || status === "in progress") {
              return (
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (canUpdateMaintenances) navigate(`/maintenance/${item.id}/complete`, { state: { maintenance: item } });
                    }}
                    disabled={!canUpdateMaintenances}
                    className="text-[#7C3AED] hover:text-purple-700 p-1 disabled:cursor-not-allowed disabled:opacity-40"
                    title={canUpdateMaintenances ? "Edit maintenance" : "You do not have permission to update maintenances"}
                  >
                    <MdOutlineModeEditOutline size={21} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (canDeleteMaintenances) openDeleteCard(item, "record deleted.");
                    }}
                    disabled={!canDeleteMaintenances}
                    className="text-red-600 hover:text-red-700 p-1 disabled:cursor-not-allowed disabled:opacity-40"
                    title={canDeleteMaintenances ? "Delete maintenance" : "You do not have permission to delete maintenances"}
                  >
                    <RiDeleteBinLine size={21} />
                  </button>
                </div>
              )
            }

            return (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (canViewMaintenances) navigate(`/maintenance/${item.id}`, { state: { maintenance: item } });
                }}
                disabled={!canViewMaintenances}
                className="text-[#7C3AED] hover:text-purple-700 p-1 disabled:cursor-not-allowed disabled:opacity-40"
                title={canViewMaintenances ? "View maintenance" : "You do not have permission to view maintenances"}
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
  }, [
    canApproveMaintenanceRequests,
    canCancelMaintenanceRequests,
    canDeleteMaintenances,
    canUpdateMaintenances,
    canViewMaintenances,
    navigate,
  ])

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
    globalFilterFn: (row, _columnId, filterValue) => {
      const search = filterValue.toLowerCase()
      const item = row.original as any
      
      const employeeName = getEmployeeName(item).toLowerCase()
      const assetCode = getMaintenanceAssetCode(item).toLowerCase()
      const status = item.status?.toLowerCase() || ""
      const vendor = item.vendor?.toLowerCase() || ""
      const category = getCategoryName(item).toLowerCase()
      
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

  const pageCount = table.getPageCount()
  const currentPage = table.getState().pagination.pageIndex

  return (
    <div className="max-w-6xl mx-auto space-y-4 p-3 bg-white rounded-xl border border-slate-200 shadow-sm relative">
      
     <div className="relative flex-1">
      <MaintenanceSearch 
        value={globalFilter ?? ""} 
        onChange={setGlobalFilter} 
      />
    </div>
    
           
    
   

      {/* ── TABLE VIEW ── */}
      <div className="rounded-md border border-slate-200 overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-[#A78BFA]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-none">
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort() 
                  return (
                    <TableHead 
                      key={header.id} 
                      className={`text-white font-semibold py-3 text-sm ${canSort ? "cursor-pointer select-none " : ""}`}
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
                  className={`transition-colors hover:bg-slate-50/80 border-b border-slate-100 ${canViewMaintenances ? "cursor-pointer" : "cursor-not-allowed opacity-75"}`}
                  onClick={(e) => {
                    const item = row.original as any
                    const target = e.target as HTMLElement
                    if (target.closest('[data-actions-cell="true"]') || target.closest('button')) return
                    if (canViewMaintenances) navigate(`/maintenance/${item.id}`, { state: { maintenance: item } })
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
      <div className="flex items-center justify-between px-2 py-1 bg-white rounded-lg border border-slate-200 p-2 shadow-sm">
        {/* Left Status Text */}
        <div className="text-xs text-slate-500 font-medium">
          Page {currentPage + 1} of {pageCount} ({table.getFilteredRowModel().rows.length} total maintenance)
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-2">
          {/* Previous Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <FiChevronLeft size={16} />
          </Button>

          {/* Page Numbers */}
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
                    className={currentPage === index ? "bg-[#A78BFA] text-white border-none" : "bg-slate-200"}
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

          {/* Next Button */}
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
        <div className="fixed right-6 top-6 z-50 flex max-w-sm items-center gap-3 rounded-xl border border-[#C4B5FD] bg-[#7C3AED] px-4 py-3 text-white shadow-xl shadow-purple-500/20">
          <FiCheckCircle size={16} />
          <span className="text-sm font-semibold">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-auto rounded-md p-1 text-white/80 transition hover:bg-white/15 hover:text-white"
            aria-label="Close notification"
          >
            <FiX size={14} />
          </button>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-50 text-red-600">
                <RiDeleteBinLine size={22} />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-slate-900">Cancel Maintenance Request</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Are you sure you want to cancel this maintenance request?
                </p>
                <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
                  {getMaintenanceAssetCode(deleteTarget.item)}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeDeleteCard}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={deleteRow}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                <RiDeleteBinLine size={16} />
                Confirm
              </button>
            </div>
          </div>
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
              <h2 className="text-lg font-semibold text-[#7C3AED]">Edit Maintenance & Mark Complete</h2>
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
                  <input type="text" value={editVendor} onChange={handleVendorNameChange} className={`${inputCls} !bg-white`} />
                </div>
                <div className="grid gap-1">
                  <label className="text-sm text-slate-900 font-semibold uppercase tracking-wide">Vendor Phone</label>
                  <input
                    type="tel"
                    value={editVendorPhno}
                    onChange={handleVendorPhoneChange}
                    inputMode="numeric"
                    maxLength={13}
                    className={`${inputCls} !bg-white`}
                  />
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
                <Button onClick={submitEdit} className="bg-[#7C3AED] hover:bg-purple-700 text-white">Save & Complete</Button>
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
                  { label: "Category", value: getCategoryName(selectedItem) },
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
