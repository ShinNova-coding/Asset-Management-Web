"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, ChevronLeft, ChevronRight, Search } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/apiService";
import { IoCloudDownloadOutline } from "react-icons/io5";
import AddNewCategories from "@/pages/Categories/AddNewCategories";
import CategoriesDelete from "@/pages/Categories/CategoriesDelete";
import CategoriesEdit from "@/pages/Categories/CategoriesEdit";
import { FaEdit } from "react-icons/fa";

function EditButton() { return <div className="text-blue-400 hover:text-blue-600 transition p-1 cursor-pointer"><FaEdit size={18} /></div>; }
function DeleteButton() { return <div className="text-red-400 hover:text-red-700 transition cursor-pointer"><svg stroke="currentColor" fill="currentColor" viewBox="0 0 24 24" height="20" width="20"><path d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8H5v12zm5-10h2v8h-2v-8zm4 0h2v8h-2v-8zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg></div>; }

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 5;

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await apiRequest("/category", "GET");
      setCategories(response.data || []);
    } catch (error) { console.error("Error fetching categories:", error); } 
    finally { setLoading(false); }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const columns = ["No.", "Category Name", "Created At"];
    
    const rows = categories.map((item: any, index: number) => [
      index + 1,
      item.name || "N/A",
      item.created_at ? new Date(item.created_at).toISOString().split('T')[0] : "N/A"
    ]);

    doc.text("Categories Report", 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [columns],
      body: rows,
      theme: "striped",
      headStyles: { fillColor: [30, 64, 175] } 
    });
    doc.save(`categories_report_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // Search filter logic
  const filteredCategories = categories.filter((cat: any) =>
    cat.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pageCount = Math.ceil(filteredCategories.length / rowsPerPage);
  const paginatedData = filteredCategories.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    
    buttons.push(
      <button
        key={0}
        onClick={() => setCurrentPage(0)}
        className={`w-7 h-7 flex items-center justify-center rounded-lg font-medium text-xs transition-colors ${
          currentPage === 0
            ? "bg-[#1E40AF] text-white"
            : "text-slate-700 hover:bg-slate-100"
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
            currentPage === 1
              ? "bg-[#1E40AF] text-white"
              : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          2
        </button>
      );
    }

    if (pageCount > 3) {
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
            currentPage === pageCount - 1
              ? "bg-[#1E40AF] text-white"
              : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          {pageCount}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="p-8 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-5xl mx-auto">
        
        {/* Top Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-extrabold text-blue-900 flex items-center gap-3 tracking-tight">
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

        {/* 💡 ဤနေရာတွင် Card အကြီးကြီးတစ်ခုတည်းအဖြစ် အားလုံးကို ဝန်းရံပေးလိုက်ပါပြီ */}
        <Card className="shadow-md border border-slate-200 rounded-xl overflow-hidden bg-white p-3  max-w-[900px]">
          <CardContent className="flex flex-col gap-3">
            
            {/* 💡 1. ပေးထားတဲ့ Card Style အတိုင်း ပြင်ဆင်ထားတဲ့ Search Box Component */}
            <div className="flex gap-4 rounded-xl bg-white p-4 border border-slate-200 shadow-sm items-center w-full">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-9 pr-4 py-2.5 bg-[#F8FAFC] border border-slate-300 focus:border-blue-400 rounded-xl outline-none transition-all text-slate-700 placeholder-slate-500 text-sm"
                />
              </div>
            </div>

            {/* 2. Main Table Area */}
            {loading ? (
              <div className="flex justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-800" />
              </div>
            ) : (
              <>
                <div className="overflow-hidden rounded-xl border border-slate-300">
                  <Table className="w-full table-fixed">
                    <TableHeader className="bg-[#1E40AF] hover:bg-[#1E40AF]">
                      <TableRow className="hover:bg-transparent border-none">
                        <TableHead className="text-white font-semibold py-3.5 pl-6 w-[12%] text-center text-sm">No.</TableHead>
                        <TableHead className="text-white font-semibold py-3.5 px-4 w-[48%] text-sm">Name</TableHead>
                        <TableHead className="text-white font-semibold py-3.5 px-4 w-[22%] text-sm">Created At</TableHead>
                        
                        <TableHead className="text-white font-semibold py-3.5 pr-6 w-[18%] text-center text-sm">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedData.length > 0 ? (
                        paginatedData.map((cat: any, index: number) => (
                          <TableRow key={cat.id} className="hover:bg-slate-50/80 border-b border-slate-100 transition-colors cursor-pointer">
                            <TableCell className="font-medium text-slate-600 py-3.5 pl-6 text-center truncate text-sm">
                              {currentPage * rowsPerPage + index + 1}
                            </TableCell>
                            <TableCell className="font-semibold text-slate-700 py-3.5 px-4 break-words text-sm">
                              {cat.name}
                            </TableCell>
                            <TableCell className="text-slate-500 py-3.5 px-4 whitespace-nowrap text-sm">
                              {new Date(cat.created_at).toISOString().split('T')[0]}
                            </TableCell>
                            <TableCell className="text-center py-3.5 pr-6">
                              <div className="flex justify-center items-center gap-3">
                                <CategoriesEdit 
                                  category={{ id: cat.id, name: cat.name }} 
                                  onUpdated={fetchCategories} 
                                  triggerIcon={<EditButton />} 
                                />
                                <CategoriesDelete 
                                  categoryId={cat.id} 
                                  categoryName={cat.name} 
                                  onDeleted={fetchCategories} 
                                  triggerIcon={<DeleteButton />} 
                                />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8 text-slate-400 text-sm">
                            No categories found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* 3. Pagination Area inside Master Card (ကျစ်လျစ်သိပ်သည်းသော အရွယ်အစား) */}
                <div className="flex items-center justify-between border border-slate-200 rounded-xl bg-white p-1.5">
                  <span className="text-[13px] text-slate-500 font-normal pl-1">
                    Page {currentPage + 1} of {pageCount || 1} ({filteredCategories.length} total categories)
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