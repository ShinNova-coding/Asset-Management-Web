"use client"

import React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { 
  FiArrowLeft, 
  FiCalendar, 
  FiPackage, 
  FiShield, 
  FiPhone, 
  FiMapPin, 
  FiBriefcase, 
  FiTag,
  FiFileText,
  FiCpu,
  FiHardDrive,
  FiLayers
} from "react-icons/fi"

export function InventoryDetail() {
  const location = useLocation()
  const navigate = useNavigate()
  
  const assetItem = location.state?.item

  if (!assetItem) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 text-center bg-white border border-slate-200 rounded-xl shadow-sm space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <FiPackage size={24} />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">No Asset Selected</h3>
        <p className="text-sm text-slate-500">Please select an item directly from the inventory dashboard overview table to look over its documentation profiles.</p>
        <Button onClick={() => navigate(-1)} className="bg-blue-600 hover:bg-blue-700 text-white w-full">
          Return to Dashboard
        </Button>
      </div>
    )
  }

  const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case "assigned":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "available":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "maintenance":
        return "bg-amber-50 text-amber-700 border-amber-200"
        case "pending":
          return "bg-amber-50 text-amber-700 border-amber-200"
        case "retired":
          return "bg-red-300 text-red-800 border-red-100"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-6 text-slate-950 font-sans">
      
      {/* Navigation Row */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 -ml-2 group transition-colors"
      >
        <FiArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to Inventory Dashboard
      </Button>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-600">
              {assetItem.asset}
            </span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${getStatusStyles(assetItem.status)}`}>
              {assetItem.status || "Unspecified"}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 pt-1">
            {assetItem.name}
          </h1>
        </div>
      </div>

      {/* Detail Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Columns - Meta Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Box Segment 1: Device Specifications */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
              <FiPackage size={18} className="text-blue-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Device Specifications</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-6">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 block">Category</span>
                <span className="text-sm font-medium text-slate-800 flex items-center gap-2">
                  <FiTag className="text-slate-400" size={14} /> {assetItem.category || "Laptops"}
                </span>
              </div>
              
            

              <div className="space-y-1">
                <span className="text-xs text-slate-400 block">Model Variation</span>
                <span className="text-sm font-medium text-slate-800 flex items-center gap-2">
                  <FiCpu className="text-slate-400" size={14} /> {assetItem.model || "Not Specified"}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-400 block">RAM Configuration</span>
                <span className="text-sm font-medium text-slate-800 flex items-center gap-2">
                  <FiLayers className="text-slate-400" size={14} /> {assetItem.ram || "Not Specified"}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-400 block">Storage Capacity</span>
                <span className="text-sm font-medium text-slate-800 flex items-center gap-2">
                  <FiHardDrive className="text-slate-400" size={14} /> {assetItem.storage || "Not Specified"}
                </span>
              </div>

              {assetItem.assetIdAlt && (
                <div className="col-span-1 md:col-span-2 space-y-1 pt-1">
                  <span className="text-xs text-slate-400 block">Secondary Mapping Reference Tag</span>
                  <span className="text-sm font-mono text-slate-600">
                    {assetItem.assetIdAlt}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Box Segment 2: Procurement Info */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
              <FiCalendar size={18} className="text-blue-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Procurement</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 block">Date of Purchase</span>
                <span className="text-sm font-medium text-slate-800 flex items-center gap-2">
                  <FiCalendar className="text-slate-400" /> {assetItem.purchase || assetItem.date || "N/A"}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400 block">Warranty Setup Logs</span>
                <span className="text-sm font-medium text-slate-800 flex items-center gap-2">
                  <FiShield className="text-slate-400" /> {assetItem.warranty || "No active arrangement logs found"}
                </span>
              </div>
            </div>
          </div>

          {/* Box Segment 3: Vendor Metadata */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
              <FiBriefcase size={18} className="text-blue-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Software House</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
              <div className="col-span-1 md:col-span-2 space-y-1">
                <span className="text-xs text-slate-400 block">Software House Name</span>
                <span className="text-sm font-medium text-slate-800">
                  {assetItem.shopName || "Insight Enterprise Global Inc."}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400 block">Phone Number</span>
                <span className="text-sm font-medium text-slate-800 flex items-center gap-2">
                  <FiPhone className="text-slate-400" /> {assetItem.phone || "+95 9*********"}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400 block">Location Address</span>
                <span className="text-sm font-medium text-slate-800 flex items-center gap-2">
                  <FiMapPin className="text-slate-400" /> {assetItem.address || "Yangon"}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Sidebar - Attachment Canvas */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <FiFileText size={18} className="text-blue-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Profile Image</h2>
          </div>
          
          <div className="aspect-square w-full bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center overflow-hidden p-2">
            {assetItem.image ? (
              <img 
                src={assetItem.image} 
                alt={`${assetItem.name} profile view`} 
                className="w-full h-full object-contain rounded-md"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-400 text-center space-y-2 p-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200/60 shadow-inner">
                  <FiPackage size={20} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-medium text-slate-700">No Image Attachment</p>
                  <p className="text-[10px] text-slate-400 max-w-[180px]">No visual configuration diagrams uploaded for this specific asset group node.</p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}