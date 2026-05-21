import { columns} from "@/components/features/Inventory/InventoryColumns"
import type { Inventory } from "../Inventory/InventoryColumns"
import { InventoryTable } from "./InventoryTable" 
import { InventoryAddNewAsset } from "./InventoryAddNewAsset"

async function getData(): Promise<Inventory[]> {
  
  return [
    {  asset: "LAP-01", name: "MacBook", purchase: "2023", warranty: "Active", status: "Available" }
  ]
}

export default async function DemoPage() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10 space-y-4">
      <div className="flex justify-end">
        
        <InventoryAddNewAsset />
      </div>
      <InventoryTable columns={columns} data={data} />
    </div>
  )
}