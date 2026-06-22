"use client"

import * as React from "react"
import { InventoryAddNewAsset } from "@/components/features/Inventory/InventoryAddNewAsset"
import { InventoryTable } from "@/components/features/Inventory/InventoryTable"
import { apiRequest } from "@/lib/apiService";
export default function InventoryPage() {
  const [inventoryData, setInventoryData] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function fetchAssets() {
      try {
        setIsLoading(true);
        setError(null);
        
       
        const response = await apiRequest("/asset", "GET");
        
       
        const liveAssets = response?.data?.data || response?.data || [];
        setInventoryData(liveAssets);
      } catch (err: any) {
        console.error("Failed to load inventory assets:", err);
        setError(err.message || "An unexpected network connection issue occurred.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchAssets();
  }, []);

  return (
    <div className="pt-6 px-8 pb-8 space-y-4 min-h-screen bg-[#F3F0F7]">
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight  text-blue-800">
            Inventory
          </h1>
        </div>
        <InventoryAddNewAsset />
      </div>

      {isLoading ? (
        <div className="flex flex-col justify-center items-center h-48 space-y-2 text-slate-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
          <p className="text-sm">Loading...</p>
        </div>
      ) : error ? (
        <div className="space-y-4">
          <div className="bg-amber-50 text-amber-800 p-4 rounded-xl border border-amber-200 text-sm">
            💡 <strong>Notice:</strong> Temporary connection issue. (Reason: {error})
          </div>
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden opacity-75">
            <InventoryTable data={inventoryData} />
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <InventoryTable data={inventoryData} />
        </div>
      )}
      
    </div>
  )
}