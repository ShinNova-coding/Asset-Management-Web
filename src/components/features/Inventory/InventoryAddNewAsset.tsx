"use client"

import { Button } from "@/components/ui/button"
import { FaCirclePlus } from "react-icons/fa6"

export function InventoryAddNewAsset() {
  const goToNewPage = () => {
    // This forces the browser to load your specific page path
    window.location.href = "/inventory/add";
  };

  return (
    <Button 
      onClick={goToNewPage}
      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-medium"
    >
      <FaCirclePlus /> Add New Asset
    </Button>
  )
}