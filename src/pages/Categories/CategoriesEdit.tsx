import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import { apiRequest } from "@/lib/apiService";

interface EditProps {
  category: { id: string; name: string };
  onUpdated: () => void;
}

export default function CategoriesEdit({ category, onUpdated }: EditProps) {
  const [name, setName] = useState(category.name);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Reset input if the category object changes
  useEffect(() => {
    setName(category.name);
  }, [category]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Matches your provided API structure:
      // PATCH request to /category/category_id
      await apiRequest("/category/category_id", "PATCH", {
        category_id: category.id,
        name: name
      });
      
      setOpen(false);
      onUpdated();
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update category.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4 text-blue-600" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleUpdate} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Category Name</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Updating..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}