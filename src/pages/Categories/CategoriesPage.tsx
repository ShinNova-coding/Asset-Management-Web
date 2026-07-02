"use client";

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
import { Loader2, Search } from "lucide-react";
import { FiChevronUp, FiChevronDown, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/apiService";
import { IoCloudDownloadOutline } from "react-icons/io5";
import AddNewCategories from "@/pages/Categories/AddNewCategories";
import CategoriesDelete from "@/pages/Categories/CategoriesDelete";
import CategoriesEdit from "@/pages/Categories/CategoriesEdit";
import { FaEdit } from "react-icons/fa";

function EditButton() { 
  return (
    <div className="text-blue-400 hover:text-blue-600 transition p-1 cursor-pointer">
      <FaEdit size={20} />
    </div>
  ); 
}

function DeleteButton() { 
  return (
    <div className="text-red-400 hover:text-red-700 transition cursor-pointer">
      <svg stroke="currentColor" fill="currentColor" viewBox="0 0 24 24" height="16" width="16">
        <path d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8H5v12zm5-10h2v8h-2v-8zm4 0h2v8h-2v-8zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path>
      </svg>
    </div>
  ); 
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 5;

  useEffect(() => { 
    fetchCategories(); 
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await apiRequest("/category", "GET");
      setCategories(response.data || []);
    } catch (error) { 
      console.error("Error fetching categories:", error); 
    } finally { 
      setLoading(false); 
    }
  };

  const columns = useMemo(() => [
    { 
      header: "No.", 
      cell: ({row}:any) => row.index +1
      
    },
    { accessorKey: "name", header: "Name" },
    { 
      accessorKey: "created_at", 
      header: "Created At", 
      cell: (info) => (info.getValue() as string)?.split('T')[0] 
    },
    { 
      accessorKey: "updated_at", 
      header: "Updated At", 
      cell: (info) => info.getValue() ? (info.getValue() as string).split('T')[0] : "N/A" 
    },
    { 
      header: "Actions", 
      enableSorting: false, 
      cell: ({ row }) => (
        <div className="flex justify-center items-center gap-3">
          <CategoriesEdit category={{ id: row.original.id, name: row.original.name }} onUpdated={fetchCategories} triggerIcon={<EditButton />} />
          <CategoriesDelete categoryId={row.original.id} categoryName={row.original.name} onDeleted={fetchCategories} triggerIcon={<DeleteButton />} />
        </div>
      )
    },
  ], [currentPage]);

  const table = useReactTable({
    data: categories,
    columns,
    state: { 
      sorting, 
      globalFilter: searchTerm,
      pagination: { pageIndex: currentPage, pageSize: rowsPerPage }
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setSearchTerm,
    onPaginationChange: (updater) => {
      const nextState = typeof updater === 'function' ? updater({ pageIndex: currentPage, pageSize: rowsPerPage }) : updater;
      setCurrentPage(nextState.pageIndex);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleExportPDF = () => { /* PDF Logic */ };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  const pageCount = table.getPageCount();

  return (
    <div className="pt-6 px-8 pb-8 space-y-4 bg-[#F3F0F7] min-h-screen">
      <div className="max-w-8xl mx-auto w-full">
        <div className="flex justify-between items-center mb-5 w-full">
          <h2 className="text-2xl font-bold text-blue-900 tracking-tight">Categories</h2>
          <div className="flex items-center gap-3">
            <Button onClick={handleExportPDF} className="bg-blue-800 hover:bg-blue-700 text-white rounded-xl h-10">
               <IoCloudDownloadOutline size={16} /> 
            </Button>
            <AddNewCategories onCategoryAdded={fetchCategories} />
          </div>
        </div>

        <Card className="shadow-md border border-slate-200 rounded-2xl overflow-hidden bg-white p-4 w-full">
          <CardContent className="p-0 flex flex-col gap-4">
            <div className="flex rounded-xl bg-white p-4 border border-slate-200 shadow-sm items-center w-full">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-11 pr-4 py-2.5 bg-[#F8FAFC] border border-slate-300 focus:border-blue-400 rounded-xl outline-none text-sm"
                />
              </div>
            </div>

            {loading ? (
             <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
        </div>
            ) : (
              <>
                <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                  <Table className="w-full table-fixed">
                    <TableHeader className="bg-blue-800">
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="hover:bg-transparent border-none">
                          {headerGroup.headers.map((header) => (
                            <TableHead key={header.id} className="text-white font-semibold py-3 px-4 text-sm" onClick={header.column.getToggleSortingHandler()}>
                              {flexRender(header.column.columnDef.header, header.getContext())}
                            </TableHead>
                          ))}
                        </TableRow>
                      ))}
                    </TableHeader>
                    <TableBody>
                      {table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id} className="hover:bg-slate-50/80 border-b border-slate-100 transition-colors">
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id} className="py-3.5 px-4 text-sm text-slate-700">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex items-center justify-between px-2 py-1 bg-white rounded-lg border border-slate-200 p-2 shadow-sm">
                  <div className="text-xs text-slate-500 font-medium">
                    Page {currentPage + 1} of {pageCount || 1} ({table.getFilteredRowModel().rows.length} total)
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                      <FiChevronLeft size={16} />
                    </Button>
                    {Array.from({ length: pageCount }).map((_, index) => {
                      if (index === 0 || index === pageCount - 1 || (index >= currentPage - 1 && index <= currentPage + 1)) {
                        return (
                          <Button key={index} size="sm" className={`h-8 w-8 p-0 ${currentPage === index ? "bg-[#1E3A8A] text-white" : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"}`} onClick={() => table.setPageIndex(index)}>
                            {index + 1}
                          </Button>
                        );
                      }
                      if (index === currentPage - 2 || index === currentPage + 2) return <span key={index} className="px-2 text-slate-400">...</span>;
                      return null;
                    })}
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                      <FiChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}