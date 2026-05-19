import { InventoryAddNewAsset } from "@/components/features/Inventory/InventoryAddNewAsset"
import { columns } from "@/components/features/Inventory/InventoryColumns"
import type { Inventory } from "@/components/features/Inventory/InventoryColumns"
import { InventoryTable } from "@/components/features/Inventory/InventoryTable"

const data: Inventory[] = [
  
  { asset: "AF-LP-1011", name: "MacBook Pro M2", purchase: "Oct 12 2023", warranty: "2 years", status: "Assigned" },
  {  asset: "AF-LP-1012", name: "RedmiBook",  purchase: "Oct 12 2022", warranty: "Expired", status: "Maintenance" },
  {  asset: "AF-LP-1013", name: "Msi Stealth",  purchase: "Oct 12 2023", warranty: "6 months", status: "Assigned" },
  {  asset: "AF-LP-1014", name: "HP Pavilion",  purchase: "Oct 12 2023", warranty: "1 years", status: "Maintenance" },
  { asset: "AF-LP-1015", name: "MacBook Air 13", purchase: "Oct 12 2023", warranty: "3 years", status: "Available" },
  { asset: "AF-LP-1016", name: "Msi Gaming",  purchase: "Oct 12 2023", warranty: "6 months", status: "Available" },
   { asset: "AF-LP-1011", name: "MacBook Pro M2", purchase: "Oct 12 2023", warranty: "2 years", status: "Assigned" },
  {  asset: "AF-LP-1012", name: "RedmiBook",  purchase: "Oct 12 2022", warranty: "Expired", status: "Maintenance" },
  {  asset: "AF-LP-1013", name: "Msi Stealth",  purchase: "Oct 12 2023", warranty: "6 months", status: "Assigned" },
  {  asset: "AF-LP-1014", name: "HP Pavilion",  purchase: "Oct 12 2023", warranty: "1 years", status: "Maintenance" },
  { asset: "AF-LP-1015", name: "MacBook Air 13", purchase: "Oct 12 2023", warranty: "3 years", status: "Available" },
  { asset: "AF-LP-1016", name: "Msi Gaming",  purchase: "Oct 12 2023", warranty: "6 months", status: "Available" },
   { asset: "AF-LP-1011", name: "MacBook Pro M2", purchase: "Oct 12 2023", warranty: "2 years", status: "Assigned" },
  {  asset: "AF-LP-1012", name: "RedmiBook",  purchase: "Oct 12 2022", warranty: "Expired", status: "Maintenance" },
  {  asset: "AF-LP-1013", name: "Msi Stealth",  purchase: "Oct 12 2023", warranty: "6 months", status: "Assigned" },
  {  asset: "AF-LP-1014", name: "HP Pavilion",  purchase: "Oct 12 2023", warranty: "1 years", status: "Maintenance" },
  { asset: "AF-LP-1015", name: "MacBook Air 13", purchase: "Oct 12 2023", warranty: "3 years", status: "Available" },
  { asset: "AF-LP-1016", name: "Msi Gaming",  purchase: "Oct 12 2023", warranty: "6 months", status: "Available" },
   { asset: "AF-LP-1011", name: "MacBook Pro M2", purchase: "Oct 12 2023", warranty: "2 years", status: "Assigned" },
  {  asset: "AF-LP-1012", name: "RedmiBook",  purchase: "Oct 12 2022", warranty: "Expired", status: "Maintenance" },
  {  asset: "AF-LP-1013", name: "Msi Stealth",  purchase: "Oct 12 2023", warranty: "6 months", status: "Assigned" },
  {  asset: "AF-LP-1014", name: "HP Pavilion",  purchase: "Oct 12 2023", warranty: "1 years", status: "Maintenance" },
  { asset: "AF-LP-1015", name: "MacBook Air 13", purchase: "Oct 12 2023", warranty: "3 years", status: "Available" },
  { asset: "AF-LP-1016", name: "Msi Gaming",  purchase: "Oct 12 2023", warranty: "6 months", status: "Available" },
   { asset: "AF-LP-1011", name: "MacBook Pro M2", purchase: "Oct 12 2023", warranty: "2 years", status: "Assigned" },
  {  asset: "AF-LP-1012", name: "RedmiBook",  purchase: "Oct 12 2022", warranty: "Expired", status: "Maintenance" },
  {  asset: "AF-LP-1013", name: "Msi Stealth",  purchase: "Oct 12 2023", warranty: "6 months", status: "Assigned" },
  {  asset: "AF-LP-1014", name: "HP Pavilion",  purchase: "Oct 12 2023", warranty: "1 years", status: "Maintenance" },
  { asset: "AF-LP-1015", name: "MacBook Air 13", purchase: "Oct 12 2023", warranty: "3 years", status: "Available" },
  { asset: "AF-LP-1016", name: "Msi Gaming",  purchase: "Oct 12 2023", warranty: "6 months", status: "Available" },
  
  
  {  asset: "TAB-001", name: "iPad Pro 11\"",  purchase: "Nov 05 2022", warranty: "6 months", status: "Available" },
  {  asset: "MON-002", name: "Samsung Odyssey G7",  purchase: "Jan 20 2021", warranty: "Expired", status: "Maintenance" },
  {  asset: "HEA-001", name: "Sony WH-1000XM5",  purchase: "Sep 30 2023", warranty: "3 years", status: "Available" },
  {  asset: "MOU-001", name: "Logitech MX Master 3",purchase: "Jun 01 2023", warranty: "2 years", status: "Maintenance" },
];

const InventoryPage = () => {
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
        <InventoryTable columns={columns} data={data} />
      </div>
      
    </div>
  )
}

export default InventoryPage;