"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { FiX } from "react-icons/fi"
import type { Maintenance } from "@/data/maintenance"

type Props = {
  open: boolean
  item?: Maintenance | null
  remarkText: string
  onChange: (v: string) => void
  onClose: () => void
  onSubmit: () => void
}

export function MaintenanceRemark({ open, item, remarkText, onChange, onClose, onSubmit }: Props) {
  if (!open || !item) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        
        
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Maintenance Remark</h2>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          
          <div className="grid gap-4 sm:grid-cols-2 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Employee Name</p>
              <p className="text-sm font-medium text-slate-800 mt-0.5">{item.employee_name ?? "-"}</p>
            </div>

            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Asset Code</p>
              <p className="text-sm font-medium text-slate-800 mt-0.5">{item.asset_code ?? "-"}</p>
            </div>

            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Category</p>
              <p className="text-sm font-medium text-slate-800 mt-0.5">{item.category ?? "-"}</p>
            </div>

            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Approver</p>
              <p className="text-sm font-medium text-slate-800 mt-0.5">{item.approver ?? "-"}</p>
            </div>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-slate-900">Reason for material breakdown</span>
            <textarea
              value={remarkText}
              onChange={(e) => onChange(e.target.value)}
              rows={5}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
              placeholder="Please describe the issue or reason for maintenance..."
            />
          </label>

          
          <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 p-4 sm:flex-row sm:justify-end -mx-6 -mb-6 mt-5">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onSubmit} className="bg-blue-500 hover:bg-blue-600 text-white">
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MaintenanceRemark