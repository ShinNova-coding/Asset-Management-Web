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
        
        let displayStatus = "Complete"; 
        if (rawStatus === "requested" || rawStatus === "request") {
          displayStatus = "Request";
        } else if (rawStatus === "approved") {
          displayStatus = "Approved";
        } else if (rawStatus === "completed" || rawStatus === "complete") {
          displayStatus = "Complete";
        }
        else if (rawStatus === "returned") {
          displayStatus = "Returned";
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
      
      <h1 className="text-2xl font-bold tracking-tight text-blue-500">
        Maintenance
      </h1>
      

      <MaintenanceTable data={maintenanceData} onRefresh={fetchMaintenance} />
    </div>
  );
}