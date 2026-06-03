"use client"

import * as React from "react"
import { InventoryAddNewAsset } from "@/components/features/Inventory/InventoryAddNewAsset"
import { InventoryTable } from "@/components/features/Inventory/InventoryTable"

export default function InventoryPage() {
  const [inventoryData, setInventoryData] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function fetchAssets() {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch("http://192.168.100.185:1010/api/asset", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
        })

        if (!response.ok) {
          throw new Error(`Server returned status code: ${response.status}`)
        }

        const jsonPayload = await response.json()
        
        // Destructures nested pagination structures safely
        const liveAssets = jsonPayload?.data?.data || jsonPayload?.data || []
        
        setInventoryData(liveAssets)
      } catch (err: any) {
        console.error("Failed to load inventory assets:", err)
        setError(err.message || "An unexpected network connection issue occurred.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAssets()
  }, [])

  return (
    <div className="p-10 space-y-6 min-h-screen bg-slate-50/30">
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Inventory
          </h1>
        </div>
        <InventoryAddNewAsset />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-sm font-medium text-slate-500 animate-pulse">
            Loading...
          </div>
        ) : error ? (
          <div className="p-12 text-center text-sm font-semibold text-red-500 bg-red-50/50">
            ⚠️ {error}
          </div>
        ) : (
          <InventoryTable data={inventoryData} />
        )}
      </div>
      
    </div>
  )
}