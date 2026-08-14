"use client"

import * as React from "react"
import { InventoryAddNewAsset } from "@/components/features/Inventory/InventoryAddNewAsset"
import { InventoryTable } from "@/components/features/Inventory/InventoryTable"
import { apiRequest } from "@/lib/apiService";
import { IoCloudDownloadOutline } from "react-icons/io5";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function InventoryPage() {
  const [inventoryData, setInventoryData] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function fetchAssets() {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await apiRequest("/asset", "GET");
        const liveAssets = response?.data?.data || response?.data || [];
        setInventoryData(liveAssets);
      } catch (err: any) {
        console.error("Failed to load inventory assets:", err);
        setError(err.message || "An unexpected network connection issue occurred.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchAssets();
  }, []);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("Inventory Report", 14, 20);
    
    const tableData = inventoryData.map((item, index) => [
      index + 1,
      item.name || "N/A",
      item.asset_code || "N/A",
      item.purchased_date || "N/A", 
      item.warranty_period ? `${item.warranty_period} months` : "N/A", 
      item.status || "N/A"
    ]);
    
    autoTable(doc, {
      startY: 30,
      head: [['No', 'Name', 'Asset Code', 'Purchased Date', 'Warranty', 'Status']],
      body: tableData,
      headStyles: { fillColor: [30, 64, 175] }, 
      theme: 'striped'
    });

    doc.save("Inventory_Report.pdf");
  };

  return (
    <div className="pt-6 px-8 pb-8 space-y-4 min-h-screen bg-[#e9e5ff]">
      {isLoading ? (
       <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7C3AED]"></div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#7C3AED]">
                Inventory
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportPDF}
                className="px-4 py-2 bg-[#7C3AED] border border-slate-300 text-white rounded-lg transition-colors text-lg font-medium shadow-sm flex items-center gap-2"
              >
                <IoCloudDownloadOutline size={16} />
              </button>
              
              <InventoryAddNewAsset />
            </div>
          </div>

          {error ? (
            <div className="space-y-4">
              <div className="bg-amber-50 text-amber-800 p-4 rounded-xl border border-amber-200 text-sm">
                  <strong>Notice:</strong> Temporary connection issue. (Reason: {error})
              </div>
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden opacity-75">
                <InventoryTable data={inventoryData} />
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <InventoryTable data={inventoryData} />
            </div>
          )}
        </>
      )}
    </div>
  )
}
