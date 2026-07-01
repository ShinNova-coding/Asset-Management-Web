import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Tags, ChevronLeft, ChevronRight } from "lucide-react";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin4Fill } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/apiService";
import AddNewCategories from "@/pages/Categories/AddNewCategories";
import CategoriesDelete from "./CategoriesDelete";
import CategoriesEdit from "./CategoriesEdit";

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
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-extrabold text-blue-800 flex items-center gap-3">
          <Tags className="w-8 h-8" /> Categories
        </h2>
        <AddNewCategories onCategoryAdded={fetchCategories} />
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="text-slate-700">Category List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center p-12"><Loader2 className="h-10 w-10 animate-spin text-blue-600" /></div>
          ) : (
            <>
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((cat: any) => (
                    <TableRow key={cat.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium text-slate-800">{cat.name}</TableCell>
                      <TableCell className="text-slate-500">{new Date(cat.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <CategoriesEdit category={{ id: cat.id, name: cat.name }} onUpdated={fetchCategories} triggerIcon={<FaEdit className="w-4 h-4 text-blue-600" />} />
                          <CategoriesDelete categoryId={cat.id} categoryName={cat.name} onDeleted={fetchCategories} triggerIcon={<RiDeleteBin4Fill className="w-5 h-5 text-red-500" />} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between p-4 border-t">
                <span className="text-xs text-slate-500">
                  Page {currentPage + 1} of {pageCount || 1} ({categories.length} total)
                </span>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0}>
                    <ChevronLeft size={16} />
                  </Button>
                  {Array.from({ length: pageCount }).map((_, i) => (
                    <Button key={i} size="sm" variant={currentPage === i ? "default" : "outline"} onClick={() => setCurrentPage(i)}>
                      {i + 1}
                    </Button>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(pageCount - 1, p + 1))} disabled={currentPage >= pageCount - 1}>
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