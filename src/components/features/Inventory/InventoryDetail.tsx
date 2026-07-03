"use client"

import React, { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { 
  FiArrowLeft, 
  FiCalendar, 
  FiPackage, 
  FiShield, 
  
  FiTag,
  FiFileText,
  FiCpu,
  FiHardDrive,
  FiLayers,
  
  FiHash,
  FiEdit3 
} from "react-icons/fi"

export function InventoryDetail() {
  const { id } = useParams<{ id: string }>() 
  const location = useLocation()
  const navigate = useNavigate()
  
  const [assetItem, setAssetItem] = useState<any>(location.state?.item || null)
  const [canEdit, setCanEdit] = useState(false)
  const [loading, setLoading] = useState(!assetItem)

  useEffect(() => {
   
    try {
      const localUserData = localStorage.getItem("user")
      if (localUserData) {
        const user = JSON.parse(localUserData)
        const userRole = user.role?.toLowerCase()
        
       
        if (userRole === "superadmin" || userRole === "manager") {
          setCanEdit(true)
        } else {
          setCanEdit(false)
        }
      }
    } catch (err) {
      console.error("Failed to parse user role permissions:", err)
      setCanEdit(false)
    }

    
    if (!assetItem && id) {
      try {
        const cachedData = localStorage.getItem("inventory_data")
        if (cachedData) {
          const parsedList = JSON.parse(cachedData)
          const foundItem = parsedList.find((item: any) => String(item.asset_id || item.id) === String(id))
          
          if (foundItem) {
            setAssetItem(foundItem)
          }
        }
      } catch (err) {
        console.error("Error recovering item state from fallback sync:", err)
      } finally {
        setLoading(false)
      }
    }
  }, [id, assetItem])

  const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case "available": return "bg-green-50 text-green-700 border-green-200"
      case "assigned": return "bg-blue-50 text-blue-700 border-blue-200"
      case "maintenance": return "bg-amber-50 text-amber-700 border-amber-200"
     
      case "retired": return "bg-red-100 text-red-800 border-red-200 font-bold"
      default: return "bg-slate-50 text-slate-700 border-slate-200"
    }
  }

  const getConditionStyles = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case "new": return "bg-emerald-50 text-emerald-700 border-emerald-200"
      case "good": return "bg-indigo-50 text-indigo-700 border-indigo-200"
      case "fair": return "bg-orange-50 text-orange-700 border-orange-200"
      case "poor": return "bg-rose-50 text-rose-700 border-rose-200"
      default: return "bg-slate-50 text-slate-600 border-slate-200"
    }
  }

  const handleEditRedirect = () => {
    if (!canEdit) return
    navigate("/inventory/add", { 
      state: { 
        id: assetItem.asset_id || assetItem.id,
        editItem: assetItem 
      } 
    })
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto my-32 text-center text-slate-500 text-sm animate-pulse">
        Loading...
      </div>
    )
  }

  if (!assetItem) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 text-center bg-white border border-slate-200 rounded-xl shadow-sm space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <FiPackage size={24} />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">No Asset Selected</h3>
        <p className="text-sm text-slate-500">Please select an item directly from the inventory dashboard table.</p>
        <Button onClick={() => navigate("/inventory")} className="bg-blue-600 hover:bg-blue-700 text-white w-full">
          Return to Dashboard
        </Button>
      </div>
    )
  }

  const displayCategory = assetItem.category?.name || assetItem.category || "Uncategorized"

  const API_REAL_IP = "http://192.168.100.185:1011"
  
  
  let rawImageSource = ""
  if (assetItem.media && assetItem.media.length > 0) {
    rawImageSource = assetItem.media[0].original_url || assetItem.media[0].preview_url || ""
  } else {
    rawImageSource = assetItem.preview_url || assetItem.image_url || assetItem.image || ""
  }
  
  let displayImage = ""

  if (rawImageSource) {
    if (rawImageSource.startsWith("data:image")) {
      displayImage = rawImageSource
    } else if (rawImageSource.startsWith("http://localhost")) {
      displayImage = rawImageSource.replace("http://localhost", API_REAL_IP)
    } else if (rawImageSource.startsWith("http")) {
      displayImage = rawImageSource
    } else {
      const cleanPath = rawImageSource.startsWith("/") ? rawImageSource : `/${rawImageSource}`
      displayImage = `${API_REAL_IP}${cleanPath}`
    }
  }

  return (
    <div className="max-w-8xl bg-[#F3F0F7] mx-auto p-6 md:p-10 space-y-6 text-blue-950 font-sans">
      
     
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate("/inventory")} 
          className="flex items-center gap-2 text-blue-500 hover:text-blue-700 -ml-2 group transition-colors"
        >
          <FiArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back
        </Button>

        
        {canEdit && (
          <Button 
            onClick={handleEditRedirect}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 shadow-sm text-xs rounded-lg px-4 py-2"
          >
            <FiEdit3 size={14} />
            Edit Asset
          </Button>
        )}
      </div>

     
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-600 font-semibold">
  {assetItem.asset_code || assetItem.asset_id || assetItem.id}
</span>
            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border tracking-wide uppercase ${getStatusStyles(assetItem.status)}`}>
              {assetItem.status || "unspecified"}
            </span>
            {"condition" in assetItem && assetItem.condition && (
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border tracking-wide uppercase ${getConditionStyles(assetItem.condition)}`}>
                Condition: {assetItem.condition}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 pt-1">
            {assetItem.name}
          </h1>
        </div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
              <FiPackage size={18} className="text-blue-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-800">Device Specifications</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-6">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 block">Category Identifier</span>
                <span className="text-sm font-medium text-slate-800 flex items-center gap-2 capitalize">
                  <FiTag className="text-slate-400" size={14} /> {displayCategory}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400 block">Model Build</span>
                <span className="text-sm font-medium text-slate-800 flex items-center gap-2">
                  <FiCpu className="text-slate-400" size={14} /> {assetItem.model || "Not Specified"}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400 block">RAM Capacity</span>
                <span className="text-sm font-medium text-slate-800 flex items-center gap-2">
                  <FiLayers className="text-slate-400" size={14} /> {assetItem.ram_capacity || assetItem.ram || "Not Specified"}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400 block">Storage Volume</span>
                <span className="text-sm font-medium text-slate-800 flex items-center gap-2">
                  <FiHardDrive className="text-slate-400" size={14} /> {assetItem.storage || "Not Specified"}
                </span>
              </div>
              <div className="col-span-1 md:col-span-2 space-y-1 pt-1 border-t border-dashed border-slate-100">
                <span className="text-xs text-slate-400 block">Serial Number Base Log</span>
                <span className="text-sm font-mono text-slate-700 flex items-center gap-2 bg-slate-50 px-2 py-1 rounded border border-slate-200/60 w-fit select-all">
                  <FiHash className="text-slate-400" size={14} /> {assetItem.serial_number || "No hardware serial tracking registered"}
                </span>
              </div>
            </div>
          </div>

          
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
              <FiCalendar size={18} className="text-blue-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-800">Procurement & Lifecycle</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 block">Date of Purchase</span>
                <span className="text-sm font-medium text-slate-800 flex items-center gap-2">
                  <FiCalendar className="text-slate-400" /> {assetItem.purchased_date || assetItem.purchase_date || "N/A"}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-slate-400 block">Warranty Period Arrangement</span>
                <span className="text-sm font-medium text-slate-800 flex items-center gap-2">
                  <FiShield className="text-slate-400" /> {assetItem.warranty_period || assetItem.warranty ? `${assetItem.warranty_period || assetItem.warranty} Months` : "No active arrangement logs found"}
                </span>
              </div>
            </div>
          </div>
        </div>

       
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4 sticky top-6">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <FiFileText size={18} className="text-blue-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-800">Profile Image</h2>
          </div>
          
          <div className="aspect-square w-full bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center overflow-hidden p-2 shadow-inner">
            {displayImage ? (
              <img 
                src={displayImage} 
                alt={`${assetItem.name} hardware visualization`} 
                className="w-full h-full object-contain rounded-md transition-transform duration-200 hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const parent = target.parentElement
                  if (parent) {
                    const fallbackPlaceholder = parent.querySelector('.image-fallback-placeholder')
                    if (fallbackPlaceholder) fallbackPlaceholder.classList.remove('hidden')
                  }
                }}
              />
            ) : null}

            <div className={`image-fallback-placeholder flex flex-col items-center justify-center text-slate-400 text-center space-y-2 p-4 ${displayImage ? 'hidden' : ''}`}>
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200/60 shadow-xs">
                <FiPackage size={20} />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-slate-700">No Image Attachment</p>
                <p className="text-[10px] text-slate-400 max-w-[180px]">No visual media configurations uploaded.</p>
              </div>
            </div>
          </div>
          
         
        </div>
      </div>
    </div>
  )
}