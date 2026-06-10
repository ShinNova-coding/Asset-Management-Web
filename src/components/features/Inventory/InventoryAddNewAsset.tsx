"use client"

import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { FaCirclePlus } from "react-icons/fa6"

export function InventoryAddNewAsset() {
  const navigate = useNavigate()

  const goToNewPage = () => {
    
    navigate("/inventory/add")
  }

  return (
    <Button 
      onClick={goToNewPage}
      className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
    >
      <FaCirclePlus size={16} /> Add New Asset
    </Button>
  )
}