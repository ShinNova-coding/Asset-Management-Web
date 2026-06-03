"use client"

import * as React from "react"
import { FiChevronLeft, FiChevronRight, FiClock } from "react-icons/fi"

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
    deleteRow?: (assetId: string) => void
  }
}

export function AssignmentTable({ data, meta }: AssignmentTableProps) {
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([])

  const navigate = useNavigate()

 
  const pendingCount = data.filter(
    (item: any) => item.status === "pending" || item.status === "Pending"
  ).length

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

     
      <div className="max-w-xs bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider">Pending Requests</p>
          <h3 className="text-2xl font-bold text-slate-800">{pendingCount} Request</h3>
          
          <div className="flex items-center gap-2 pt-1">
            <button 
              onClick={() => alert("Accept clicked")}
              className="px-3 py-1 bg-blue-400 text-white rounded text-xs font-medium hover:bg-emerald-700 transition-colors"
            >
              Accept
            </button>
            <button 
              onClick={() => alert("Reject clicked")}
              className="px-3 py-1 bg-rose-600 text-white rounded text-xs font-medium hover:bg-rose-700 transition-colors"
            >
              Reject
            </button>
          </div>
        </div>
        <div className="p-3 bg-blue-400 text-white rounded-lg self-start">
          <FiClock size={20} />
        </div>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex items-center justify-between gap-4">
        <AssignmentSearch
          value={globalFilter}
          onChange={setGlobalFilter}
        />
        <AssignmentFilter table={table} />
      </div>

      {/* TABLE */}
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
                    const item = row.original
                    navigate(`/assignment/${item.assetId}`)
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
                <TableCell colSpan={baseColumns.length} className="h-24 text-center text-slate-500">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
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

    </div>
  )
}