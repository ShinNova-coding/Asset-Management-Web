"use client"

import * as React from "react"
import { InventoryAddNewAsset } from "@/components/features/Inventory/InventoryAddNewAsset"
import { columns } from "@/components/features/Inventory/InventoryColumns"
import type { Inventory } from "@/components/features/Inventory/InventoryColumns"
import { InventoryTable } from "@/components/features/Inventory/InventoryTable"

const defaultMockData: Inventory[] = [
  { asset: "AF-LP-1011", name: "MacBook Pro M2", purchase: "Oct 12 2023", warranty: "2 years", status: "Assigned" },
  { asset: "AF-LP-1012", name: "RedmiBook", purchase: "Oct 12 2022", warranty: "Expired", status: "Maintenance" },
  { asset: "AF-LP-1013", name: "Msi Stealth", purchase: "Oct 12 2023", warranty: "6 months", status: "Assigned" },
  { asset: "AF-LP-1014", name: "HP Pavilion", purchase: "Oct 12 2023", warranty: "1 years", status: "Maintenance" },
  { asset: "AF-LP-1015", name: "MacBook Air 13", purchase: "Oct 12 2023", warranty: "3 years", status: "Available" },
  { asset: "AF-LP-1016", name: "Msi Gaming", purchase: "Oct 12 2023", warranty: "6 months", status: "Available" },
  { asset: "AF-LP-1011_2", assetIdAlt: "AF-LP-1011", name: "MacBook Pro M2", purchase: "Oct 12 2023", warranty: "2 years", status: "Assigned" },
  { asset: "AF-LP-1012_2", name: "RedmiBook", purchase: "Oct 12 2022", warranty: "Expired", status: "Maintenance" },
  { asset: "AF-LP-1013_2", name: "Msi Stealth", purchase: "Oct 12 2023", warranty: "6 months", status: "Assigned" },
  { asset: "AF-LP-1014_2", name: "HP Pavilion", purchase: "Oct 12 2023", warranty: "1 years", status: "Maintenance" },
  { asset: "AF-LP-1015_2", name: "MacBook Air 13", purchase: "Oct 12 2023", warranty: "3 years", status: "Available" },
  { asset: "AF-LP-1016_2", name: "Msi Gaming", purchase: "Oct 12 2023", warranty: "6 months", status: "Available" },
  { asset: "TAB-001", name: "iPad Pro 11\"", purchase: "Nov 05 2022", warranty: "6 months", status: "Available" },
  { asset: "MON-002", name: "Samsung Odyssey G7", purchase: "Jan 20 2021", warranty: "Expired", status: "Maintenance" },
  { asset: "HEA-001", name: "Sony WH-1000XM5", purchase: "Sep 30 2023", warranty: "3 years", status: "Available" },
  { asset: "MOU-001", name: "Logitech MX Master 3", purchase: "Jun 01 2023", warranty: "2 years", status: "Maintenance" },
];

const InventoryPage = () => {
  // SEED LOGIC: This ensures the defaults exist in storage BEFORE the table reads from it
  React.useEffect(() => {
    const existingCache = localStorage.getItem("inventory_data");
    
    if (!existingCache) {
      // If the app has completely clean storage, write down our mock list rows as a starting base
      localStorage.setItem("inventory_data", JSON.stringify(defaultMockData));
    } else {
      try {
        const parsedCache = JSON.parse(existingCache);
        // If your storage only has 1 or 2 test entries from earlier, let's merge them back into the mock list securely
        if (parsedCache.length < 5) {
          const freshMerge = [...parsedCache, ...defaultMockData.filter(d => !parsedCache.some((p: any) => p.asset === d.asset))];
          localStorage.setItem("inventory_data", JSON.stringify(freshMerge));
        }
      } catch (e) {
        console.error("Cache reset runtime check recovery: ", e);
      }
    }
  }, []);

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
        <InventoryTable data={defaultMockData} />
      </div>
      
    </div>
  )
}

export default InventoryPage;