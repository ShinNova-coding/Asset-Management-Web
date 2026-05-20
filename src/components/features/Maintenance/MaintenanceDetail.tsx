"use client"

import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { FiArrowLeft, FiCalendar, FiClock, FiCheckCircle, FiAlertCircle, FiRefreshCw } from "react-icons/fi"

export function InventoryDetail() {
  const location = useLocation()
  const navigate = useNavigate()
  
  const item = location.state?.item

 
  if (!item) {
    return (
      <div className="flex h-screen flex-col items-center justify-center space-y-4">
        <p className="text-slate-500">No asset data found.</p>
       
        <Button onClick={() => navigate("/inventory")}>Back to Inventory</Button>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    const base = "flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full w-fit "
    switch (status?.toLowerCase()) {
      case "available":
        return <span className={base + "bg-green-100 text-green-700"}><FiCheckCircle /> Available</span>
      case "returned":
        return <span className={base + "bg-blue-100 text-blue-700"}><FiRefreshCw /> Returned</span>
      case "maintenance":
        return <span className={base + "bg-amber-100 text-amber-700"}><FiAlertCircle /> Maintenance</span>
      default:
        return <span className={base + "bg-slate-100 text-slate-700"}>{status}</span>
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
     
      <Button 
        variant="ghost" 
        size="sm" 
        
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
      >
        <FiArrowLeft size={16} />
        Back to Inventory List
      </Button>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
       
        <div className="h-32 bg-linear-to-r from-blue-300 to-indigo-200 p-6 flex items-end">
          <div className="space-y-1 translation-y-4 translate-y-8">
            <h1 className="text-3xl font-bold text-slate-900 drop-shadow-sm bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-xl border border-white/50 w-fit">
              {item.name || "MacBook Pro"}
            </h1>
          </div>
        </div>

        <div className="p-6 pt-12 space-y-6">
          
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Operational Status</span>
            {getStatusBadge(item.status || "Returned")}
          </div>

          <hr className="border-slate-100" />
        
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-50 text-slate-500 rounded-lg border border-slate-100">
                <FiCalendar size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-medium">Acquisition Date</span>
                <span className="text-sm font-semibold text-slate-800">
                  {item.date || "Oct 2, 2023"}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-slate-50 text-slate-500 rounded-lg border border-slate-100">
                <FiClock size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-medium">Warranty Duration</span>
                <span className="text-sm font-semibold text-slate-800">
                  {item.warranty || "2 Years"}
                </span>
              </div>
            </div>

            <div className="flex flex-col col-span-1 sm:col-span-2 bg-slate-50 rounded-xl p-4 border border-slate-100">
              <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase mb-1">System Registry Details</span>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Asset Tracking Number:</span>
                <code className="bg-white px-2 py-0.5 rounded border border-slate-200 text-xs font-mono font-bold text-slate-700">
                  {item.asset || "AST-2023-0094"}
                </code>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}