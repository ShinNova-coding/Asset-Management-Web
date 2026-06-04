// src/components/layout/Navigation.tsx
import { useState, useEffect } from "react"
import { ChevronDown, LogOut, Bell, Check, X } from "lucide-react" 
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useNavigate } from "react-router-dom"
import { FiCheckCircle, FiUser, FiBox, FiLayers, FiFileText } from "react-icons/fi" // Matching inventory styling icons

export default function Navigation() {
  const [open, setOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false) 
  const [hasUnread, setHasUnread] = useState(true) 
  const navigate = useNavigate()

  // State initialization with localStorage tracking
  const [notifications, setNotifications] = useState<any[]>(() => {
    const cached = localStorage.getItem("dashboard_requests")
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        if (parsed && parsed.length > 0) return parsed
      } catch (e) {
        console.error("Failed parsing requests configuration storage", e)
      }
    }
    return [
      { id: 1, employeeName: "John Doe", asset: "MacBook Air", category: "Laptops", reason: "Needs an upgrade for iOS development targets.", time: "5m ago" },
      { id: 2, employeeName: "Michael Scott", asset: "Redmibook 15", category: "Laptops", reason: "Needs an upgrade", time: "1h ago" },
    ]
  })

  // Approval Modal Overlay State System (Identical architecture to your Inventory Delete Modal)
  const [approveModal, setApproveModal] = useState<{ isOpen: boolean; targetData: any | null }>({
    isOpen: false,
    targetData: null,
  })

  // Synchronize structural updates to storage arrays
  useEffect(() => {
    localStorage.setItem("dashboard_requests", JSON.stringify(notifications))
  }, [notifications])

  // Global browser sync event tracker
  useEffect(() => {
    const syncLocalState = () => {
      const cached = localStorage.getItem("dashboard_requests")
      if (cached) setNotifications(JSON.parse(cached))
    }
    window.addEventListener("master_storage_update", syncLocalState)
    return () => window.removeEventListener("master_storage_update", syncLocalState)
  }, [])

  function handleToggleNotifications() {
    setShowNotifications(!showNotifications)
    if (!showNotifications) {
      setHasUnread(false)
    }
  }

  // Intercept and open the confirmation card overlay view
  function handleApproveTrigger(item: any, e: React.MouseEvent) {
    e.stopPropagation()
    setShowNotifications(false) // Dismiss dropdown drawer
    setApproveModal({ isOpen: true, targetData: item })
  }

  // Final confirmation logic execution
  function handleConfirmApproval() {
    if (approveModal.targetData) {
      const targetId = approveModal.targetData.id
      const updated = notifications.filter(n => n.id !== targetId)
      
      setNotifications(updated)
      localStorage.setItem("dashboard_requests", JSON.stringify(updated))
      
      // Close the overlay modal safely
      setApproveModal({ isOpen: false, targetData: null })
      window.dispatchEvent(new Event("master_storage_update"))
    }
  }

  function handleReject(id: number, e: React.MouseEvent) {
    e.stopPropagation() 
    const updated = notifications.filter(n => n.id !== id)
    setNotifications(updated)
    localStorage.setItem("dashboard_requests", JSON.stringify(updated))
    window.dispatchEvent(new Event("master_storage_update"))
  }

  function handleLogout() {
    localStorage.removeItem("token") 
    setOpen(false)
    navigate("/", { replace: true }) 
  }

  return (
    <nav className="sticky top-0 z-30 flex h-[50px]  items-center justify-between border-b border-slate-400 bg-blue-50 px-2">

      {/* LEFT BLOCK */}
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-slate-500 hover:bg-slate-100" />
      </div>

      {/* RIGHT BLOCK */}
      <div className="flex items-center gap-4">

        {/* NOTIFICATION DRAW TRIGGER */}
        <div className="relative">
          <button 
            onClick={handleToggleNotifications}
            className="relative rounded-full p-2 hover:bg-slate-100 transition"
          >
            <Bell className="h-5 w-5 text-slate-500" />
            {hasUnread && notifications.length > 0 && (
              <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-red-500" />
            )}
          </button>

          {/* DROPDOWN MENU ELEMENT CONTAINER */}
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
              
              <div className="absolute right-0 z-20 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-xl">
                <h4 className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                  Notifications
                </h4>
                
                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div 
                        key={n.id} 
                        className="p-3 hover:bg-slate-50 rounded-lg transition text-left space-y-2"
                      >
                        <div>
                          <p className="text-sm text-slate-700 font-medium">
                            {n.employeeName} requested a {n.asset}
                          </p>
                          <span className="text-xs text-slate-400">{n.time}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={(e) => handleApproveTrigger(n, e)}
                            className="flex flex-1 items-center justify-center gap-1 rounded-md bg-green-600 py-1.5 text-xs font-medium text-white transition hover:bg-green-700 active:scale-95 shadow-xs"
                          >
                            <Check className="h-3.5 w-3.5" />
                            Approve
                          </button>
                          
                          <button
                            onClick={(e) => handleReject(n.id, e)}
                            className="flex flex-1 items-center justify-center gap-1 rounded-md bg-red-50 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 active:scale-95 border border-red-200"
                          >
                            <X className="h-3.5 w-3.5" />
                            Reject
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-slate-400">
                      No pending requests
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* PROFILE BLOCK */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 rounded-full bg-[#2F6FED] px-3 py-1.5 text-white transition hover:bg-[#1F5FE0]"
          >
            <img
              src="https://img.magnific.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg?semt=ais_hybrid&w=740&q=80"
              alt="Admin"
              className="h-8 w-8 rounded-full border border-blue-300 object-cover"
            />
            <span className="hidden text-sm font-semibold sm:block">Admin User</span>
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
          </button>

          {open && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
              <div className="absolute right-0 z-20 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>

      </div>

      {/* FULL SCREEN BLUR MODAL: Triggers when clicking approve inside notification drawer */}
      {approveModal.isOpen && approveModal.targetData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4 border border-slate-100 space-y-4 text-left">
            
            {/* Emerald Header Indicator Icon Layout */}
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-50 text-green-600">
              <FiCheckCircle size={24} />
            </div>

            <div className="space-y-1 text-center">
              <h3 className="text-lg font-semibold text-slate-900">Confirm Asset Deployment</h3>
             
            </div>

            {/* Parameter Field Mapping Grid Blocks matching requested properties */}
            <div className="space-y-3 pt-2 text-sm border-t border-b border-slate-100 py-3">
              
              {/* Employee */}
              <div className="flex items-center gap-3 text-slate-700">
                <FiUser className="text-slate-400 shrink-0" size={16} />
                <div className="overflow-hidden">
                  <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Employee Name</span>
                  <span className="font-medium text-slate-800">{approveModal.targetData.employeeName}</span>
                </div>
              </div>

              {/* Asset */}
              <div className="flex items-center gap-3 text-slate-700">
                <FiBox className="text-slate-400 shrink-0" size={16} />
                <div className="overflow-hidden">
                  <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Asset Requested</span>
                  <span className="font-medium text-slate-800">{approveModal.targetData.asset}</span>
                </div>
              </div>

              {/* Category */}
              <div className="flex items-center gap-3 text-slate-700">
                <FiLayers className="text-slate-400 shrink-0" size={16} />
                <div className="overflow-hidden">
                  <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Category</span>
                  <span className="font-medium text-slate-800">{approveModal.targetData.category}</span>
                </div>
              </div>

              {/* Note / Reason */}
              <div className="flex items-start gap-3 text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <FiFileText className="text-slate-400 shrink-0 mt-0.5" size={16} />
                <div className="overflow-hidden">
                  <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Note </span>
                  <p className="text-xs text-slate-600 italic mt-0.5">"{approveModal.targetData.reason}"</p>
                </div>
              </div>

            </div>

            {/* Action Dialog Controls */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setApproveModal({ isOpen: false, targetData: null })}
                className="w-full px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmApproval}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm transition-colors"
              >
                Confirm Approve
              </button>
            </div>

          </div>
        </div>
      )}

    </nav>
  )
}