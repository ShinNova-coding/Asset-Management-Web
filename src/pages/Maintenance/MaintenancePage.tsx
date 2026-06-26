"use client" 

import { useEffect, useState } from "react";
import { MaintenanceTable } from "@/components/features/Maintenance/MaintenanceTable";
import { apiFetch } from "@/lib/api";

export default function MaintenancePage() {
  const [maintenanceData, setMaintenanceData] = useState([]);

  const fetchMaintenance = async () => {
    try {
      const result = await apiFetch("/maintenance");
      const list = result?.data ?? [];

      const formatted = list.map((item: any) => {
        const rawStatus = (item.status ?? "").toLowerCase().trim();
        
       let displayStatus = "Cancel"; 
        
        if (rawStatus === "requested" || rawStatus === "request") {
          displayStatus = "Request";
        } else if (rawStatus === "approved") {
          displayStatus = "Approved";
        } 
        
        else if (rawStatus === "cancel" || rawStatus === "cancelled" || rawStatus === "reject" || rawStatus === "rejected") {
          displayStatus = "Cancelled";
        } else if (rawStatus === "returned") {
          displayStatus = "Returned";
        } 
        
        else if (rawStatus === "complete" || rawStatus === "completed") {
          displayStatus = "Complete";
        }
        return {
          id: item.id,
          employee_name: item.user?.name ?? "-",
          asset_code: item.asset?.asset_code ?? "-",
          category: item.category?.name ?? "-",
          approver: item.accepted_by?.name ?? "—",
          maintenance_date: item.maintenance_date ?? "",
          completed_date: item.completed_date ?? "",
          remark: item.remark ?? "",
          status: displayStatus, 

          user: item.user,
          asset: item.asset,
          category_obj: item.category,
          accepted_by: item.accepted_by
        };
      });

      setMaintenanceData(formatted);

    } catch (err) {
      console.error("API Error:", err);
      setMaintenanceData([]);
    }
  };

  useEffect(() => {
    fetchMaintenance();
  }, []);


  return (
    <div className=" space-y-2"> 
      
      <h1 className="text-2xl font-bold tracking-tight text-blue-800">
        Maintenance
      </h1>
      

      <MaintenanceTable data={maintenanceData} onRefresh={fetchMaintenance} />
    </div>
  );
}