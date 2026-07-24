import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { apiRequest } from "@/lib/apiService";

export default function AddNewCategories({ onCategoryAdded }: { onCategoryAdded: () => void }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
     
      await apiRequest("/category", "POST", { name });
      setName("");
      setOpen(false);
      onCategoryAdded(); 
    } catch (error) {
      console.error("Error creating category:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#7C3AED] hover:bg-[#A78BFA] text-white font-semibold flex items-center gap-2 px-4 shadow-sm transition-all rounded-lg h-9">
          <Plus className="mr-2 h-4 w-3" /> Add Category
        </Button>
      </DialogTrigger>
    
      <DialogContent className="bg-white sm:max-w-md">
  <DialogHeader>
    <DialogTitle className="text-[#7C3AED]">Add New Category</DialogTitle>
  </DialogHeader>
  <form onSubmit={handleSubmit} className="space-y-4 pt-4">
    <div className="space-y-2">
      <Label htmlFor="name">Category Name</Label>
      <Input
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Furniture"
        required
      />
    </div>
    <Button type="submit" className="bg-[#7C3AED] flex justify-end ml-auto" disabled={loading}>
      {loading ? "Adding..." : "Save Category"}
    </Button>
  </form>
</DialogContent>
    </Dialog>
  );
}