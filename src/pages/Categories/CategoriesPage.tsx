import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/apiService";
import AddNewCategories from "@/pages/Categories/AddNewCategories";
import CategoriesDelete from "./CategoriesDelete";
import CategoriesEdit from "./CategoriesEdit";

// 💡 သင်ပေးထားသော Edit Component ဒီဇိုင်းအတိုင်း ပြင်ဆင်ထားပါသည်
function EditButton({ onEdit }: { onEdit?: () => void }) {
  return (
    <button 
      onClick={(e) => {
        e.stopPropagation(); // TableRow ရဲ့ navigation handler တွေကို block ဖို့
        if (onEdit) onEdit();
      }} 
      className="text-blue-400 hover:text-blue-600 transition p-1"
      title="Edit Asset"
    >
      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
        <path d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L428.5 251.5l-90.2-90.2 64.3-64.3c3.8-3.8 10-3.8 13.8 0zM211.9 368.1L292 288l90.2 90.2-80.1 80.1c-3.1 3.1-7.1 4.9-11.5 5.1l-130.7 6.5c-8.4.4-15.5-6.6-15.1-15l6.5-130.7c.2-4.4 2-8.4 5.1-11.5l112.9-112.9 90.2 90.2-112.9 112.9c-4.1 4.1-6.5 9.7-6.5 15.6v32c0 13.3 10.7 24 24 24h32c5.9 0 11.5-2.4 15.6-6.5zM563 21.1L514.9 69.2c-4.1 4.1-10.7 4.1-14.8 0l-90.2-90.2c-4.1-4.1-4.1-10.7 0-14.8L458 5.3c18.7-18.7 49.1-18.7 67.8 0l37.2 37.2c18.7 18.7 18.7 49.1 0 67.8z"></path>
      </svg>
    </button>
  );
}

// 💡 သင်ပေးထားသော Delete Component ဒီဇိုင်းအတိုင်း ပြင်ဆင်ထားပါသည်
function DeleteButton({ onDelete }: { onDelete?: () => void }) {
  return (
    <button 
      onClick={(e) => {
        e.stopPropagation(); // Delete နှိပ်လျှင်လည်း Row click မဖြစ်အောင် ထိန်းထားပါသည်
        if (onDelete) onDelete();
      }} 
      className="text-red-400 hover:text-red-700 transition"
      title="Delete Asset"
    >
      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8H5v12zm5-10h2v8h-2v-8zm4 0h2v8h-2v-8zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path>
      </svg>
    </button>
  );
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 5;
  const pageCount = Math.ceil(categories.length / rowsPerPage);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await apiRequest("/category", "GET");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  // Slice data for pagination
  const paginatedData = categories.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage);

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      {/* Top Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-blue-900 flex items-center gap-3 tracking-tight">
          Categories
        </h2>
        <AddNewCategories onCategoryAdded={fetchCategories} />
      </div>

      {/* Main Table Card Box Container */}
      <Card className="shadow-sm border-slate-200 rounded-2xl overflow-hidden bg-white p-4">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>
          ) : (
            <>
              <div className="overflow-hidden rounded-xl border border-slate-100">
                <Table>
                  <TableHeader className="bg-[#1E40AF] hover:bg-[#1E40AF]">
                    <TableRow className="hover:bg-transparent border-none">
                      <TableHead className="text-white font-bold py-4 pl-4 w-[80px]">No.</TableHead>
                      <TableHead className="text-white font-bold py-4">Name</TableHead>
                      <TableHead className="text-white font-bold py-4">Created At</TableHead>
                      <TableHead className="text-white font-bold py-4 text-center w-[120px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map((cat: any, index: number) => (
                      <TableRow key={cat.id} className="hover:bg-slate-50/80 border-b border-slate-100 transition-colors cursor-pointer">
                        {/* စဉ်နံပါတ် (No.) */}
                        <TableCell className="font-medium text-slate-600 py-4 pl-4">
                          {currentPage * rowsPerPage + index + 1}
                        </TableCell>
                        
                        {/* Name */}
                        <TableCell className="font-semibold text-slate-700 py-4">
                          {cat.name}
                        </TableCell>
                        
                        {/* Created At */}
                        <TableCell className="text-slate-500 py-4">
                          {new Date(cat.created_at).toISOString().split('T')[0]}
                        </TableCell>
                        
                        {/* Actions (Edit & Delete Buttons) */}
                        <TableCell className="text-center py-4">
                          <div className="flex justify-center items-center gap-3">
                            {/* 💡 triggerIcon နေရာတွင် သင်ပေးထားသော Edit Button ဒီဇိုင်းအတိုင်း အစားထိုးထားပါသည် */}
                            <CategoriesEdit 
                              category={{ id: cat.id, name: cat.name }} 
                              onUpdated={fetchCategories} 
                              triggerIcon={<EditButton />} 
                            />
                            
                            {/* 💡 triggerIcon နေရာတွင် သင်ပေးထားသော Delete Button ဒီဇိုင်းအတိုင်း အစားထိုးထားပါသည် */}
                            <CategoriesDelete 
                              categoryId={cat.id} 
                              categoryName={cat.name} 
                              onDeleted={fetchCategories} 
                              triggerIcon={<DeleteButton />} 
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Section */}
              <div className="flex items-center justify-between pt-5 pb-2 px-2 border-t border-slate-100 mt-4">
                <span className="text-sm font-medium text-slate-500">
                  Page {currentPage + 1} of {pageCount || 1} ({categories.length} total categories)
                </span>
                
                <div className="flex items-center gap-1.5">
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="w-8 h-8 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50"
                    onClick={() => setCurrentPage(p => Math.max(0, p - 1))} 
                    disabled={currentPage === 0}
                  >
                    <ChevronLeft size={16} />
                  </Button>

                  {Array.from({ length: pageCount }).map((_, i) => (
                    <Button 
                      key={i} 
                      size="sm" 
                      className={`w-8 h-8 rounded-lg font-semibold text-xs transition-all ${
                        currentPage === i 
                          ? "bg-[#1E40AF] text-white hover:bg-[#1E40AF]/90 shadow-sm" 
                          : "bg-transparent text-slate-700 hover:bg-slate-100 border border-slate-200"
                      }`}
                      onClick={() => setCurrentPage(i)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="w-8 h-8 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50"
                    onClick={() => setCurrentPage(p => Math.min(pageCount - 1, p + 1))} 
                    disabled={currentPage >= pageCount - 1}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}