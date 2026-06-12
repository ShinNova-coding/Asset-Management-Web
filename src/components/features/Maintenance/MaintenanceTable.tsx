"use client"

import * as React from "react"
import {
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
  FiCheck,
  FiX,
  FiArrowRight,
} from "react-icons/fi"
import { FaEdit } from "react-icons/fa"
import { RiDeleteBin4Fill } from "react-icons/ri"
import { LuEye } from "react-icons/lu"
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
import type { Maintenance } from "@/data/maintenance"
import { columns as baseColumns } from "./MaintenanceColumns"
import { MaintenanceSearch } from "./MaintenanceSearchBox"
import { MaintenanceRemark } from "./MaintenanceRemark"
import { useNavigate } from "react-router-dom"

// ── Shared input style (consistent with Remark modal) ───────────────────────
const inputCls =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"


export function MaintenanceTable() {
  const [data, setData] = React.useState<Maintenance[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
  const fetchMaintenance = async () => {
    try {
      const token = localStorage.getItem("token")

      const response = await fetch(
        "http://192.168.100.186:1010/api/maintenance",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const result = await response.json()

      result.data.forEach((item: any) => {
  console.log("ROW STATUS:", item.status)
})

      // ✅ IMPORTANT FIX HERE
      const formatted = result.data.map((item: any) => ({
        "employee name": item.user?.name ?? "-",
        "asset Name": item.asset?.name ?? "-",
        "asset ID": item.assets_id ?? "-",
        category: item.category?.name ?? "-",
        maintenanceDate: item.maintenance_date ?? "-",
        returnedDate: item.completed_date ?? "-",
        status: (item.status ?? "").trim().toLowerCase(),
        remark: item.remark ?? "",
      }))

      setData(formatted)
    } catch (error) {
      console.error("Failed to fetch maintenance data:", error)
    } finally {
      setLoading(false)
    }
  }

  fetchMaintenance()
}, [])

  const [globalFilter, setGlobalFilter] = React.useState("")
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [toastMessage, setToastMessage] = React.useState<string | null>(null)
  const [selectedItem, setSelectedItem] = React.useState<Maintenance | null>(null)

  // "remark" = new request flow | "edit" = edit approved record | "view" = view complete record
  const [dialogMode, setDialogMode] = React.useState<"remark" | "edit" | "view" | null>(null)

  // Remark (new request) state
  const [remarkText, setRemarkText] = React.useState("")

  // Edit (approved → complete) state — all 5 fields
  const [editEmployeeName, setEditEmployeeName] = React.useState("")
  const [editAssetName, setEditAssetName] = React.useState("")
  const [editAssetID, setEditAssetID] = React.useState("")
  const [editCategory, setEditCategory] = React.useState("")
  const [editMaintenanceDate, setEditMaintenanceDate] = React.useState("")
  const [editReturnedDate, setEditReturnedDate] = React.useState("")

  const navigate = useNavigate()

  // ── Close any dialog ────────────────────────────────────────────────────────
  const closeDialog = () => {
    setDialogMode(null)
    setSelectedItem(null)
    setRemarkText("")
    setEditEmployeeName("")
    setEditAssetName("")
    setEditAssetID("")
    setEditCategory("")
    setEditMaintenanceDate("")
    setEditReturnedDate("")
  }

  // ── Open REMARK dialog (Request row) ────────────────────────────────────────
  const openRemarkDialog = (item: Maintenance) => {
    setSelectedItem(item)
    setRemarkText(item.remark ?? "")
    setDialogMode("remark")
  }

  // ── Open EDIT dialog (Approved row) ─────────────────────────────────────────
  const openEditDialog = (item: Maintenance) => {
    setSelectedItem(item)
    setEditEmployeeName(item["employee name"] ?? "")
    setEditAssetName(item["asset Name"] ?? "")
    setEditAssetID(item["asset ID"] ?? "")
    setEditCategory(item.category ?? "")
    setEditMaintenanceDate(item.maintenanceDate ?? "")
    setEditReturnedDate(item.returnedDate ?? "")
    setDialogMode("edit")
  }

  // ── Open VIEW dialog (Complete row) ─────────────────────────────────────────
  const openViewDialog = (item: Maintenance) => {
    setSelectedItem(item)
    setDialogMode("view")
  }

  // ── Submit REMARK → status goes to "Approved" ────────────────────────────────
 const submitRemark = () => {
  if (!selectedItem) return

  setData((prev) =>
    prev.map((row) =>
      row["asset ID"] === selectedItem["asset ID"]
        ? {
            ...row,
            status: "approved", // IMPORTANT lowercase consistency
            remark: remarkText || "No remark provided",
          }
        : row
    )
  )

  setToastMessage(`${selectedItem["employee name"]} approved successfully.`)
  closeDialog()
}
  // ── Submit EDIT → saves all fields and status goes to "Complete" ─────────────
  const submitEdit = () => {
    if (!selectedItem) return
    setData((prev) =>
      prev.map((row) =>
        row["asset ID"] === selectedItem["asset ID"]
          ? {
              ...row,
              "employee name": editEmployeeName || row["employee name"],
              "asset Name": editAssetName || row["asset Name"],
              "asset ID": editAssetID || row["asset ID"],
              category: editCategory || row.category,
              maintenanceDate: editMaintenanceDate || row.maintenanceDate,
              returnedDate: editReturnedDate || row.returnedDate,
              stage: "completed",
              status: "Complete",
            }
          : row
      )
    )
    setToastMessage(`${editEmployeeName || selectedItem["employee name"]} marked as Complete.`)
    closeDialog()
  }

  // ── Delete a row ─────────────────────────────────────────────────────────────
  const deleteRow = (item: Maintenance, label: string) => {
    setData((prev) => prev.filter((r) => r["asset ID"] !== item["asset ID"]))
    setToastMessage(`${item["employee name"]} ${label}`)
  }

  React.useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toastMessage])

  // ── Column overrides ─────────────────────────────────────────────────────────
  const columns = React.useMemo(() => {
    return baseColumns.map((col) => {

      // Status badge
      if ((col as any).accessorKey === "status" || (col as any).id === "status") {
        return {
          ...col,
          header: "Status",
          cell: ({ row }: { row: any }) => {
            const status = row.getValue("status") as string
            const statusStyles: Record<string, string> = {
  requested: "bg-red-100 text-red-700 border border-red-200",
  pending: "bg-gray-200 text-gray-700 border border-gray-200",
  approved: "bg-green-100 text-green-700 border border-green-200",
  "in progress": "bg-amber-100 text-amber-700 border border-amber-200",
  returned: "bg-blue-100 text-blue-700 border border-blue-200",
  canceled: "bg-gray-200 text-gray-600 border border-gray-300",
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

      // Actions column
      if ((col as any).id === "actions") {
        return {
          ...col,
          cell: ({ row }: { row: any }) => {
            const item = row.original as Maintenance

            // ── REQUEST: → + 🗑 ──────────────────────────────────────────────
            if (item.status === "requested") {
              return (
                 <div className="flex items-center gap-3">
      <button
        title="Approve Request"
        className="text-green-500 hover:text-green-700 transition p-1"
        onClick={(e) => {
          e.stopPropagation()
          openRemarkDialog(item)
        }}
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

            // ── APPROVED: ✏️ + 🗑 ────────────────────────────────────────────
            if (item.status === "approved") {
              return (
                <div className="flex items-center gap-3">
                  <button
                    title="Edit"
                    className="text-blue-300 hover:text-blue-700 transition p-1"
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

            // ── COMPLETE: 👁 View only ────────────────────────────────────────
            if (item.status === "returned") {
              return (
                <button
                  title="View Details"
                  className="text-slate-400 hover:text-slate-700 transition p-1"
                  onClick={(e) => { e.stopPropagation(); openViewDialog(item) }}
                >
                  <LuEye size={20} />
                </button>
              )
            }

            return null
          },
        }
      }

      return col
    })
  }, [baseColumns])

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, columnFilters },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  })

if (loading) {
  return (
    <div className="p-6 text-center">
      Loading maintenance data...
    </div>
  )
}

  const pageCount = table.getPageCount()
  const currentPage = table.getState().pagination.pageIndex

  return (
    <div className="w-full space-y-4 p-4 relative">

      <div className="flex w-full items-center justify-between gap-4">
        <MaintenanceSearch value={globalFilter} onChange={setGlobalFilter} />
      </div>

      <div className="rounded-md border-slate-400 overflow-hidden">
        <Table>
          <TableHeader className="bg-blue-400">
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
                  className="transition-colors hover:bg-gray-100 border-slate-300 cursor-pointer"
                  onClick={() => {
                    const item = row.original as any
                    navigate(`/maintenance/${encodeURIComponent(item["asset ID"])}`)
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

      {/* Pagination */}
      <div className="flex justify-end items-center space-x-2 py-4">
        <Button variant="outline" size="sm" className="flex items-center gap-1 disabled:opacity-50" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          <FiChevronLeft size={16} />
        </Button>
        <div className="flex gap-1 items-center">
          {Array.from({ length: pageCount }).map((_, index) => {
            if (index === 0 || index === pageCount - 1 || (index >= currentPage - 1 && index <= currentPage + 1)) {
              return (
                <Button key={index} variant={currentPage === index ? "default" : "outline"} size="sm"
                  className={`disabled:opacity-50 ${currentPage === index ? "bg-blue-300 hover:bg-blue-400 text-white border-none" : "bg-slate-200"}`}
                  onClick={() => table.setPageIndex(index)}>
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
        <Button variant="outline" size="sm" className="flex items-center gap-1 disabled:opacity-50" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          <FiChevronRight size={16} />
        </Button>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-800 transition-all duration-300 max-w-md">
          <FiCheckCircle className="text-green-400 shrink-0" size={20} />
          <div className="flex-1">
            <p className="text-sm font-semibold">Action Updated</p>
            <p className="text-xs text-slate-400">{toastMessage}</p>
          </div>
          <button type="button" onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white transition-colors p-1">
            <FiX size={16} />
          </button>
        </div>
      )}

      {/* ── REMARK DIALOG (Request → Approved) ─────────────────────────────── */}
      <MaintenanceRemark
        open={dialogMode === "remark"}
        item={selectedItem}
        remarkText={remarkText}
        onChange={setRemarkText}
        onClose={closeDialog}
        onSubmit={submitRemark}
      />

      {/* ── EDIT DIALOG (Approved → Complete) ──────────────────────────────── */}
      {dialogMode === "edit" && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">

            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Edit Maintenance Record</h2>
              <button onClick={closeDialog} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                <FiX size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Row 1: Employee Name + Asset ID */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1">
                  <label className="text-sm text-slate-900 font-semibold uppercase tracking-wide">Employee Name</label>
                  <input type="text" value={editEmployeeName} onChange={(e) => setEditEmployeeName(e.target.value)} className={inputCls} placeholder="Employee name" />
                </div>
                <div className="grid gap-1">
                  <label className="text-sm text-slate-900 font-semibold uppercase tracking-wide">Asset Name</label>
                  <input type="text" value={editAssetName} onChange={(e) => setEditAssetName(e.target.value)} className={inputCls} placeholder="Asset Name" />
                </div>
              </div>
              <div className="grid gap-1">
                <label className="text-sm text-slate-900 font-semibold uppercase tracking-wide">Asset ID</label>
                <input type="text" value={editAssetID} onChange={(e) => setEditAssetID(e.target.value)} className={inputCls} placeholder="Asset ID" />
              </div>

              {/* Row 2: Category (full width) */}
              <div className="grid gap-1">
                <label className="text-sm text-slate-900 font-semibold uppercase tracking-wide">Category</label>
                <input type="text" value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className={inputCls} placeholder="Category" />
              </div>

              {/* Row 3: Assigned Date + Returned Date */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1">
                  <label className="text-sm text-slate-900 font-semibold uppercase tracking-wide">Maintenance Date</label>
                  <input type="date" value={editMaintenanceDate} onChange={(e) => setEditMaintenanceDate(e.target.value)} className={inputCls} />
                </div>
                <div className="grid gap-1">
                  <label className="text-sm text-slate-900 font-semibold uppercase tracking-wide">Returned Date</label>
                  <input type="date" value={editReturnedDate} onChange={(e) => setEditReturnedDate(e.target.value)} className={inputCls} />
                </div>
              </div>

              {/* Footer buttons */}
              <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 p-4 sm:flex-row sm:justify-end -mx-6 -mb-6">
                <Button variant="outline" onClick={closeDialog}>Cancel</Button>
                <Button onClick={submitEdit}>Save Changes</Button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── VIEW DIALOG (Complete — read-only) ─────────────────────────────── */}
      {dialogMode === "view" && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">

            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Maintenance Details</h2>
              <button onClick={closeDialog} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                <FiX size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Employee Name", value: selectedItem["employee name"] },
                  { label: "Asset Name",      value: selectedItem["asset Name"] },
                  { label: "Category",      value: selectedItem.category },
                  { label: "Maintenance Date", value: selectedItem.maintenanceDate || "—" },
                  { label: "Returned Date", value: selectedItem.returnedDate || "—" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-sm text-slate-900 font-semibold uppercase tracking-wide">{label}</p>
                    <p className="text-sm font-medium text-gray-500 mt-0.5">{value}</p>
                  </div>
                ))}
              </div>

              <div className="flex justify-end border-t border-slate-200 bg-slate-50 p-4 -mx-6 -mb-6">
                <Button variant="outline" onClick={closeDialog}>Close</Button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
