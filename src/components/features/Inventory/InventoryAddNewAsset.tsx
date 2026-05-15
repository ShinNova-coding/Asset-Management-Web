"use client"

import { Button } from "@/components/ui/button"
import { FaCirclePlus } from "react-icons/fa6"

export function InventoryAddNewAsset() {
  const goToNewPage = () => {
    // This MUST match the folder and filename in the pages directory exactly
    window.location.href = "/Inventory/AddNewAsset";
  };

  return (
    <Button 
      onClick={goToNewPage}
      className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white"
    >
      <FaCirclePlus /> Add New Asset
    </Button>
  )
}