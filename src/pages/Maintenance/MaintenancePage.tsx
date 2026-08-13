"use client";

import { useEffect, useState } from "react";
import { MaintenanceTable } from "@/components/features/Maintenance/MaintenanceTable";
import { apiFetch } from "@/lib/api";
import { IoCloudDownloadOutline } from "react-icons/io5";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function MaintenancePage() {
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchMaintenance = async () => {
    try {
      setLoading(true); 
      const result = await apiFetch("/maintenance");
      const list = result?.data ?? [];

      const formatted = list.map((item: any) => {
        const rawStatus = (item.status ?? "").toLowerCase().trim();
        
        let displayStatus = "Cancel"; 
        if (rawStatus === "requested" || rawStatus === "request") {
          displayStatus = "Request";
        } else if (rawStatus === "approved") {
          displayStatus = "Approved";
        } else if (["cancel", "cancelled", "reject", "rejected"].includes(rawStatus)) {
          displayStatus = "Cancelled";
        } else if (rawStatus === "returned") {
          displayStatus = "Returned";
        } else if (rawStatus === "complete" || rawStatus === "completed") {
          displayStatus = "Complete";
        }

        return {
          ...item,
          id: item.id,
          employee_name: item.user?.name ?? "-",
          asset_code: item.asset?.asset_code ?? "-",
          category: item.category?.name ?? item.asset?.category?.name ?? item.category_name ?? "-",
          approver: item.accepted_by?.name ?? "—",
          maintenance_date: item.maintenance_date ?? "",
          completed_date: item.completed_date ?? "",
          remark: item.remark ?? "",
          status: displayStatus,
          user: item.user,
          asset: item.asset,
          category_obj: item.category,
          asset_id: item.asset?.id ?? item.asset_id ?? item.assets_id ?? null,
        };
      });

      setMaintenanceData(formatted);
    } catch (err) {
      console.error("API Error:", err);
      setMaintenanceData([]);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchMaintenance();
  }, []);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Maintenance Report", 14, 20);
    
    const tableData = maintenanceData.map((item: any, index) => [
      index + 1,
      item.employee_name,
      item.asset_code,
      item.category,
      item.maintenance_date,
      item.status
    ]);

    autoTable(doc, {
      startY: 30,
      head: [['No', 'Employee', 'Asset Code', 'Category', 'Date', 'Status']],
      body: tableData,
      headStyles: { fillColor: [30, 64, 175] },
      theme: 'striped'
    });

    doc.save("Maintenance_Report.pdf");
  };

  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7C3AED]"></div>
      </div>
    );
  }

  return (
    <div className="pt-6 px-8 pb-8 min-h-screen space-y-4 bg-[#e9e5ff]"> 
      {/* Header Container */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-[#7C3AED]">
          Maintenance
        </h1>
        <button
          onClick={handleExportPDF}
          className="px-4 py-2 bg-[#7C3AED] border border-slate-300 text-white rounded-lg transition-colors text-lg font-medium shadow-sm flex items-center gap-2 hover:bg-purple-700"
        >
          <IoCloudDownloadOutline size={20} />
        </button>
      </div>

      <MaintenanceTable data={maintenanceData} onRefresh={fetchMaintenance} />
    </div>
  );
}
