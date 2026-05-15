import { InventoryAddNewAsset } from "@/components/features/Inventory/InventoryAddNewAsset"

import {
  columns
} from "@/components/features/Inventory/InventoryColumns"
import type { Inventory } from "@/components/features/Inventory/InventoryColumns"
import { InventoryTable } from "@/components/features/Inventory/InventoryTable"

const data: Inventory[] = [
  
  
  { id: "1", asset: "LAP-001", name: "MacBook Pro M2", no: "SN12345", purchase: "2023-01-10", warranty: "Active", status: "Available" },
  { id: "2", asset: "LAP-002", name: "Dell XPS 15", no: "SN67890", purchase: "2022-05-20", warranty: "Expired", status: "Deployed" },
  { id: "3", asset: "MON-001", name: "LG UltraWide 34\"", no: "SN11223", purchase: "2023-03-15", warranty: "Active", status: "Available" },
  { id: "4", asset: "MOU-001", name: "Logitech MX Master 3", no: "SN44556", purchase: "2023-06-01", warranty: "Active", status: "In Repair" },
  { id: "5", asset: "KEY-001", name: "Keychron K2 V2", no: "SN77889", purchase: "2021-12-10", warranty: "Expired", status: "Available" },

  // Page 2 Items
  { id: "6", asset: "LAP-003", name: "Lenovo ThinkPad X1", no: "SN99001", purchase: "2023-08-12", warranty: "Active", status: "Deployed" },
  { id: "7", asset: "TAB-001", name: "iPad Pro 11\"", no: "SN22334", purchase: "2022-11-05", warranty: "Active", status: "Available" },
  { id: "8", asset: "MON-002", name: "Samsung Odyssey G7", no: "SN55667", purchase: "2021-01-20", warranty: "Expired", status: "In Repair" },
  { id: "9", asset: "HEA-001", name: "Sony WH-1000XM5", no: "SN88990", purchase: "2023-09-30", warranty: "Active", status: "Available" },
  { id: "10", asset: "LAP-004", name: "HP Spectre x360", no: "SN11122", purchase: "2022-07-15", warranty: "Expired", status: "Deployed" },

  {
    id: "1",
    
    asset: "AF-LP-1011",
    warranty:"Exp.Oct 2026",
    purchase:"Oct 12 2023",
    no:"1",
    name:"MacBook Pro",
    status:"Deployed",
  },
   {
    id: "6",
    
    asset: "AF-LP-1014",
    warranty:"Exp.Oct 2027",
    purchase:"Oct 12 2023",
    no:"2",
    name:"Msi",
    status:"Available",
  },
  
  {
    id: "2",
    asset: "AF-LP-1012",
    warranty:"Expired",
    purchase:"Oct 12 2022",
    no:"2",
    name:"RedmiBook",
    status:"In Repair",
  },
  {
    id: "3",
    asset: "AF-LP-1013",
    warranty:"Exp.Dec 2026",
    purchase:"Oct 12 2023",
    no:"3",
    name:"Msi",
    status:"Deployed",
  },
  {
    id: "4",
    asset: "AF-LP-1014",
    warranty:"Exp.Jan 2027",
    purchase:"Oct 12 2023",
    no:"4",
    name:"HP",
    status:"In Repair",
  },
  {
    id: "5",
    asset: "AF-LP-1015",
    warranty:"Exp.Feb 2027",
    purchase:"Oct 12 2023",
    no:"5",
    name:"MacBook Air 13",
    status:"Available",
  },
  
]

const InventoryPage = () => {
  return (
    <div className="p-10 space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          Inventory
        </h1>

        <InventoryAddNewAsset />
      </div>

      {/* TABLE */}
      <InventoryTable columns={columns} data={data} />
      
    </div>
  )
}

export default InventoryPage