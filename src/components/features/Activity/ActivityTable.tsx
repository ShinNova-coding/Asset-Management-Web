"use client"

import * as React from "react"
import { useNavigate, useLocation } from "react-router-dom" 
import { 
  FiChevronLeft, 
  FiChevronRight, 
  FiCheckCircle, 
  FiX, 
  FiSearch
} from "react-icons/fi"
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
import { columns, type ActivityLog } from "./ActivityColumns"

interface ActivityTableProps {
  data: ActivityLog[]
}

export function ActivityTable({ data: initialData }: ActivityTableProps) {
  const navigate = useNavigate()
  const location = useLocation()
  
  
  const [tableData, setTableData] = React.useState<ActivityLog[]>(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("asset_guard_logs")
      return savedData ? JSON.parse(savedData) : initialData
    }
    return initialData
  })

  const [globalFilter, setGlobalFilter] = React.useState("")
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  
  const [toastConfig, setToastConfig] = React.useState<{ show: boolean; title: string; message: string }>({
    show: false,
    title: "",
    message: ""
  })

 
  React.useEffect(() => {
    if (initialData && initialData.length > 0) {
      setTableData(initialData)
    }
  }, [initialData])

  
  React.useEffect(() => {
    if (tableData && tableData.length > 0) {
      localStorage.setItem("asset_guard_logs", JSON.stringify(tableData))
    }
  }, [tableData])

 
  React.useEffect(() => {
    if (location.state?.updatedItem) {
      const updated = location.state.updatedItem

      setTableData((prev) => {
        const exists = prev.some((item) => item.id === updated.id)
        if (exists) {
          return prev.map((item) => (item.id === updated.id ? { ...item, ...updated } : item))
        } else {
          return [updated, ...prev]
        }
      })

      setToastConfig({
        show: true,
        title: "Record Updated Successfully",
        message: "The log changes were mapped safely to the current dataset array context view."
      })

      
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.state, navigate, location.pathname])

  
  React.useEffect(() => {
    if (toastConfig.show) {
      const timer = setTimeout(() => setToastConfig((prev) => ({ ...prev, show: false })), 3000)
      return () => clearTimeout(timer)
    }
  }, [toastConfig.show])

  const table = useReactTable({
    data: tableData,
    columns,
    state: { 
      globalFilter,
      columnFilters, 
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

 
  const renderPageButtons = () => {
    const buttons: React.ReactNode[] = []
    
    for (let i = 0; i < pageCount; i++) {
      const isFirst = i === 0
      const isLast = i === pageCount - 1
      const isWithinRange = i >= currentPage - 1 && i <= currentPage + 1

      if (isFirst || isLast || isWithinRange) {
        buttons.push(
          <Button
            key={i}
            variant={currentPage === i ? "default" : "outline"}
            size="sm"
            className={
              currentPage === i 
                ? "bg-blue-300 text-slate-800 font-semibold border-none hover:bg-blue-400" 
                : "bg-slate-100 text-slate-700"
            }
            onClick={() => table.setPageIndex(i)}
          >
            {i + 1}
          </Button>
        )
      } else if (i === 1 && currentPage > 2) {
        buttons.push(
          <span key="left-ellipsis" className="px-2 text-slate-400 text-sm select-none">
            ...
          </span>
        )
      } else if (i === pageCount - 2 && currentPage < pageCount - 3) {
        buttons.push(
          <span key="right-ellipsis" className="px-2 text-slate-400 text-sm select-none">
            ...
          </span>
        )
      }
    }
    return buttons
  }

  return (
    <div className="w-full space-y-4">
      
      <div className="flex flex-col sm:flex-row w-full items-start sm:items-center justify-between gap-4">
        <div className="relative max-w-4xl w-full flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search Activity Logs..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none text-sm focus:ring-2 focus:ring-blue-400 transition-all bg-slate-50"
          />
        </div>

       
        <div className="relative flex items-center gap-2 w-full sm:w-auto">
          <select
            value={(table.getColumn("action")?.getFilterValue() as string) ?? ""}
            onChange={(e) => table.getColumn("action")?.setFilterValue(e.target.value || undefined)}
            className="w-full sm:w-48 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-400 transition-all cursor-pointer appearance-none shadow-xs"
            style={{ 
              backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`, 
              backgroundRepeat: 'no-repeat', 
              backgroundPosition: 'right 8px center', 
              backgroundSize: '16px' 
            }}
          >
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Returned">Returned</option>
          </select>
        </div>
      </div>

     
      <div className="rounded-md border border-slate-200 overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-blue-400">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-none">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-white font-bold py-3 text-sm">
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
                  className="border-b border-slate-100 transition-colors hover:bg-slate-50/60 cursor-pointer"
                  onClick={(e) => {
                    const target = e.target as HTMLElement
                    if (target.closest('button') || target.closest('svg') || target.closest('a')) {
                      return 
                    }
                    navigate(`/activity/${row.original.id || row.id}`, { 
                      state: { item: row.original } 
                    })
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3 text-slate-700 text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-slate-400 text-sm">
                  No matches found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

     
      <div className="flex justify-end items-center space-x-2 pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="p-2 disabled:opacity-40"
        >
          <FiChevronLeft size={16} />
        </Button>

        <div className="flex gap-1 items-center">
          {renderPageButtons()}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="p-2 disabled:opacity-40"
        >
          <FiChevronRight size={16} />
        </Button>
      </div>

     
      {toastConfig.show && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-800 max-w-md animate-slide-in">
          <FiCheckCircle className="text-green-400 shrink-0" size={20} />
          <div className="flex-1">
            <p className="text-sm font-semibold">{toastConfig.title}</p>
            <p className="text-xs text-slate-400">{toastConfig.message}</p>
          </div>
          <button 
            type="button" 
            onClick={() => setToastConfig((prev) => ({ ...prev, show: false }))}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            <FiX size={16} />
          </button>
        </div>
      )}

    </div>
  )
}