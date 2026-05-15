import { columns, Inventory } from "@/components/features/Inventory/InventoryColumns"
import { InventoryTable } from "./InventoryTable" // Your Table component
import { InventoryAddNewAsset } from "./InventoryAddNewAsset"

async function getData(): Promise<Inventory[]> {
  // Logic to fetch your data
  return [
    { id: "1", asset: "LAP-01", name: "MacBook", no: "SN1", purchase: "2023", warranty: "Active", status: "Available" }
  ]
}

export default async function DemoPage() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10 space-y-4">
      <div className="flex justify-end">
        {/* Put the client button here */}
        <InventoryAddNewAsset />
      </div>
      <InventoryTable columns={columns} data={data} />
    </div>
  )
}