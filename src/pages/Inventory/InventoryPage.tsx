import { InventoryAddNewAsset } from "@/components/features/Inventory/InventoryAddNewAsset"

import {
  columns
} from "@/components/features/Inventory/InventoryColumns"
import type { Inventory } from "@/components/features/Inventory/InventoryColumns"
import { InventoryTable } from "@/components/features/Inventory/InventoryTable"

const data: Inventory[] = [
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
    id: "2",
    asset: "AF-LP-1012",
    warranty:"Exp.Nov 2026",
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
    status:"In Repair",
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
    name:"MacBook Pro",
    status:"In Repair",
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