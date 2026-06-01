"use client"

import * as React from "react"
import { FiChevronLeft, FiChevronRight, FiCheckCircle, FiX } from "react-icons/fi"
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
import { MaintenanceDetailModal } from "./MaintenanceDetailModal"
import { useNavigate } from "react-router-dom"

const durationOptions = [
  { value: "1-hour", label: "1 hour" },
  { value: "2-hours", label: "2 hours" },
  { value: "half-day", label: "Half day" },
  { value: "full-day", label: "Full day" },
]

interface MaintenanceTableProps {
  data: Maintenance[]
}

export function MaintenanceTable({ data: initialData }: MaintenanceTableProps) {
  const [data, setData] = React.useState<Maintenance[]>(initialData)
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [toastMessage, setToastMessage] = React.useState<string | null>(null)
  const [selectedItem, setSelectedItem] = React.useState<Maintenance | null>(null)
  const [dialogMode, setDialogMode] = React.useState<"remark" | "detail" | null>(null)
  const [remarkText, setRemarkText] = React.useState("")
  const [vendorName, setVendorName] = React.useState("")
  const [estimatedCost, setEstimatedCost] = React.useState("0.00")
  const [duration, setDuration] = React.useState("")
  const [laptopType, setLaptopType] = React.useState("")

  const handleRowAction = (item: Maintenance) => {
    setSelectedItem(item)

    if (item.stage === "pending") {
      setRemarkText(item.remark ?? "")
      setDialogMode("remark")
      return
    }

    if (item.stage === "approved") {
      setVendorName(item.vendorName ?? "")
      setEstimatedCost(item.estimatedCost ?? "0.00")
      setDuration(item.duration ?? "")
      setLaptopType(item.laptopType ?? item.category ?? "")
      setDialogMode("detail")
      return
    }
  }

  const closeDialog = () => {
    setDialogMode(null)
    setSelectedItem(null)
    setRemarkText("")
    setVendorName("")
    setEstimatedCost("0.00")
    setDuration("")
    setLaptopType("")
  }

const submitRemark = () => {
  if (!selectedItem) return

  setData((prev) =>
    prev.map((row) =>
      row["employee name"] === selectedItem["employee name"]
        ? {
            ...row,
            stage: "approved",
            status: "In Progress",
            remark: remarkText || "No remark provided",
          }
        : row
    )
  )

  setToastMessage(
    `${selectedItem["employee name"]} approved and moved to in progress.`
  )

  closeDialog()
}

const submitMaintenanceDetail = () => {
  if (!selectedItem) return

  setData((prev) =>
    prev.map((row) =>
      row["asset ID"] === selectedItem["asset ID"]
        ? {
            ...row,
            stage: "completed",
            status: "Complete",
            vendorName: vendorName || "Unknown vendor",
            estimatedCost,
            duration: duration || "Not specified",
            laptopType: laptopType || row.category,
          }
        : row
    )
  )

  setToastMessage(
    `${selectedItem["employee name"]} maintenance completed.`
  )

  closeDialog()
}

  React.useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toastMessage])

  // Patch columns to update status column and actions for 'with request' state
  const columns = React.useMemo(() => {
    return baseColumns.map((col) => {
      // Use 'id' for matching status column
      if ((col as any).accessorKey === "status" || (col as any).id === "status") {
        return {
          ...col,
          header: "Status",
          cell: ({ row }: { row: any }) => {
            const status = row.getValue("status") as string
            const statusStyles: Record<string, string> = {
              Request: "bg-red-100 text-red-700 border border-red-200",
              Pending: "bg-gray-200 text-gray-700 border border-gray-200",
              "In Progress": "bg-amber-100 text-amber-700 border border-amber-200",
              Complete: "bg-green-100 text-green-700 border border-green-200",
              Cancelled: "bg-gray-200 text-gray-600 border border-gray-300",
            }
            return (
              <div className="flex items-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[status] ?? "bg-slate-100 text-slate-700 border border-slate-200"}`}
                >
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
          cell: ({ row, table }: { row: any; table: any }) => {
            const item = row.original as Maintenance & { status?: string }
            // Show Approve/Cancel for 'with request' status
            if (item.status === "Request") {
              return (
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={e => {
                      e.stopPropagation()
                      setData(prev => prev.map(row =>
                        row["asset ID"] === item["asset ID"]
                          ? { ...row, status: "Pending", stage: "pending", _showMaintain: true } as Maintenance & { _showMaintain?: boolean }
                          : row
                      ))
                      setToastMessage(`${item["employee name"]} request approved.`)
                    }}
                  >Approve</Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={e => {
                      e.stopPropagation()
                      setData(prev => prev.filter(row => row["asset ID"] !== item["asset ID"]))
                      setToastMessage(`${item["employee name"]} request cancelled and removed.`)
                    }}
                  >Cancel</Button>
                </div>
              )
            }
            // After Approve, show Maintain button for this row only
            if (item.status === "Pending" && (item as any)._showMaintain) {
              return (
                <Button
                  size="sm"
                  variant="default"
                  onClick={e => {
                    e.stopPropagation()
                    handleRowAction(item)
                  }}
                >Maintain</Button>
              )
            }
            // Show Complete button when status is In Progress
            if (item.status === "In Progress") {
              return (
                <Button
                  size="sm"
                  variant="default"
                  onClick={e => {
                    e.stopPropagation()
                    setSelectedItem(item)
                    setVendorName(item.vendorName ?? "")
                    setEstimatedCost(item.estimatedCost ?? "0.00")
                    setDuration(item.duration ?? "")
                    setLaptopType(item.laptopType ?? item.category ?? "")
                    setDialogMode("detail")
                  }}
                >Complete</Button>
              )
            }
            // Fallback to original action
            return null
          },
        }
      }
      return col
    })
  }, [baseColumns, setData])

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      columnFilters,
    },
    meta: {
      handleRowAction,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  })

  const navigate = useNavigate()

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
                    // navigate to maintenance details using the asset ID
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

      <div className="flex justify-end items-center space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 disabled:opacity-50"
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
                  className={`disabled:opacity-50 ${
                    currentPage === index
                      ? "bg-blue-300 hover:bg-blue-400 text-white border-none"
                      : "bg-slate-200"
                  }`}
                  onClick={() => table.setPageIndex(index)}
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
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <FiChevronRight size={16} />
        </Button>
      </div>

      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-800 transition-all duration-300 transform translate-x-0 max-w-md animate-slide-in">
          <FiCheckCircle className="text-green-400 shrink-0" size={20} />
          <div className="flex-1">
            <p className="text-sm font-semibold">Action Updated</p>
            <p className="text-xs text-slate-400">{toastMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            <FiX size={16} />
          </button>
        </div>
      )}

      <MaintenanceRemark
        open={dialogMode === "remark"}
        item={selectedItem}
        remarkText={remarkText}
        onChange={setRemarkText}
        onClose={closeDialog}
        onSubmit={submitRemark}
      />

      <MaintenanceDetailModal
        open={dialogMode === "detail"}
        item={selectedItem}
        vendorName={vendorName}
        onVendorChange={setVendorName}
        estimatedCost={estimatedCost}
        onEstimatedChange={setEstimatedCost}
        duration={duration}
        onDurationChange={setDuration}
        durationOptions={durationOptions}
        onClose={closeDialog}
        onSubmit={submitMaintenanceDetail}
      />
    </div>
  )
}
