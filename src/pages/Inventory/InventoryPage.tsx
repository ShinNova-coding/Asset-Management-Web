import { InventoryAddNewAsset } from "@/components/features/Inventory/InventoryAddNewAsset"
import { columns } from "@/components/features/Inventory/InventoryColumns"
import type { Inventory } from "@/components/features/Inventory/InventoryColumns"
import { InventoryTable } from "@/components/features/Inventory/InventoryTable"

const data: Inventory[] = [
  // Laptops & Main Hardware
  { id: "1", asset: "AF-LP-1011", name: "MacBook Pro M2", no: "SN-99210", purchase: "Oct 12 2023", warranty: "Exp. Oct 2026", status: "Deployed" },
  { id: "2", asset: "AF-LP-1012", name: "RedmiBook", no: "SN-88211", purchase: "Oct 12 2022", warranty: "Expired", status: "In Repair" },
  { id: "3", asset: "AF-LP-1013", name: "Msi Stealth", no: "SN-77322", purchase: "Oct 12 2023", warranty: "Exp. Dec 2026", status: "Deployed" },
  { id: "4", asset: "AF-LP-1014", name: "HP Pavilion", no: "SN-66433", purchase: "Oct 12 2023", warranty: "Exp. Jan 2027", status: "In Repair" },
  { id: "5", asset: "AF-LP-1015", name: "MacBook Air 13", no: "SN-55444", purchase: "Oct 12 2023", warranty: "Exp. Feb 2027", status: "Available" },
  { id: "6", asset: "AF-LP-1016", name: "Msi Gaming", no: "SN-44555", purchase: "Oct 12 2023", warranty: "Exp. Oct 2027", status: "Available" },
  
  // Peripherals & Accessories
  { id: "7", asset: "TAB-001", name: "iPad Pro 11\"", no: "SN-22334", purchase: "Nov 05 2022", warranty: "Active", status: "Available" },
  { id: "8", asset: "MON-002", name: "Samsung Odyssey G7", no: "SN-55667", purchase: "Jan 20 2021", warranty: "Expired", status: "In Repair" },
  { id: "9", asset: "HEA-001", name: "Sony WH-1000XM5", no: "SN-88990", purchase: "Sep 30 2023", warranty: "Active", status: "Available" },
  { id: "10", asset: "MOU-001", name: "Logitech MX Master 3", no: "SN-44556", purchase: "Jun 01 2023", warranty: "Active", status: "In Repair" },
];

const InventoryPage = () => {
  return (
    <div className="p-10 space-y-6 min-h-screen bg-slate-50/30">
      
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Inventory
          </h1>
          
        </div>

        {/* The button component from features/Inventory/InventoryAddNewAsset */}
        <InventoryAddNewAsset />
      </div>

      {/* TABLE SECTION */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <InventoryTable columns={columns} data={data} />
      </div>
      
    </div>
  )
}

export default InventoryPage;