"use client"

import * as React from "react"
import { FiChevronLeft, FiChevronRight, FiPlus } from "react-icons/fi"

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
import { AssignmentSearch } from "./AssignmentSearchBox"
import { AssignmentFilter } from "./AssignmentFilter"
import { useNavigate } from "react-router-dom"

interface AssignmentTableProps {
  data: Assignment[]
  meta?: {
    editRow?: (row: Assignment) => void
    deleteRow?: (id: number) => void 
  }
}

export function AssignmentTable({ data, meta }: AssignmentTableProps) {
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const navigate = useNavigate()

  const table = useReactTable({
    data,
    columns: baseColumns,
    meta,
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
    <div className="w-full space-y-4 p-4 relative">

      {/* TOP CONTROLS: CREATE BUTTON */}
      <div className="flex justify-end w-full">
        <Button
          onClick={() => navigate("/assignment/add")}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm text-sm font-medium transition-colors"
        >
          <FiPlus size={16} />
          Create
        </Button>
      </div>

      {/* SEARCH + FILTER AREA */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full">
        <div className="flex-1">
          <div className="w-full rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-blue-400 overflow-hidden">
            <AssignmentSearch value={globalFilter} onChange={setGlobalFilter} />
          </div>
        </div>
        <div className="w-full md:w-[180px]">
          <AssignmentFilter table={table} />
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
                    const item = row.original;
                    const target = e.target as HTMLElement;
                    
                    // ခလုတ် သို့မဟုတ် Actions ကော်လံကို နှိပ်မိရင် Detail ဆီ သွားမယ့် လမ်းကြောင်းကို ရပ်တန့်ပေးသည်
                    if (target.closest('[data-actions-cell="true"]') || target.closest('button')) {
                      return;
                    }
                    
                    // ရိုးရိုး နေရာလွတ်တွေကို နှိပ်မှသာ Detail View (Read-Only) ဆီ သွားမည်
                    navigate(`/assignment/${item.id}`);
                  }}
                >
                  {row.getVisibleCells().map((cell) => {
                    const isActions = cell.column.id === "actions";
                    return (
                      <TableCell 
                        key={cell.id} 
                        className="py-3 text-slate-700 text-sm"
                        {...(isActions ? { "data-actions-cell": "true" } : {})}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    );
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
      <div className="flex items-center justify-between px-2 py-1">
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

    </div>
  )
}