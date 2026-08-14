import { useState, useEffect } from "react"
import { Check, X, User, Box, Layers, FileText } from "lucide-react"

export function NewApprovedCard() {
  const [approvedData, setApprovedData] = useState<any>(null)

  const loadApprovedData = () => {
    const raw = localStorage.getItem("latest_approved_display")
    if (raw) setApprovedData(JSON.parse(raw))
  }

  useEffect(() => {
    loadApprovedData()
    window.addEventListener("newApprovedCardAdded", loadApprovedData)
    window.addEventListener("master_storage_update", loadApprovedData)
    
    return () => {
      window.removeEventListener("newApprovedCardAdded", loadApprovedData)
      window.removeEventListener("master_storage_update", loadApprovedData)
    }
  }, [])

  const handleClearCard = () => {
    localStorage.removeItem("latest_approved_display")
    setApprovedData(null)
  }

  if (!approvedData) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 transition-all">
      <div className="absolute inset-0" onClick={handleClearCard} />
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl z-10 transform scale-100 transition-all">
        <button onClick={handleClearCard} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 rounded-full p-1 transition">
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 text-emerald-800 font-bold mb-5">
          <div className="bg-emerald-600 text-white rounded-full p-1.5 flex items-center justify-center shadow-xs">
            <Check size={16} strokeWidth={3} />
          </div>
          <div>
            <span className="text-sm font-bold text-slate-900 block">Asset Assignment Confirmed</span>
          </div>
        </div>

        <div className="space-y-4 border-t border-slate-100 pt-4">
          <div className="flex items-start gap-2.5 bg-slate-50/60 p-3 rounded-xl border border-slate-100">
            <User className="text-blue-600 mt-0.5 shrink-0" size={16} />
            <div>
              <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Employee Name</h6>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">{approvedData.employeeName}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 bg-slate-50/60 p-3 rounded-xl border border-slate-100">
            <Box className="text-amber-600 mt-0.5 shrink-0" size={16} />
            <div>
              <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Asset Requested</h6>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">{approvedData.asset}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 bg-slate-50/60 p-3 rounded-xl border border-slate-100">
            <Layers className="text-purple-600 mt-0.5 shrink-0" size={16} />
            <div>
              <h6 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</h6>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">{approvedData.category || "General Assets"}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 bg-emerald-50/40 p-4 rounded-xl border border-emerald-100">
            <FileText className="text-emerald-600 mt-0.5 shrink-0" size={16} />
            <div>
              <h6 className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Notes / Reason</h6>
              <p className="text-xs text-slate-700 italic mt-1.5 leading-relaxed">
                "{approvedData.reason || "No specification notes attached."}"
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-2">
          <button onClick={handleClearCard} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm py-2.5 rounded-xl transition shadow-xs">
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  )
}