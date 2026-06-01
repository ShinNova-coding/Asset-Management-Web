// src/layouts/ApprovalCards.tsx
"use client"

import { useState, useEffect } from "react"
import { FiCheckCircle, FiXCircle, FiUser, FiBox, FiLayers, FiFileText } from "react-icons/fi"

export function ApprovalCard() {
  const [activeRequest, setActiveRequest] = useState<any>(null)

  const loadActiveRequest = () => {
    const data = localStorage.getItem("active_approval_request")
    if (data) {
      setActiveRequest(JSON.parse(data))
    } else {
      setActiveRequest(null)
    }
  }

  useEffect(() => {
    loadActiveRequest()
    
    // Listen for direct clicks and parent data structural shifts
    window.addEventListener("activeRequestChanged", loadActiveRequest)
    window.addEventListener("master_storage_update", loadActiveRequest)
    
    return () => {
      window.removeEventListener("activeRequestChanged", loadActiveRequest)
      window.removeEventListener("master_storage_update", loadActiveRequest)
    }
  }, [])

  const updateRequestStatus = (newStatus: "approved" | "rejected") => {
    if (!activeRequest) return

    const allRequestsRaw = localStorage.getItem("dashboard_requests")
    if (allRequestsRaw) {
      const allRequests = JSON.parse(allRequestsRaw)
      
      // If clicked reject inside this card, delete completely from array database
      let updatedRequests
      if (newStatus === "rejected") {
        updatedRequests = allRequests.filter((req: any) => req.id !== activeRequest.id)
        localStorage.removeItem("active_approval_request")
        setActiveRequest(null)
      } else {
        // If approved, update status properties
        updatedRequests = allRequests.map((req: any) => 
          req.id === activeRequest.id ? { ...req, status: newStatus } : req
        )
        const updatedObj = { ...activeRequest, status: newStatus }
        setActiveRequest(updatedObj)
        localStorage.setItem("active_approval_request", JSON.stringify(updatedObj))
        
        // Also fire the new approved display card event trigger
        localStorage.setItem("latest_approved_display", JSON.stringify(updatedObj))
        window.dispatchEvent(new Event("newApprovedCardAdded"))
      }
      
      localStorage.setItem("dashboard_requests", JSON.stringify(updatedRequests))
    }

    // Broadcast state reload globally to the navigation component
    window.dispatchEvent(new Event("master_storage_update"))
  }

  if (!activeRequest) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-400 bg-slate-50 max-w-md mx-auto">
        Select a notification from the top bar to inspect asset request credentials.
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden transition-all duration-300">
      <div className={`p-4 text-white font-semibold flex items-center justify-between ${
        activeRequest.status === "approved" ? "bg-green-600" :
        activeRequest.status === "rejected" ? "bg-red-600" : "bg-blue-600"
      }`}>
        <span>Asset Deployment Assessment</span>
        <span className="text-xs uppercase bg-white/20 px-2 py-0.5 rounded-full tracking-wider">
          {activeRequest.status}
        </span>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-start gap-3">
          <FiUser className="text-slate-400 mt-1 shrink-0" size={18} />
          <div>
            <h5 className="text-xs font-semibold text-slate-400 uppercase">Employee Name</h5>
            <p className="text-sm font-medium text-slate-800">{activeRequest.employeeName}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <FiBox className="text-slate-400 mt-1 shrink-0" size={18} />
          <div>
            <h5 className="text-xs font-semibold text-slate-400 uppercase">Asset Requested</h5>
            <p className="text-sm font-medium text-slate-800">{activeRequest.asset}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <FiLayers className="text-slate-400 mt-1 shrink-0" size={18} />
          <div>
            <h5 className="text-xs font-semibold text-slate-400 uppercase">Category</h5>
            <p className="text-sm font-medium text-slate-800">{activeRequest.category}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <FiFileText className="text-slate-400 mt-0.5 shrink-0" size={18} />
          <div>
            <h5 className="text-xs font-semibold text-slate-400 uppercase">Note / Reason</h5>
            <p className="text-xs text-slate-600 italic mt-0.5">"{activeRequest.reason}"</p>
          </div>
        </div>

        {activeRequest.status === "pending" && (
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => updateRequestStatus("approved")}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-green-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700 active:scale-95 transition-all"
            >
              <FiCheckCircle size={16} /> Approve
            </button>
            <button
              onClick={() => updateRequestStatus("rejected")}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-red-50 border border-red-200 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 active:scale-95 transition-all"
            >
              <FiXCircle size={16} /> Reject
            </button>
          </div>
        )}

        {activeRequest.status === "approved" && (
          <div className="bg-green-50 border border-green-200 text-green-800 text-xs p-3 rounded-xl flex items-center gap-2">
            <FiCheckCircle className="shrink-0 text-green-600" size={16} />
            <span>This request has been approved. The item will automatically disappear from your pending notifications channel.</span>
          </div>
        )}
      </div>
    </div>
  )
}