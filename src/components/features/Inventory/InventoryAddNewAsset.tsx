"use client"

import { Button } from "@/components/ui/button"
import { FaCirclePlus } from "react-icons/fa6"

export function InventoryAddNewAsset() {
  const goToNewPage = () => {
    
    window.location.href = "/inventory/add";
  };

  return (
    <Button 
      onClick={goToNewPage}
      className="flex items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white shadow-sm font-medium px-6 py-6"
    >
      <FaCirclePlus size={16} /> Add New Asset
    </Button>
  )
}