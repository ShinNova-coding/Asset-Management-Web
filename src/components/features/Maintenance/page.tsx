import { columns } from "@/components/features/Maintenance/MaintenanceColumns"
import type {  Maintenance } from "../Maintenance/MaintenanceColumns"
import { MaintenanceTable } from "./MaintenanceTable" 



async function getData(): Promise<Maintenance[]> {
  
  return [
    {  asset: "LAP-01", name: "MacBook", purchase: "2023", warranty: "Active", status: "Available" }
  ]
}

export default async function DemoPage() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10 space-y-4">
      <div className="flex justify-end">
        
    
      </div>
      <MaintenanceTable columns ={columns} data={data} />
    </div>
  )
}