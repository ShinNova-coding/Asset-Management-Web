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
import { Loader2, ChevronLeft, ChevronRight, Search } from "lucide-react";

import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/apiService";
import { IoCloudDownloadOutline } from "react-icons/io5";
import AddNewCategories from "@/pages/Categories/AddNewCategories";
import CategoriesDelete from "@/pages/Categories/CategoriesDelete";
import CategoriesEdit from "@/pages/Categories/CategoriesEdit";
import { FaEdit } from "react-icons/fa";

function EditButton() { 
  return <div className="text-blue-400 hover:text-blue-600 transition p-1 cursor-pointer"><FaEdit size={20} /></div>; 
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
  
  // Pagination State
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
      cell: (info) => currentPage * rowsPerPage + info.row.index + 1, 
      enableSorting: false 
    },
    { 
      accessorKey: "name", 
      header: "Name" 
    },
    { 
      accessorKey: "created_at", 
      header: "Created At", 
      cell: (info) => info.getValue()?.split('T')[0] 
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
      if (typeof updater === 'function') {
        const nextState = updater({ pageIndex: currentPage, pageSize: rowsPerPage });
        setCurrentPage(nextState.pageIndex);
      } else {
        setCurrentPage(updater.pageIndex);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleExportPDF = () => {
    // PDF Logic...
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  const pageCount = table.getPageCount();
  const totalFilteredRows = table.getFilteredRowModel().rows.length;

  const renderPaginationButtons = () => {
    const buttons = [];
    
    buttons.push(
      <button
        key={0}
        onClick={() => setCurrentPage(0)}
        className={`w-7 h-7 flex items-center justify-center rounded-lg font-medium text-xs transition-colors ${
          currentPage === 0 ? "bg-[#1E40AF] text-white" : "text-slate-700 hover:bg-slate-100"
        }`}
      >
        1
      </button>
    );

    if (pageCount > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => setCurrentPage(1)}
          className={`w-7 h-7 flex items-center justify-center rounded-lg font-medium text-xs transition-colors ${
            currentPage === 1 ? "bg-[#1E40AF] text-white" : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          2
        </button>
      );
    }

    if (pageCount > 3 && currentPage < pageCount - 2) {
      buttons.push(
        <span key="ellipsis" className="px-1 text-slate-400 tracking-tight text-[10px] select-none">
          ...
        </span>
      );
    }

    if (pageCount > 2) {
      buttons.push(
        <button
          key={pageCount - 1}
          onClick={() => setCurrentPage(pageCount - 1)}
          className={`w-7 h-7 flex items-center justify-center rounded-lg font-medium text-xs transition-colors ${
            currentPage === pageCount - 1 ? "bg-[#1E40AF] text-white" : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          {pageCount}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="pt-6 px-8 pb-8 space-y-4 bg-[#F3F0F7] min-h-screen">
      <div className="max-w-8xl mx-auto w-full">
        
        {/* Top Header Section */}
        <div className="flex justify-between items-center mb-5 w-full">
          <h2 className="text-2xl font-bold text-blue-900 tracking-tight">
            Categories
          </h2>
          
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleExportPDF}
              className="bg-blue-800 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 px-4 shadow-sm transition-all rounded-xl h-10"
            >
               <IoCloudDownloadOutline size={16} /> 
            </Button>

            <AddNewCategories onCategoryAdded={fetchCategories} />
          </div>
        </div>

        {/* Master Table Card Container */}
        <Card className="shadow-md border border-slate-200 rounded-2xl overflow-hidden bg-white p-4 w-full">
          <CardContent className="p-0 flex flex-col gap-4">
            
            {/* Search Box Component Card */}
            <div className="flex gap-4 rounded-xl bg-white p-4 border border-slate-200 shadow-sm items-center w-full">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-11 pr-4 py-2.5 bg-[#F8FAFC] border border-slate-300 focus:border-blue-400 rounded-xl outline-none transition-all text-slate-700 placeholder-slate-500 text-sm"
                />
              </div>
            </div>

            {/* Main Table Area */}
            {loading ? (
              <div className="flex justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-800" />
              </div>
            ) : (
              <>
                <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                  <Table className="w-full table-fixed">
                    <TableHeader className="bg-blue-800">
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="hover:bg-transparent border-none">
                          {headerGroup.headers.map((header) => {
                            const canSort = header.column.getCanSort();
                            const isSorted = header.column.getIsSorted();
                            
                            // 💡 Adjusted widths to pull "Created At" closer to "Name"
                            let widthClass = "";
                            if (header.id === "No.") widthClass = "w-[2%] text-left";
                            if (header.id === "name") widthClass = "w-[5%] text-center";
                            if (header.id === "created_at") widthClass = "w-[5%] text-left";
                            if (header.id === "updated_at") widthClass = "w-[3%] text-left";
                            if (header.id === "Actions") widthClass = "w-[5%] text-left";

                            return (
                              <TableHead 
                                key={header.id} 
                                className={`text-white font-semibold py-3 px-4 text-sm transition-colors ${widthClass} ${
                                  isSorted ? "bg-blue-600" : ""
                                } ${canSort ? "cursor-pointer hover:bg-blue-700 select-none" : ""}`} 
                                onClick={header.column.getToggleSortingHandler()}
                              >
                                <div className={`flex items-center gap-2 ${header.id === "No." || header.id === "Actions" ? "justify-center" : "justify-start"}`}>
                                  {flexRender(header.column.columnDef.header, header.getContext())}
                                  {canSort && (
                                    <div className="flex flex-col">
                                      <FiChevronUp size={12} className={isSorted === "asc" ? "text-white" : "text-white/40"} />
                                      <FiChevronDown size={12} className={isSorted === "desc" ? "text-white" : "text-white/40"} />
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
                      {table.getRowModel().rows.length > 0 ? (
                        table.getRowModel().rows.map((row) => (
                          <TableRow key={row.id} className="hover:bg-slate-50/80 border-b border-slate-100 transition-colors">
                            {row.getVisibleCells().map((cell) => {
                              
                              // 💡 Synchronized body alignment and responsive styling classes
                              let cellClass = "py-3.5 px-4 text-sm text-slate-700";
                              if (cell.column.id === "No.") cellClass = "font-medium text-slate-600 py-3.5 text-center text-sm";
                              if (cell.column.id === "name") cellClass = "font-semibold text-slate-700 py-3.5 px-7 break-words text-sm text-left";
                              if (cell.column.id === "created_at") cellClass = "text-slate-500 py-3.5 px-4 whitespace-nowrap text-sm text-left";
                              if (cell.column.id === "updated_at") cellClass = "text-slate-500 py-3.5 px-4 whitespace-nowrap text-sm text-left";
                              if (cell.column.id === "Actions") cellClass = "text-center py-3.5 px-4";

                              return (
                                <TableCell key={cell.id} className={cellClass}>
                                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={columns.length} className="text-center py-8 text-slate-400 text-sm">
                            No categories found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination Area */}
                <div className="flex items-center justify-between border border-slate-200 rounded-xl bg-white p-2">
                  <span className="text-[13px] text-slate-500 font-normal pl-1">
                    Page {currentPage + 1} of {pageCount || 1} ({totalFilteredRows} total categories)
                  </span>
                  
                  <div className="flex items-center gap-1 border border-slate-200 rounded-xl p-0.5 bg-white">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(0, p - 1))} 
                      disabled={currentPage === 0}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    >
                      <ChevronLeft size={15} />
                    </button>

                    {renderPaginationButtons()}
                    
                    <button 
                      onClick={() => setCurrentPage(p => Math.min(pageCount - 1, p + 1))} 
                      disabled={currentPage >= pageCount - 1}
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    >
                      <ChevronRight size={15} />
                    </button>
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