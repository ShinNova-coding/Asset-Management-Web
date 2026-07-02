import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RiDeleteBin4Fill } from "react-icons/ri";
import { apiRequest } from "@/lib/apiService";

interface DeleteProps {
  categoryId: string;
  categoryName: string;
  onDeleted: () => void;
}

export default function CategoriesDelete({ categoryId, categoryName, onDeleted }: DeleteProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
     
      await apiRequest("/category/category_id", "DELETE", {
        category_id: categoryId
      });
      
      setOpen(false);
      onDeleted();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete category.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        
          <RiDeleteBin4Fill className="h-5 w-5 text-red-600" />
       
      </DialogTrigger>
     <DialogContent className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
  <DialogHeader>
  
    <DialogTitle className="text-base font-bold text-slate-900">Confirm Delete</DialogTitle>
    <DialogDescription className="text-xs text-slate-500">
      Are you sure you want to delete <strong>{categoryName}</strong>?
    </DialogDescription>
  </DialogHeader>
  
  <DialogFooter className="flex justify-end gap-2.5 pt-2">
    <Button variant="outline" onClick={() => setOpen(false)}>
      Cancel
    </Button>
    <Button 
      variant="destructive" 
      className="bg-red-700 hover:bg-red-900 text-white" 
      onClick={handleDelete} 
      disabled={loading}
    >
      {loading ? "Deleting..." : "Delete"}
    </Button>
  </DialogFooter>
</DialogContent>
    </Dialog>
  );
}