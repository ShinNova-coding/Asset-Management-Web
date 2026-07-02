import React, { useEffect, useState, useMemo } from "react";
import { 
  useReactTable, 
  getCoreRowModel, 
  getSortedRowModel, 
  getFilteredRowModel, 
  getPaginationRowModel, 
  flexRender 
} from "@tanstack/react-table";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/apiService";

import AddNewCategories from "@/pages/Categories/AddNewCategories";
import CategoriesDelete from "@/pages/Categories/CategoriesDelete";
import CategoriesEdit from "@/pages/Categories/CategoriesEdit";
import { FaEdit } from "react-icons/fa";

function EditButton() { return <div className="text-blue-400 hover:text-blue-600 transition p-1 cursor-pointer"><FaEdit size={18} /></div>; }
function DeleteButton() { return <div className="text-red-400 hover:text-red-700 transition cursor-pointer"><svg stroke="currentColor" fill="currentColor" viewBox="0 0 24 24" height="20" width="20"><path d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8H5v12zm5-10h2v8h-2v-8zm4 0h2v8h-2v-8zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg></div>; }

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await apiRequest("/category", "GET");
      setCategories(response.data || []);
    } catch (error) { console.error("Error fetching categories:", error); } 
    finally { setLoading(false); }
  };

  const columns = useMemo(() => [
    { header: "No.", cell: (info) => info.row.index + 1, enableSorting: false },
    { accessorKey: "name", header: "Name" },
  
    { accessorKey: "created_at", header: "Created At", cell: (info) => info.getValue()?.split('T')[0] },
    { 
      accessorKey: "updated_at", 
      header: "Updated At", 
      cell: (info) => info.getValue() ? new Date(info.getValue()).toLocaleDateString() : "N/A" 
    },
    { header: "Actions", enableSorting: false, cell: ({ row }) => (
      <div className="flex justify-center ">
        <CategoriesEdit category={row.original} onUpdated={fetchCategories} triggerIcon={<EditButton />} />
        <CategoriesDelete categoryId={row.original.id} categoryName={row.original.name} onDeleted={fetchCategories} triggerIcon={<DeleteButton />} />
      </div>
    )},
  ], []);

  const table = useReactTable({
    data: categories,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 5 } }
  });

  return (
    <div className="pt-6 px-8 pb-8 min-h-screen bg-[#F3F0F7]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-blue-900 tracking-tight">Categories</h2>
        <AddNewCategories onCategoryAdded={fetchCategories} />
      </div>

      <Card className="shadow-sm border-slate-200 rounded-2xl overflow-hidden bg-white">
        <CardContent className="p-4 space-y-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              placeholder="Search by name..."
              value={table.getColumn("name")?.getFilterValue() ?? ""}
              onChange={(e) => table.getColumn("name")?.setFilterValue(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-slate-50 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-12"><Loader2 className="animate-spin h-8 w-8 text-blue-800" /></div>
          ) : (
            <>
              <div className="overflow-hidden rounded-xl border border-slate-100">
                <Table>
                  <TableHeader className="bg-blue-800">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id} className="hover:bg-transparent border-none">
                        {headerGroup.headers.map((header) => {
                          const canSort = header.column.getCanSort();
                          return (
                            <TableHead key={header.id} className={`text-white font-semibold py-3 text-sm ${canSort ? "cursor-pointer hover:bg-blue-700" : ""}`} onClick={header.column.getToggleSortingHandler()}>
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
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows.map(row => (
                      <TableRow key={row.id} className="border-b border-slate-100">
                        {row.getVisibleCells().map(cell => (
                          <TableCell key={cell.id} className="py-4">{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between px-2 pt-2">
                <span className="text-sm text-slate-500">Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}><ChevronLeft size={16}/></Button>
                  {Array.from({ length: table.getPageCount() }).map((_, i) => (
                    <Button key={i} size="sm" className={table.getState().pagination.pageIndex === i ? "bg-blue-800 text-white" : "bg-transparent text-slate-700 hover:bg-slate-100"} onClick={() => table.setPageIndex(i)}>{i + 1}</Button>
                  ))}
                  <Button variant="ghost" size="icon" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}><ChevronRight size={16}/></Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}