"use client"

import * as React from "react"
import { InventoryAddNewAsset } from "@/components/features/Inventory/InventoryAddNewAsset"
import type { Inventory } from "@/components/features/Inventory/InventoryColumns"
import { InventoryTable } from "@/components/features/Inventory/InventoryTable"

// Rich mock data populated with correct property fields matching your components
const defaultMockData: any[] = [
  { 
    id: "AF-LP-1011", 
    asset: "AF-LP-1011", 
    name: "MacBook Pro M3", 
    category: "Laptops", 
    model: "Apple M3 Pro", 
    ram: "18 GB", 
    storage: "512 GB SSD", 
    purchase: "Oct 12 2024", 
    purchaseDate: "2024-10-12", 
    warranty: "2 years", 
    status: "Pending" 
  },
  { 
    id: "AF-LP-1012", 
    asset: "AF-LP-1012", 
    name: "RedmiBook Pro 15", 
    category: "Laptops", 
    model: "Intel Core i7", 
    ram: "16 GB", 
    storage: "1 TB SSD", 
    purchase: "Oct 12 2022", 
    purchaseDate: "2022-10-12", 
    warranty: "Expired", 
    status: "Pending" 
  },
  { 
    id: "AF-LP-1013", 
    asset: "AF-LP-1013", 
    name: "MSI Stealth 16", 
    category: "Laptops", 
    model: "NVIDIA RTX 4070", 
    ram: "32 GB", 
    storage: "1 TB SSD", 
    purchase: "Oct 12 2023", 
    purchaseDate: "2023-10-12", 
    warranty: "6 months", 
    status: "Assigned" 
  },
  { 
    id: "AF-LP-1014", 
    asset: "AF-LP-1014", 
    name: "HP Pavilion 14", 
    category: "Laptops", 
    model: "AMD Ryzen 5", 
    ram: "8 GB", 
    storage: "256 GB SSD", 
    purchase: "Oct 12 2023", 
    purchaseDate: "2023-10-12", 
    warranty: "1 year", 
    status: "Maintenance" 
  },
  { 
    id: "AF-LP-1015", 
    asset: "AF-LP-1015", 
    name: "MacBook Air 13", 
    category: "Laptops", 
    model: "Apple M2", 
    ram: "8 GB", 
    storage: "256 GB SSD", 
    purchase: "Oct 12 2023", 
    purchaseDate: "2023-10-12", 
    warranty: "3 years", 
    status: "Available" 
  },
  { 
    id: "AF-LP-1016", 
    asset: "AF-LP-1016", 
    name: "MSI Raider GE78", 
    category: "Laptops", 
    model: "Intel i9 High-End", 
    ram: "64 GB", 
    storage: "2 TB SSD", 
    purchase: "Oct 12 2023", 
    purchaseDate: "2023-10-12", 
    warranty: "6 months", 
    status: "Available" 
  },
  { 
    id: "TAB-001", 
    asset: "TAB-001", 
    name: "iPad Pro 11\"", 
    category: "Accessories", 
    model: "Apple M1", 
    ram: "8 GB", 
    storage: "128 GB", 
    purchase: "Nov 05 2022", 
    purchaseDate: "2022-11-05", 
    warranty: "6 months", 
    status: "Available" 
  },
  { 
    id: "MON-002", 
    asset: "MON-002", 
    name: "Samsung Odyssey G7", 
    category: "Monitors", 
    model: "LC32G75TQSNXZA", 
    ram: "N/A", 
    storage: "N/A", 
    purchase: "Jan 20 2021", 
    purchaseDate: "2021-01-20", 
    warranty: "Expired", 
    status: "Maintenance" 
  },
  { 
    id: "HEA-001", 
    asset: "HEA-001", 
    name: "Sony WH-1000XM5", 
    category: "Accessories", 
    model: "Wireless Noise Cancelling", 
    ram: "N/A", 
    storage: "N/A", 
    purchase: "Sep 30 2023", 
    purchaseDate: "2023-09-30", 
    warranty: "3 years", 
    status: "Available" 
  },
  { 
    id: "MOU-001", 
    asset: "MOU-001", 
    name: "Logitech MX Master 3", 
    category: "Accessories", 
    model: "Advanced Wireless Mouse", 
    ram: "N/A", 
    storage: "N/A", 
    purchase: "Jun 01 2023", 
    purchaseDate: "2023-06-01", 
    warranty: "2 years", 
    status: "Maintenance" 
  },
];

const InventoryPage = () => {
  // SEED LOGIC: Sync structural mutations without breaking custom additions
  React.useEffect(() => {
    const existingCache = localStorage.getItem("inventory_data");
    
    if (!existingCache) {
      localStorage.setItem("inventory_data", JSON.stringify(defaultMockData));
    } else {
      try {
        const parsedCache = JSON.parse(existingCache);
        // If local entries exist but don't have the new specification properties, upgrade them safely
        const needsUpgrade = parsedCache.some((item: any) => !item.hasOwnProperty('model'));
        
        if (needsUpgrade || parsedCache.length < 3) {
          localStorage.setItem("inventory_data", JSON.stringify(defaultMockData));
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