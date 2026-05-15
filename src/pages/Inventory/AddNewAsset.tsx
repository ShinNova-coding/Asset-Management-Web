import React from 'react'
import { Button } from "@/components/ui/button"

export default function AddNewAssetPage() {
  const goBack = () => {
    // This returns the user to your main table page
    window.location.href = "/Inventory/InventoryPage";
  };

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Add New Asset</h1>
      
      <div className="p-8 border rounded-xl bg-white shadow-sm">
        <p className="text-gray-600 mb-6 font-medium">
          Enter the new asset information below.
        </p>
        
        {/* Your form fields will go here later */}
        
        <div className="pt-4 border-t">
          <Button variant="outline" onClick={goBack}>
            Back to Inventory Table
          </Button>
        </div>
      </div>
    </div>
  )
}